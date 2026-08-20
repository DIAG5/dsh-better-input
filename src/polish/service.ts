import { createUserMessage } from '@deepseek-ai/dsh-llm'
import type { Context } from '@deepseek-ai/cordis'
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import type { SettingsScope } from '@deepseek-ai/dsh-settings'
import type { LlmModelInfo, StreamChunk } from '@deepseek-ai/dsh-llm'
import { DEFAULT_SETTINGS, MAX_POLISHED_CHARACTERS, MAX_TRANSCRIPT_CHARACTERS, POLISH_TIMEOUT_MS, SETTINGS_NAMESPACE, validateSettings, type BetterInputSettings, type BetterInputSettingsPatch, type BetterInputSettingsView, type PolishRoute } from '../config.js'
import { BetterInputSettingsSchema } from '../config-schema.js'
import { polishUserText, resolvePolishSystemPrompt, POLISH_SYSTEM_PROMPT } from './prompts.js'

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
        defaultPolishPrompt: POLISH_SYSTEM_PROMPT
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
      defaultPolishPrompt: POLISH_SYSTEM_PROMPT
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
    for (const provider of this.ctx.llm.listProviders()) {
      let models: LlmModelInfo[]
      try {
        models = await this.ctx.llm.listModels(provider.id)
      } catch {
        continue
      }
      for (const model of models) {
        routes.push({
          provider: provider.id,
          providerName: provider.name,
          model: model.id,
          modelName: model.name
        })
      }
    }
    return routes
  }

  async polish(transcript: string, provider: string, model: string, signal: AbortSignal): Promise<string> {
    const raw = transcript.trim()
    if (raw === '' || raw.length > MAX_TRANSCRIPT_CHARACTERS || signal.aborted) return raw
    const settings = this.settings === undefined ? DEFAULT_SETTINGS : flattenStoredSettings(this.settings.get())
    const storedPrompt = settings.polishPrompt

    const routeProvider = provider.trim()
    const routeModel = model.trim()
    if (routeProvider === '' || routeModel === '') return raw

    const timeout = new AbortController()
    const timer = setTimeout(() => timeout.abort(), POLISH_TIMEOUT_MS)
    const forwardAbort = () => timeout.abort(signal.reason)
    signal.addEventListener('abort', forwardAbort, { once: true })

    try {
      const first = await this.completePolish(routeProvider, routeModel, raw, storedPrompt, timeout.signal)
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

  private async completePolish(provider: string, model: string, raw: string, storedPrompt: string, signal: AbortSignal): Promise<string> {
    const prepared = await this.ctx.llm.prepareCall({ provider, model }, signal)
    const message = createUserMessage({
      content: [{ type: 'text', text: polishUserText(raw) }],
      source: { kind: 'user' }
    })
    const output = await collectText(prepared.stream({
      ...prepared.config,
      messages: [message],
      system: resolvePolishSystemPrompt(storedPrompt),
      signal
    }), MAX_POLISHED_CHARACTERS)
    if (output === '') throw new Error('The dsh LLM route returned no polished text')
    return output
  }
}

function flattenStoredSettings(raw: unknown): BetterInputSettings {
  const record = isRecord(raw) ? raw : {}
  return {
    language: text(record.language),
    maxRecordingSeconds: typeof record.maxRecordingSeconds === 'number'
      ? record.maxRecordingSeconds
      : DEFAULT_SETTINGS.maxRecordingSeconds,
    polishingEnabled: record.polishingEnabled === true,
    polishProvider: text(record.polishProvider),
    polishModel: text(record.polishModel),
    polishPrompt: typeof record.polishPrompt === 'string' ? record.polishPrompt : ''
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function collectText(stream: AsyncIterable<StreamChunk>, maxCharacters: number): Promise<string> {
  let text = ''
  let sawDelta = false

  for await (const chunk of stream) {
    if (chunk.type === 'text-delta') {
      text += chunk.text
      if (text.length > maxCharacters) throw new Error('The dsh LLM polishing response is too large')
      sawDelta = true
      continue
    }

    if (chunk.type === 'finish' && (chunk.reason.kind === 'error' || chunk.reason.kind === 'aborted')) {
      throw new Error('The dsh LLM route did not complete polishing')
    }

    if (!sawDelta && chunk.type === 'block-end' && chunk.block.type === 'text') {
      text += chunk.block.text
      if (text.length > maxCharacters) throw new Error('The dsh LLM polishing response is too large')
    }
  }

  return text.trim()
}
