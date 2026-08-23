import s from '@deepseek-ai/schemastery';
/** Host-only dsh settings schema; keep schemastery out of the browser bundle. */
export declare const BetterInputSettingsSchema: s<Schemastery.ObjectS<{
    language: s<string, string>;
    maxRecordingSeconds: s<number, number>;
    polishingEnabled: s<boolean, boolean>;
    polishProvider: s<string, string>;
    polishModel: s<string, string>;
    polishReasoningEffort: s<string, string>;
    polishPrompt: s<string, string>;
    optimizeEnabled: s<boolean, boolean>;
    optimizeProvider: s<string, string>;
    optimizeModel: s<string, string>;
    optimizeReasoningEffort: s<string, string>;
    optimizePrompt: s<string, string>;
    contextTurns: s<number, number>;
}>, Schemastery.ObjectT<{
    language: s<string, string>;
    maxRecordingSeconds: s<number, number>;
    polishingEnabled: s<boolean, boolean>;
    polishProvider: s<string, string>;
    polishModel: s<string, string>;
    polishReasoningEffort: s<string, string>;
    polishPrompt: s<string, string>;
    optimizeEnabled: s<boolean, boolean>;
    optimizeProvider: s<string, string>;
    optimizeModel: s<string, string>;
    optimizeReasoningEffort: s<string, string>;
    optimizePrompt: s<string, string>;
    contextTurns: s<number, number>;
}>>;
