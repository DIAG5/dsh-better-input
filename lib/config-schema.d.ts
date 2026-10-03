import s from '@deepseek-ai/schemastery';
/** Host-only dsh settings schema; keep schemastery out of the browser bundle. */
export declare const BetterInputSettingsSchema: s<Schemastery.ObjectS<NoInfer<{
    language: s<string, string, "defined">;
    maxRecordingSeconds: s<number, number, "defined">;
    polishingEnabled: s<boolean, boolean, "defined">;
    polishProvider: s<string, string, "defined">;
    polishModel: s<string, string, "defined">;
    polishReasoningEffort: s<string, string, "defined">;
    polishPrompt: s<string, string, "defined">;
    optimizeEnabled: s<boolean, boolean, "defined">;
    optimizeProvider: s<string, string, "defined">;
    optimizeModel: s<string, string, "defined">;
    optimizeReasoningEffort: s<string, string, "defined">;
    optimizePrompt: s<string, string, "defined">;
    contextTurns: s<number, number, "defined">;
    ocrProvider: s<string, string, "defined">;
    ocrModel: s<string, string, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    language: s<string, string, "defined">;
    maxRecordingSeconds: s<number, number, "defined">;
    polishingEnabled: s<boolean, boolean, "defined">;
    polishProvider: s<string, string, "defined">;
    polishModel: s<string, string, "defined">;
    polishReasoningEffort: s<string, string, "defined">;
    polishPrompt: s<string, string, "defined">;
    optimizeEnabled: s<boolean, boolean, "defined">;
    optimizeProvider: s<string, string, "defined">;
    optimizeModel: s<string, string, "defined">;
    optimizeReasoningEffort: s<string, string, "defined">;
    optimizePrompt: s<string, string, "defined">;
    contextTurns: s<number, number, "defined">;
    ocrProvider: s<string, string, "defined">;
    ocrModel: s<string, string, "defined">;
}>>, "plain">;
