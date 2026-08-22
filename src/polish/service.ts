import { createUserMessage } from '@deepseek-ai/dsh-llm'
import type { Context } from '@deepseek-ai/cordis'
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import type { SettingsScope } from '@deepseek-ai/dsh-settings'
import type { LlmModelInfo, LlmResolvedModelInfo, StreamChunk } from '@deepseek-ai/dsh-llm'
import { DEFAULT_SETTINGS, MAX_OPTIMIZED_CHARACTERS, MAX_OPTIMIZE_CHARACTERS, MAX_POLISHED_CHARACTERS, MAX_TRANSCRIPT_CHARACTERS, OPTIMIZE_TIMEOUT_MS, POLISH_TIMEOUT_MS, SETTINGS_NAMESPACE, validateSettings, type BetterInputSettings, type BetterInputSettingsPatch, type BetterInputSettingsView, type PolishRoute, type ReasoningEffortInfo } from '../config.js'
import { BetterInputSettingsSchema } from '../config-schema.js'
import { optimizeUserText, polishUserText, resolveOptimizeSystemPrompt, resolvePolishSystemPrompt, OPTIMIZE_SYSTEM_PROMPT, POLISH_SYSTEM_PROMPT } from './prompts.js'

/** Host-side settings file shape (flat for hand editing). */
type StoredSettings = BetterInputSettings

export class BetterInputPolishService extends TypertRemoteService {
  static inject = ['llm']
  private settings: SettingsScope<Record<string, unknown>> | undefined

  constructor(ctx: Context) {
    super(ctx, 'BetterInputPolish', { namespace: 'betterInput' })
    ctx.inject(['settings'], (settingsCtx) => {
      this.settings = settingsCtx.settings.register(settingsNamespace(SETTINGS_NAMESPACE), BetterInputSettingsSchema, {
        validate: validateSettings
      })
      settingsCtx.effect(() => () => {
        this.settings = undefined
      }, 'dsh-better-input settings lifecycle')
    })
  }

  getSettings(): BetterInputSettingsView {
    if (this.settings === undefined) {
      return {
        available: false,
        writable: false,
        settings: { ...DEFAULT_SETTINGS },
        overridden: [],
        defaultPolishPrompt: POLISH_SYSTEM_PROMPT,
        defaultOptimizePrompt: OPTIMIZE_SYSTEM_PROMPT
      }
    }
    const settings = flattenStoredSettings(this.settings.get())
    const provider = this.ctx.get('settings') as { describe?: (options: { redactSecrets: boolean }) => Array<{ ns: unknown; user?: unknown }>; writable?: boolean } | undefined
    const descriptor = provider?.describe?.({ redactSecrets: true })?.find((item) => String(item.ns) === SETTINGS_NAMESPACE)
    const user = descriptor?.user
    return {
      available: true,
      writable: provider?.writable ?? false,
      settings,
      overridden: isRecord(user) ? Object.keys(user) : [],
      defaultPolishPrompt: POLISH_SYSTEM_PROMPT,
      defaultOptimizePrompt: OPTIMIZE_SYSTEM_PROMPT
    }
  }

  async updateSettings(patch: BetterInputSettingsPatch, signal: AbortSignal): Promise<BetterInputSettingsView> {
    if (this.settings === undefined) return this.getSettings()
    signal.throwIfAborted()
    const current = flattenStoredSettings(this.settings.get())
    const next: BetterInputSettings = { ...current }
    for (const [key, value] of Object.entries(patch)) {
      if (value !== undefined) (next as unknown as Record<string, unknown>)[key] = value
    }
    validateSettings(next)
    await this.settings.update(next as unknown as Record<string, unknown>)
    return this.getSettings()
  }

  async listRoutes(): Promise<PolishRoute[]> {
    const routes: PolishRoute[] = []
    // NOTE: listRoutes intentionally skips per-model resolveModelInfo() calls.
    // Each resolution can require a roundtrip to the adapter/provider and a
    // registry with many models would make the settings page block for many
    // seconds on first open. Reasoning-effort metadata therefore arrives as
    // an empty array / undefined defaultEffort in the returned routes. The
    // settings UI hides the reasoning-effort dropdown entirely when the
    // list of efforts is empty, so users never see a half-populated menu.
    // We may add a dedicated resolveEfforts(provider, model) RPC in the
    // future if per-model lazy fetching becomes desirable.
    for (const provider of this.ctx.llm.listProviders()) {
      let models: readonly LlmModelInfo[]
      try {
        models = await this.ctx.llm.listModels(provider.id)
      } catch {
        continue
      }
      for (const model of models) {
        // NOTE: never assign an explicit `undefined` value. The Typert
        // gateway's boundary validation rejects any own-key holding
        // undefined as "not JSON-safe" after the Zod check passes, so
        // optional fields must simply be omitted.
        routes.push({
          provider: provider.id,
          providerName: provider.name,
          model: model.id,
          modelName: model.name,
          reasoningEfforts: []
        })
      }
    }
    return routes
  }

  /**
   * Lazily resolve reasoning efforts for a single route. Only called once the
   * settings UI actually displays that model's effort selector — so we never
   * blast the adapter/provide with hundreds of upfront resolveModelInfo calls.
   * Returns `{ efforts: [] }` (no defaultEffort key) if the metadata is
   * unavailable (adapter offline, model unknown, etc.).
   */
  async resolveModelEfforts(provider: string, model: string): Promise<{ efforts: readonly ReasoningEffortInfo[]; defaultEffort?: string }> {
    const resolved: LlmResolvedModelInfo | undefined = await (async () => {
      try {
        return await this.ctx.llm.resolveModelInfo(provider, model)
      } catch {
        return undefined
      }
    })()
    const reasoning = resolved?.reasoning
    const defaultEffort = reasoning?.defaultEffort != null ? String(reasoning.defaultEffort) : undefined
    // Optional fields are omitted rather than assigned undefined — the
    // gateway's JSON-safe boundary check rejects explicit undefined values.
    return {
      efforts: reasoning?.efforts?.map((effort) => ({
        id: String(effort.id),
        name: effort.name,
        ...(effort.description === undefined ? {} : { description: effort.description })
      })) ?? [],
      ...(defaultEffort === undefined ? {} : { defaultEffort })
    }
  }

  async polish(transcript: string, provider: string, model: string, signal: AbortSignal): Promise<string> {
    const raw = transcript.trim()
    if (raw === '' || raw.length > MAX_TRANSCRIPT_CHARACTERS || signal.aborted) return raw
    const settings = this.settings === undefined ? DEFAULT_SETTINGS : flattenStoredSettings(this.settings.get())
    const storedPrompt = settings.polishPrompt
    const effort = settings.polishReasoningEffort

    const routeProvider = provider.trim()
    const routeModel = model.trim()
    if (routeProvider === '' || routeModel === '') return raw

    const timeout = new AbortController()
    const timer = setTimeout(() => timeout.abort(), POLISH_TIMEOUT_MS)
    const forwardAbort = () => timeout.abort(signal.reason)
    signal.addEventListener('abort', forwardAbort, { once: true })

    try {
      const first = await this.completePolish(routeProvider, routeModel, raw, storedPrompt, effort, timeout.signal)
      if (first.trim() === raw && !timeout.signal.aborted && !signal.aborted) {
        // The model echoed the input unchanged; keep it rather than looping.
        return raw
      }
      return first
    } catch (error) {
      if (signal.aborted) return raw
      if (timeout.signal.aborted) throw new Error('The dsh LLM polishing request timed out')
      throw error instanceof Error ? error : new Error('The dsh LLM route did not complete polishing')
    } finally {
      clearTimeout(timer)
      signal.removeEventListener('abort', forwardAbort)
    }
  }

  async optimize(text: string, provider: string, model: string, signal: AbortSignal): Promise<string> {
    const raw = text.trim()
    if (raw === '' || raw.length > MAX_OPTIMIZE_CHARACTERS || signal.aborted) return raw
    const settings = this.settings === undefined ? DEFAULT_SETTINGS : flattenStoredSettings(this.settings.get())
    const storedPrompt = settings.optimizePrompt
    const effort = settings.optimizeReasoningEffort

    const routeProvider = provider.trim()
    const routeModel = model.trim()
    if (routeProvider === '' || routeModel === '') throw new Error('No dsh LLM route configured for prompt optimization')

    const timeout = new AbortController()
    const timer = setTimeout(() => timeout.abort(), OPTIMIZE_TIMEOUT_MS)
    const forwardAbort = () => timeout.abort(signal.reason)
    signal.addEventListener('abort', forwardAbort, { once: true })

    try {
      const result = await this.completeOptimize(routeProvider, routeModel, raw, storedPrompt, effort, timeout.signal)
      if (result.trim() === '' && !timeout.signal.aborted && !signal.aborted) {
        return raw
      }
      return result
    } catch (error) {
      if (signal.aborted) throw error
      if (timeout.signal.aborted) throw new Error('The dsh LLM optimize request timed out')
      throw error instanceof Error ? error : new Error('The dsh LLM route did not complete optimization')
    } finally {
      clearTimeout(timer)
      signal.removeEventListener('abort', forwardAbort)
    }
  }

  private async completePolish(provider: string, model: string, raw: string, storedPrompt: string, effort: string, signal: AbortSignal): Promise<string> {
    const config = await this.resolveEffortConfig(provider, model, effort, signal)
    const prepared = await this.ctx.llm.prepareCall(config, signal)
    const message = createUserMessage({
      content: [{ type: 'text', text: polishUserText(raw) }],
      source: { kind: 'user' }
    })
    const output = await collectText(prepared.stream({
      ...prepared.config,
      messages: [message],
      system: resolvePolishSystemPrompt(storedPrompt),
      signal
    }), MAX_POLISHED_CHARACTERS, 'polishing')
    if (output === '') throw new Error('The dsh LLM route returned no polished text')
    return output
  }

  private async completeOptimize(provider: string, model: string, raw: string, storedPrompt: string, effort: string, signal: AbortSignal): Promise<string> {
    const config = await this.resolveEffortConfig(provider, model, effort, signal)
    const prepared = await this.ctx.llm.prepareCall(config, signal)
    const message = createUserMessage({
      content: [{ type: 'text', text: optimizeUserText(raw) }],
      source: { kind: 'user' }
    })
    const output = await collectText(prepared.stream({
      ...prepared.config,
      messages: [message],
      system: resolveOptimizeSystemPrompt(storedPrompt),
      signal
    }), MAX_OPTIMIZED_CHARACTERS, 'optimization')
    if (output === '') throw new Error('The dsh LLM route returned no optimized text')
    return output
  }

  /**
   * Resolve the effective reasoning-effort wire config for one route. An
   * explicit stored selection is forwarded as-is. The empty default means
   * "thinking off": when the model advertises an `off` tier we send it, and
   * otherwise we omit the field so the adapter's own default applies.
   */
  private async resolveEffortConfig(provider: string, model: string, storedEffort: string, signal: AbortSignal): Promise<{ provider: string; model: string; reasoningEffort?: never }> {
    const selected = storedEffort.trim()
    if (selected !== '') return { provider, model, reasoningEffort: selected as never }
    try {
      const resolved = await this.ctx.llm.resolveModelInfo(provider, model, signal)
      const efforts = resolved.reasoning?.efforts ?? []
      const hasOff = efforts.some((effort) => String(effort.id) === 'off')
      return hasOff ? { provider, model, reasoningEffort: 'off' as never } : { provider, model }
    } catch {
      return { provider, model }
    }
  }
}

function flattenStoredSettings(raw: unknown): BetterInputSettings {
  const record = isRecord(raw) ? raw : {}
  return {
    language: text(record.language),
    maxRecordingSeconds: typeof record.maxRecordingSeconds === 'number'
      ? record.maxRecordingSeconds
      : DEFAULT_SETTINGS.maxRecordingSeconds,
    polishingEnabled: record.polishingEnabled !== false,
    polishProvider: text(record.polishProvider),
    polishModel: text(record.polishModel),
    polishReasoningEffort: text(record.polishReasoningEffort),
    polishPrompt: typeof record.polishPrompt === 'string' ? record.polishPrompt : '',
    optimizeEnabled: record.optimizeEnabled !== false,
    optimizeProvider: text(record.optimizeProvider),
    optimizeModel: text(record.optimizeModel),
    optimizeReasoningEffort: text(record.optimizeReasoningEffort),
    optimizePrompt: typeof record.optimizePrompt === 'string' ? record.optimizePrompt : ''
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function collectText(stream: AsyncIterable<StreamChunk>, maxCharacters: number, label: string): Promise<string> {
  let text = ''
  let sawDelta = false

  for await (const chunk of stream) {
    if (chunk.type === 'text-delta') {
      text += chunk.text
      if (text.length > maxCharacters) throw new Error(`The dsh LLM ${label} response is too large`)
      sawDelta = true
      continue
    }

    if (chunk.type === 'finish' && (chunk.reason.kind === 'error' || chunk.reason.kind === 'aborted')) {
      throw new Error(`The dsh LLM route did not complete ${label}`)
    }

    if (!sawDelta && chunk.type === 'block-end' && chunk.block.type === 'text') {
      text += chunk.block.text
      if (text.length > maxCharacters) throw new Error(`The dsh LLM ${label} response is too large`)
    }
  }

  return text.trim()
}
