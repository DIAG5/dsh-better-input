/**
 * Shared constants and browser-side helpers for dsh-better-input.
 * Voice input through the browser Web Speech API, plus Host-side
 * AI polishing of transcripts.
 */
export declare const SETTINGS_NAMESPACE = "dsh-better-input";
/** Recording is capped to avoid an abandoned session holding the mic forever. */
export declare const DEFAULT_MAX_RECORDING_SECONDS = 120;
export declare const MAX_POLISH_PROMPT_LENGTH = 4000;
export declare const MAX_TRANSCRIPT_CHARACTERS = 12000;
export declare const MAX_POLISHED_CHARACTERS = 24000;
export declare const POLISH_TIMEOUT_MS = 20000;
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
    /** Custom polish system prompt, empty for the built-in one. */
    polishPrompt: string;
}
export declare const DEFAULT_SETTINGS: BetterInputSettings;
export type BetterInputSettingsPatch = Partial<BetterInputSettings>;
export interface PolishRoute {
    provider: string;
    providerName: string;
    model: string;
    modelName: string;
}
export interface BetterInputSettingsView {
    available: boolean;
    writable: boolean;
    settings: BetterInputSettings;
    overridden: string[];
    /** The built-in polish system prompt, shown in the settings page. */
    defaultPolishPrompt: string;
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
