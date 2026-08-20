/**
 * Shared constants and browser-side helpers for dsh-better-input.
 * Voice input through the browser Web Speech API, plus Host-side
 * AI polishing of transcripts.
 */

export const SETTINGS_NAMESPACE = 'dsh-better-input'

/** Recording is capped to avoid an abandoned session holding the mic forever. */
export const DEFAULT_MAX_RECORDING_SECONDS = 120

export const MAX_POLISH_PROMPT_LENGTH = 4000
export const MAX_TRANSCRIPT_CHARACTERS = 12_000
export const MAX_POLISHED_CHARACTERS = 24_000
export const POLISH_TIMEOUT_MS = 20_000

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
  /** Custom polish system prompt, empty for the built-in one. */
  polishPrompt: string
}

export const DEFAULT_SETTINGS: BetterInputSettings = Object.freeze({
  language: '',
  maxRecordingSeconds: DEFAULT_MAX_RECORDING_SECONDS,
  polishingEnabled: false,
  polishProvider: '',
  polishModel: '',
  polishPrompt: ''
})

export type BetterInputSettingsPatch = Partial<BetterInputSettings>

export interface PolishRoute {
  provider: string
  providerName: string
  model: string
  modelName: string
}

export interface BetterInputSettingsView {
  available: boolean
  writable: boolean
  settings: BetterInputSettings
  overridden: string[]
  /** The built-in polish system prompt, shown in the settings page. */
  defaultPolishPrompt: string
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

export function validateSettings(settings: BetterInputSettings): void {
  if (!isValidRecordingLimit(settings.maxRecordingSeconds)) {
    throw new Error('dsh-better-input recording limit must be between 1 and 600 seconds')
  }
  if (settings.polishPrompt.trim().length > MAX_POLISH_PROMPT_LENGTH) {
    throw new Error('dsh-better-input polish prompt is too long')
  }
}

/** Resolve the effective recording cap from stored settings. */
export function effectiveRecordingSeconds(settings: Pick<BetterInputSettings, 'maxRecordingSeconds'>): number {
  return isValidRecordingLimit(settings.maxRecordingSeconds) ? settings.maxRecordingSeconds : DEFAULT_MAX_RECORDING_SECONDS
}
