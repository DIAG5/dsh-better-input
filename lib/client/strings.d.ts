/**
 * UI strings for dsh-better-input. First version picks the language once at
 * module load from the browser locale; a full locale-service integration can
 * replace this later without touching components.
 */
export type BetterInputStrings = {
    voiceStart: string;
    voiceStop: string;
    voiceBusy: string;
    voiceUnavailable: string;
    listening: string;
    transcribing: string;
    polishing: string;
    voiceFailed: string;
    polishFailedKeepOriginal: string;
    settingsTitle: string;
    settingsDescription: string;
    loading: string;
    saveFailed: string;
    languageLabel: string;
    languageHint: string;
    languagePlaceholder: string;
    recordingLimitLabel: string;
    recordingLimitHint: string;
    polishLabel: string;
    polishHint: string;
    on: string;
    off: string;
    polishModelLabel: string;
    polishModelHint: string;
    polishModelNone: string;
    polishPromptLabel: string;
    polishPromptHint: string;
    polishPromptPlaceholder: string;
    showDefaultPrompt: string;
    hideDefaultPrompt: string;
    defaultPromptLabel: string;
    routesStatus: string;
    routesUnavailable: string;
};
export declare function stringsForBrowser(): BetterInputStrings;
