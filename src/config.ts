/**
 * Shared constants and browser-side helpers for dsh-better-input.
 * Voice input through the browser Web Speech API, plus Host-side
 * AI polishing of transcripts.
 */

export const SETTINGS_NAMESPACE = 'dsh-better-input'

/** Recording is capped to avoid an abandoned session holding the mic forever. */
export const DEFAULT_MAX_RECORDING_SECONDS = 120

export const MAX_POLISH_PROMPT_LENGTH = 4000
export const MAX_OPTIMIZE_PROMPT_LENGTH = 4000
export const MAX_TRANSCRIPT_CHARACTERS = 12_000
export const MAX_OPTIMIZE_CHARACTERS = 12_000
export const MAX_POLISHED_CHARACTERS = 24_000
export const MAX_OPTIMIZED_CHARACTERS = 24_000
export const POLISH_TIMEOUT_MS = 20_000
export const OPTIMIZE_TIMEOUT_MS = 20_000

export interface BetterInputSettings {
  /** Recognition language, empty follows the dsh UI locale. */
  language: string
  /** Recording limit in seconds. */
  maxRecordingSeconds: number
  /** Enable Host LLM polishing after the transcript lands in the draft. */
  polishingEnabled: boolean
  /** dsh polish provider id (a route already registered in dsh). */
  polishProvider: string
  /** dsh polish model id. */
  polishModel: string
  /** Selected reasoning effort id for polish, empty uses the adapter's default (usually the lightest). */
  polishReasoningEffort: string
  /** Custom polish system prompt, empty for the built-in one. */
  polishPrompt: string
  /** Enable prompt optimization through the Host LLM. */
  optimizeEnabled: boolean
  /** dsh optimize provider id (reuses the same route pool as polish). */
  optimizeProvider: string
  /** dsh optimize model id. */
  optimizeModel: string
  /** Selected reasoning effort id for optimize, empty uses the adapter's default (usually the lightest). */
  optimizeReasoningEffort: string
  /** Custom optimize system prompt, empty for the built-in one. */
  optimizePrompt: string
  /** Number of recent conversation turns to include as context for optimization. 0 disables context. */
  contextTurns: number
}

/**
 * Out-of-the-box defaults: every toggle ON so new users get the full
 * experience immediately; reasoning effort left empty, which the Host
 * translates to "thinking off" (the model's `off` tier when it exposes
 * one, otherwise the adapter's own default).
 * Provider/model stay empty and get auto-filled on first settings page
 * load via SettingsController (first route returned by listRoutes).
 */
export const DEFAULT_SETTINGS: BetterInputSettings = Object.freeze({
  language: '',
  maxRecordingSeconds: DEFAULT_MAX_RECORDING_SECONDS,
  polishingEnabled: true,
  polishProvider: '',
  polishModel: '',
  polishReasoningEffort: '',
  polishPrompt: '',
  optimizeEnabled: true,
  optimizeProvider: '',
  optimizeModel: '',
  optimizeReasoningEffort: '',
  optimizePrompt: '',
  contextTurns: 3,
})

export type BetterInputSettingsPatch = Partial<BetterInputSettings>

/** One selectable reasoning effort tier for a specific model route. */
export interface ReasoningEffortInfo {
  /** Stable id passed to `LlmCallConfig.reasoningEffort`. */
  readonly id: string
  /** Display name shown in the settings dropdown. */
  readonly name: string
  /** Optional longer description shown in a tooltip. */
  readonly description?: string
}

/** A usable (provider, model) pair returned by dsh's LLM runtime, plus any
 *  reasoning-effort tiers the model reports as selectable. The efforts
 *  list is empty when the adapter / model does not expose thinking
 *  controls — in that case the settings dropdown is hidden entirely.
 *  `defaultEffort` is the adapter-configured baseline (generally the
 *  lightest tier); we use it as the placeholder label in the UI and as
 *  the fallback when the stored effort string is empty.
 */
export interface PolishRoute {
  readonly provider: string
  readonly providerName: string
  readonly model: string
  readonly modelName: string
  readonly reasoningEfforts: readonly ReasoningEffortInfo[]
  readonly defaultReasoningEffort?: string
}

export interface BetterInputSettingsView {
  available: boolean
  writable: boolean
  settings: BetterInputSettings
  overridden: string[]
  /** The built-in polish system prompt, shown in the settings page. */
  defaultPolishPrompt: string
  /** The built-in optimize system prompt, shown in the settings page. */
  defaultOptimizePrompt: string
}

/**
 * Recognition language derived from the browser locale. An empty stored
 * language follows the UI.
 */
export function recognitionLanguageFromBrowser(): string {
  if (typeof navigator === 'undefined') return 'en-US'
  const lang = (navigator.language ?? '').toLowerCase()
  return lang.startsWith('zh') ? 'zh-CN' : 'en-US'
}

export function effectiveRecognitionLanguage(stored: string): string {
  const value = stored.trim()
  return value === '' ? recognitionLanguageFromBrowser() : value
}

export function isValidRecordingLimit(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 1 && value <= 600
}

export function isValidContextTurns(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0 && value <= 20
}

export function validateSettings(settings: BetterInputSettings): void {
  if (!isValidRecordingLimit(settings.maxRecordingSeconds)) {
    throw new Error('dsh-better-input recording limit must be between 1 and 600 seconds')
  }
  if (!isValidContextTurns(settings.contextTurns)) {
    throw new Error('dsh-better-input context turns must be between 0 and 20')
  }
  if (settings.polishPrompt.trim().length > MAX_POLISH_PROMPT_LENGTH) {
    throw new Error('dsh-better-input polish prompt is too long')
  }
  if (settings.optimizePrompt.trim().length > MAX_OPTIMIZE_PROMPT_LENGTH) {
    throw new Error('dsh-better-input optimize prompt is too long')
  }
}

/** Resolve the effective recording cap from stored settings. */
export function effectiveRecordingSeconds(settings: Pick<BetterInputSettings, 'maxRecordingSeconds'>): number {
  return isValidRecordingLimit(settings.maxRecordingSeconds) ? settings.maxRecordingSeconds : DEFAULT_MAX_RECORDING_SECONDS
}
