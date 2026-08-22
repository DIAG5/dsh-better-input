export declare const TYPERT: {
    readonly package: "dsh-better-input";
    readonly face: "host";
    readonly schemas: readonly [];
    readonly invocations: readonly [{
        readonly id: "dsh-better-input#betterInput/getSettings";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "getSettings";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [];
        readonly result: {
            readonly mode: "strict";
            readonly typeSymbol: "dsh-better-input#BetterInputSettingsView";
            readonly schema: import("zod").ZodObject<{
                available: import("zod").ZodBoolean;
                writable: import("zod").ZodBoolean;
                settings: import("zod").ZodObject<{
                    language: import("zod").ZodString;
                    maxRecordingSeconds: import("zod").ZodNumber;
                    polishingEnabled: import("zod").ZodBoolean;
                    polishProvider: import("zod").ZodString;
                    polishModel: import("zod").ZodString;
                    polishReasoningEffort: import("zod").ZodString;
                    polishPrompt: import("zod").ZodString;
                    optimizeEnabled: import("zod").ZodBoolean;
                    optimizeProvider: import("zod").ZodString;
                    optimizeModel: import("zod").ZodString;
                    optimizeReasoningEffort: import("zod").ZodString;
                    optimizePrompt: import("zod").ZodString;
                }, import("zod/v4/core").$strip>;
                overridden: import("zod").ZodArray<import("zod").ZodString>;
                defaultPolishPrompt: import("zod").ZodString;
                defaultOptimizePrompt: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
        };
    }, {
        readonly id: "dsh-better-input#betterInput/updateSettings";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "updateSettings";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [{
            readonly name: "patch";
            readonly wire: "patch";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "dsh-better-input#BetterInputSettingsPatch";
                readonly schema: import("zod").ZodObject<{
                    language: import("zod").ZodOptional<import("zod").ZodString>;
                    maxRecordingSeconds: import("zod").ZodOptional<import("zod").ZodNumber>;
                    polishingEnabled: import("zod").ZodOptional<import("zod").ZodBoolean>;
                    polishProvider: import("zod").ZodOptional<import("zod").ZodString>;
                    polishModel: import("zod").ZodOptional<import("zod").ZodString>;
                    polishReasoningEffort: import("zod").ZodOptional<import("zod").ZodString>;
                    polishPrompt: import("zod").ZodOptional<import("zod").ZodString>;
                    optimizeEnabled: import("zod").ZodOptional<import("zod").ZodBoolean>;
                    optimizeProvider: import("zod").ZodOptional<import("zod").ZodString>;
                    optimizeModel: import("zod").ZodOptional<import("zod").ZodString>;
                    optimizeReasoningEffort: import("zod").ZodOptional<import("zod").ZodString>;
                    optimizePrompt: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("zod/v4/core").$strip>;
            };
        }];
        readonly cancellation: {
            readonly parameter: "signal";
        };
        readonly result: {
            readonly mode: "strict";
            readonly typeSymbol: "dsh-better-input#BetterInputSettingsView";
            readonly schema: import("zod").ZodObject<{
                available: import("zod").ZodBoolean;
                writable: import("zod").ZodBoolean;
                settings: import("zod").ZodObject<{
                    language: import("zod").ZodString;
                    maxRecordingSeconds: import("zod").ZodNumber;
                    polishingEnabled: import("zod").ZodBoolean;
                    polishProvider: import("zod").ZodString;
                    polishModel: import("zod").ZodString;
                    polishReasoningEffort: import("zod").ZodString;
                    polishPrompt: import("zod").ZodString;
                    optimizeEnabled: import("zod").ZodBoolean;
                    optimizeProvider: import("zod").ZodString;
                    optimizeModel: import("zod").ZodString;
                    optimizeReasoningEffort: import("zod").ZodString;
                    optimizePrompt: import("zod").ZodString;
                }, import("zod/v4/core").$strip>;
                overridden: import("zod").ZodArray<import("zod").ZodString>;
                defaultPolishPrompt: import("zod").ZodString;
                defaultOptimizePrompt: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
        };
    }, {
        readonly id: "dsh-better-input#betterInput/listRoutes";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "listRoutes";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [];
        readonly result: {
            readonly mode: "strict";
            readonly typeSymbol: "dsh-better-input#PolishRoute[]";
            readonly schema: import("zod").ZodArray<import("zod").ZodObject<{
                provider: import("zod").ZodString;
                providerName: import("zod").ZodString;
                model: import("zod").ZodString;
                modelName: import("zod").ZodString;
                reasoningEfforts: import("zod").ZodArray<import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    name: import("zod").ZodString;
                    description: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("zod/v4/core").$strip>>;
                defaultReasoningEffort: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
        };
    }, {
        readonly id: "dsh-better-input#betterInput/resolveModelEfforts";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "resolveModelEfforts";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [{
            readonly name: "provider";
            readonly wire: "provider";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "string";
                readonly schema: import("zod").ZodString;
            };
        }, {
            readonly name: "model";
            readonly wire: "model";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "string";
                readonly schema: import("zod").ZodString;
            };
        }];
        readonly result: {
            readonly mode: "strict";
            readonly typeSymbol: "dsh-better-input#ResolveModelEffortsResult";
            readonly schema: import("zod").ZodObject<{
                efforts: import("zod").ZodArray<import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    name: import("zod").ZodString;
                    description: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("zod/v4/core").$strip>>;
                defaultEffort: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
        };
    }, {
        readonly id: "dsh-better-input#betterInput/polish";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "polish";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [{
            readonly name: "transcript";
            readonly wire: "transcript";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "string";
                readonly schema: import("zod").ZodString;
            };
        }, {
            readonly name: "provider";
            readonly wire: "provider";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "string";
                readonly schema: import("zod").ZodString;
            };
        }, {
            readonly name: "model";
            readonly wire: "model";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "string";
                readonly schema: import("zod").ZodString;
            };
        }];
        readonly cancellation: {
            readonly parameter: "signal";
        };
        readonly result: {
            readonly mode: "strict";
            readonly typeSymbol: "string";
            readonly schema: import("zod").ZodString;
        };
    }, {
        readonly id: "dsh-better-input#betterInput/optimize";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "optimize";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [{
            readonly name: "text";
            readonly wire: "text";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "string";
                readonly schema: import("zod").ZodString;
            };
        }, {
            readonly name: "provider";
            readonly wire: "provider";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "string";
                readonly schema: import("zod").ZodString;
            };
        }, {
            readonly name: "model";
            readonly wire: "model";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "string";
                readonly schema: import("zod").ZodString;
            };
        }];
        readonly cancellation: {
            readonly parameter: "signal";
        };
        readonly result: {
            readonly mode: "strict";
            readonly typeSymbol: "string";
            readonly schema: import("zod").ZodString;
        };
    }];
    readonly model: {
        readonly services: readonly [{
            readonly description: "Host-side dsh route discovery and transcript polishing.";
            readonly summary: "Voice transcript polishing service.";
            readonly tags: readonly [];
            readonly jsDoc: "/** Host-side dsh route discovery and transcript polishing. */";
            readonly key: "BetterInputPolish";
            readonly exportName: "BetterInputPolishService";
            readonly members: readonly [{
                readonly kind: "method";
                readonly name: "getSettings";
                readonly signature: "getSettings(): BetterInputSettingsView";
                readonly summary: "Read the current plugin settings.";
                readonly jsDoc: "/** Read the current plugin settings. */";
            }, {
                readonly kind: "method";
                readonly name: "updateSettings";
                readonly signature: "updateSettings(patch: BetterInputSettingsPatch, signal: AbortSignal): Promise<BetterInputSettingsView>";
                readonly summary: "Update plugin settings when the request has not been cancelled.";
                readonly jsDoc: "/** Update plugin settings when the request has not been cancelled. */";
            }, {
                readonly kind: "method";
                readonly name: "listRoutes";
                readonly signature: "listRoutes(): Promise<PolishRoute[]>";
                readonly summary: "List models already registered in dsh.";
                readonly jsDoc: "/** List models already registered in dsh. */";
            }, {
                readonly kind: "method";
                readonly name: "resolveModelEfforts";
                readonly signature: "resolveModelEfforts(provider: string, model: string): Promise<{ efforts: readonly ReasoningEffortInfo[]; defaultEffort?: string }>";
                readonly summary: "Resolve reasoning-effort tiers for one route (lazy).";
                readonly jsDoc: "/** Resolve reasoning-effort tiers for one route (lazy). */";
            }, {
                readonly kind: "method";
                readonly name: "polish";
                readonly signature: "polish(transcript: string, provider: string, model: string, signal: AbortSignal): Promise<string>";
                readonly summary: "Polish one transcript through a selected dsh route.";
                readonly jsDoc: "/** Polish one transcript through a selected dsh route. */";
            }, {
                readonly kind: "method";
                readonly name: "optimize";
                readonly signature: "optimize(text: string, provider: string, model: string, signal: AbortSignal): Promise<string>";
                readonly summary: "Optimize one prompt through a selected dsh route.";
                readonly jsDoc: "/** Optimize one prompt through a selected dsh route. */";
            }];
            readonly types: readonly [{
                readonly name: "BetterInputSettingsView";
                readonly declaration: "export interface BetterInputSettingsView { available: boolean; writable: boolean; settings: BetterInputSettings; overridden: string[] }";
            }, {
                readonly name: "BetterInputSettingsPatch";
                readonly declaration: "export type BetterInputSettingsPatch = Partial<BetterInputSettings>";
            }, {
                readonly name: "PolishRoute";
                readonly declaration: "export interface ReasoningEffortInfo { id: string; name: string; description?: string } export interface PolishRoute { provider: string; providerName: string; model: string; modelName: string; reasoningEfforts: readonly ReasoningEffortInfo[]; defaultReasoningEffort?: string }";
            }];
        }];
        readonly events: readonly [];
        readonly objects: readonly [];
    };
};
export default TYPERT;
