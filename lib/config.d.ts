/**
 * Shared constants and browser-side helpers for dsh-better-input.
 * Voice input through the browser Web Speech API, plus Host-side
 * AI polishing of transcripts.
 */
export declare const SETTINGS_NAMESPACE = "dsh-better-input";
/** Recording is capped to avoid an abandoned session holding the mic forever. */
export declare const DEFAULT_MAX_RECORDING_SECONDS = 120;
export declare const MAX_POLISH_PROMPT_LENGTH = 4000;
export declare const MAX_OPTIMIZE_PROMPT_LENGTH = 4000;
export declare const MAX_TRANSCRIPT_CHARACTERS = 12000;
export declare const MAX_OPTIMIZE_CHARACTERS = 12000;
export declare const MAX_POLISHED_CHARACTERS = 24000;
export declare const MAX_OPTIMIZED_CHARACTERS = 24000;
export declare const POLISH_TIMEOUT_MS = 20000;
export declare const OPTIMIZE_TIMEOUT_MS = 20000;
export interface BetterInputSettings {
    /** Recognition language, empty follows the dsh UI locale. */
    language: string;
    /** Recording limit in seconds. */
    maxRecordingSeconds: number;
    /** Enable Host LLM polishing after the transcript lands in the draft. */
    polishingEnabled: boolean;
    /** dsh polish provider id (a route already registered in dsh). */
    polishProvider: string;
    /** dsh polish model id. */
    polishModel: string;
    /** Selected reasoning effort id for polish, empty uses the adapter's default (usually the lightest). */
    polishReasoningEffort: string;
    /** Custom polish system prompt, empty for the built-in one. */
    polishPrompt: string;
    /** Enable prompt optimization through the Host LLM. */
    optimizeEnabled: boolean;
    /** dsh optimize provider id (reuses the same route pool as polish). */
    optimizeProvider: string;
    /** dsh optimize model id. */
    optimizeModel: string;
    /** Selected reasoning effort id for optimize, empty uses the adapter's default (usually the lightest). */
    optimizeReasoningEffort: string;
    /** Custom optimize system prompt, empty for the built-in one. */
    optimizePrompt: string;
}
/**
 * Out-of-the-box defaults: every toggle ON so new users get the full
 * experience immediately; reasoning effort left empty, which the Host
 * translates to "thinking off" (the model's `off` tier when it exposes
 * one, otherwise the adapter's own default).
 * Provider/model stay empty and get auto-filled on first settings page
 * load via SettingsController (first route returned by listRoutes).
 */
export declare const DEFAULT_SETTINGS: BetterInputSettings;
export type BetterInputSettingsPatch = Partial<BetterInputSettings>;
/** One selectable reasoning effort tier for a specific model route. */
export interface ReasoningEffortInfo {
    /** Stable id passed to `LlmCallConfig.reasoningEffort`. */
    readonly id: string;
    /** Display name shown in the settings dropdown. */
    readonly name: string;
    /** Optional longer description shown in a tooltip. */
    readonly description?: string;
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
    readonly provider: string;
    readonly providerName: string;
    readonly model: string;
    readonly modelName: string;
    readonly reasoningEfforts: readonly ReasoningEffortInfo[];
    readonly defaultReasoningEffort?: string;
}
export interface BetterInputSettingsView {
    available: boolean;
    writable: boolean;
    settings: BetterInputSettings;
    overridden: string[];
    /** The built-in polish system prompt, shown in the settings page. */
    defaultPolishPrompt: string;
    /** The built-in optimize system prompt, shown in the settings page. */
    defaultOptimizePrompt: string;
}
/**
 * Recognition language derived from the browser locale. An empty stored
 * language follows the UI.
 */
export declare function recognitionLanguageFromBrowser(): string;
export declare function effectiveRecognitionLanguage(stored: string): string;
export declare function isValidRecordingLimit(value: number): boolean;
export declare function validateSettings(settings: BetterInputSettings): void;
/** Resolve the effective recording cap from stored settings. */
export declare function effectiveRecordingSeconds(settings: Pick<BetterInputSettings, 'maxRecordingSeconds'>): number;
