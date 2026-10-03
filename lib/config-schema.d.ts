import s from '@deepseek-ai/schemastery';
/**
 * Host-only dsh settings schema; keep schemastery out of the browser bundle.
 *
 * Exported as the plugin's `Config` from `index.ts` so the Loader can own the
 * entry. Every field must be marked `.volatile()`: dsh 0.2.0's `SettingsForms`
 * only projects fields that sit under a volatile node, and rejects writes to
 * any path outside one.
 */
export declare const BetterInputSettingsSchema: s<Schemastery.ObjectS<NoInfer<{
    language: s<string, string, "volatile-defined">;
    maxRecordingSeconds: s<number, number, "volatile-defined">;
    polishingEnabled: s<boolean, boolean, "volatile-defined">;
    polishProvider: s<string, string, "volatile-defined">;
    polishModel: s<string, string, "volatile-defined">;
    polishReasoningEffort: s<string, string, "volatile-defined">;
    polishPrompt: s<string, string, "volatile-defined">;
    optimizeEnabled: s<boolean, boolean, "volatile-defined">;
    optimizeProvider: s<string, string, "volatile-defined">;
    optimizeModel: s<string, string, "volatile-defined">;
    optimizeReasoningEffort: s<string, string, "volatile-defined">;
    optimizePrompt: s<string, string, "volatile-defined">;
    contextTurns: s<number, number, "volatile-defined">;
    ocrProvider: s<string, string, "volatile-defined">;
    ocrModel: s<string, string, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    language: s<string, string, "volatile-defined">;
    maxRecordingSeconds: s<number, number, "volatile-defined">;
    polishingEnabled: s<boolean, boolean, "volatile-defined">;
    polishProvider: s<string, string, "volatile-defined">;
    polishModel: s<string, string, "volatile-defined">;
    polishReasoningEffort: s<string, string, "volatile-defined">;
    polishPrompt: s<string, string, "volatile-defined">;
    optimizeEnabled: s<boolean, boolean, "volatile-defined">;
    optimizeProvider: s<string, string, "volatile-defined">;
    optimizeModel: s<string, string, "volatile-defined">;
    optimizeReasoningEffort: s<string, string, "volatile-defined">;
    optimizePrompt: s<string, string, "volatile-defined">;
    contextTurns: s<number, number, "volatile-defined">;
    ocrProvider: s<string, string, "volatile-defined">;
    ocrModel: s<string, string, "volatile-defined">;
}>>, "plain">;
