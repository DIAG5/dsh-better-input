import type { Context } from '@deepseek-ai/cordis';
export declare const name = "dsh-better-input";
/**
 * The plugin's dsh config schema. cordis reads `plugin.Config` from the module
 * the Loader imports (`runtime.Config = plugin.Config`), and dsh-settings derives
 * the settings namespace and form from it — so it must live here, not on a
 * nested service.
 */
export declare const Config: import("@deepseek-ai/schemastery").default<Schemastery.ObjectS<NoInfer<{
    language: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    maxRecordingSeconds: import("@deepseek-ai/schemastery").default<number, number, "volatile-defined">;
    polishingEnabled: import("@deepseek-ai/schemastery").default<boolean, boolean, "volatile-defined">;
    polishProvider: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    polishModel: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    polishReasoningEffort: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    polishPrompt: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    optimizeEnabled: import("@deepseek-ai/schemastery").default<boolean, boolean, "volatile-defined">;
    optimizeProvider: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    optimizeModel: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    optimizeReasoningEffort: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    optimizePrompt: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    contextTurns: import("@deepseek-ai/schemastery").default<number, number, "volatile-defined">;
    ocrProvider: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    ocrModel: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    language: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    maxRecordingSeconds: import("@deepseek-ai/schemastery").default<number, number, "volatile-defined">;
    polishingEnabled: import("@deepseek-ai/schemastery").default<boolean, boolean, "volatile-defined">;
    polishProvider: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    polishModel: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    polishReasoningEffort: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    polishPrompt: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    optimizeEnabled: import("@deepseek-ai/schemastery").default<boolean, boolean, "volatile-defined">;
    optimizeProvider: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    optimizeModel: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    optimizeReasoningEffort: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    optimizePrompt: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    contextTurns: import("@deepseek-ai/schemastery").default<number, number, "volatile-defined">;
    ocrProvider: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
    ocrModel: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
}>>, "plain">;
/**
 * Host half of dsh-better-input.
 *
 * Voice input runs in the browser through the Web Speech API; the Host
 * contributes the transcript polishing service (reusing dsh's own LLM routes
 * and credentials) and the plugin settings namespace. Future versions plug
 * PDF conversion and image input in here.
 */
export declare function apply(ctx: Context): Promise<void>;
