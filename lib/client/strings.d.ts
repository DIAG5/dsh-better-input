/**
 * Bilingual UI strings for dsh-better-input (zh/en). Registered as one
 * namespace into the DSH locale runtime; every slot component declares that
 * namespace and reads copy through the framework-injected `t` seat, so the
 * UI follows the DSH settings language switch automatically.
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
    polishNotConfigured: string;
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
    polishEffortLabel: string;
    polishEffortHint: string;
    polishPromptLabel: string;
    polishPromptHint: string;
    polishPromptPlaceholder: string;
    showDefaultPrompt: string;
    hideDefaultPrompt: string;
    defaultPromptLabel: string;
    effortDefaultLabel: string;
    effortLoadingLabel: string;
    routesStatus: string;
    routesUnavailable: string;
    optimizeButton: string;
    optimizeBusy: string;
    optimizeFailed: string;
    optimizeEmpty: string;
    optimizePanelTitle: string;
    optimizeOriginalLabel: string;
    optimizeOptimizedLabel: string;
    optimizeAdopt: string;
    optimizeCancel: string;
    optimizeNotConfigured: string;
    optimizeLabel: string;
    optimizeHint: string;
    optimizeModelLabel: string;
    optimizeModelHint: string;
    optimizeEffortLabel: string;
    optimizeEffortHint: string;
    optimizePromptLabel: string;
    optimizePromptHint: string;
    optimizePromptPlaceholder: string;
    contextTurnsLabel: string;
    contextTurnsHint: string;
    aboutTitle: string;
    aboutVersionLabel: string;
    aboutRepositoryLabel: string;
    aboutLicenseLabel: string;
    checkUpdateButton: string;
    checkingUpdate: string;
    updateUpToDate: string;
    updateAvailable: string;
    updateUnpublished: string;
    updateCheckFailed: string;
    updateCommandLabel: string;
    updateCommandNpxLabel: string;
    updateCommandPick: string;
};
export declare const zh: BetterInputStrings;
export declare const en: BetterInputStrings;
/** Namespace owning every BetterInput surface string. Registered into the DSH
 * locale runtime; slots declaring this namespace receive the typed `t`. */
export declare const BETTER_INPUT_NS = "better-input";
declare module '@deepseek-ai/dsh-client-ui-slots' {
    /** BetterInput dictionary keys (one shared key set, zh/en bilingual). */
    interface LocaleNamespaceMap {
        'better-input': keyof BetterInputStrings;
    }
}
