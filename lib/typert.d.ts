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
                    contextTurns: import("zod").ZodNumber;
                    ocrProvider: import("zod").ZodString;
                    ocrModel: import("zod").ZodString;
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
                    contextTurns: import("zod").ZodOptional<import("zod").ZodNumber>;
                    ocrProvider: import("zod").ZodOptional<import("zod").ZodString>;
                    ocrModel: import("zod").ZodOptional<import("zod").ZodString>;
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
                    contextTurns: import("zod").ZodNumber;
                    ocrProvider: import("zod").ZodString;
                    ocrModel: import("zod").ZodString;
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
        readonly id: "dsh-better-input#betterInput/getAbout";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "getAbout";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [];
        readonly result: {
            readonly mode: "strict";
            readonly typeSymbol: "dsh-better-input#AboutInfo";
            readonly schema: import("zod").ZodObject<{
                repository: import("zod").ZodString;
                repositorySlug: import("zod").ZodString;
                version: import("zod").ZodString;
                license: import("zod").ZodString;
                updateCommand: import("zod").ZodString;
                updateCommandNpx: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
        };
    }, {
        readonly id: "dsh-better-input#betterInput/checkForUpdate";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "checkForUpdate";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [];
        readonly cancellation: {
            readonly parameter: "signal";
        };
        readonly result: {
            readonly mode: "strict";
            readonly typeSymbol: "dsh-better-input#UpdateCheckResult";
            readonly schema: import("zod").ZodObject<{
                status: import("zod").ZodEnum<{
                    "up-to-date": "up-to-date";
                    "update-available": "update-available";
                    unpublished: "unpublished";
                    error: "error";
                }>;
                installed: import("zod").ZodString;
                latest: import("zod").ZodNullable<import("zod").ZodString>;
                updateCommand: import("zod").ZodString;
                updateCommandNpx: import("zod").ZodString;
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
        }, {
            readonly name: "context";
            readonly wire: "context";
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
        readonly id: "dsh-better-input#betterInput/convertFile";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "convertFile";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [{
            readonly name: "fileName";
            readonly wire: "fileName";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "string";
                readonly schema: import("zod").ZodString;
            };
        }, {
            readonly name: "fileData";
            readonly wire: "fileData";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "string";
                readonly schema: import("zod").ZodString;
            };
        }, {
            readonly name: "ocr";
            readonly wire: "ocr";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "boolean";
                readonly schema: import("zod").ZodOptional<import("zod").ZodBoolean>;
            };
        }];
        readonly cancellation: {
            readonly parameter: "signal";
        };
        readonly result: {
            readonly mode: "strict";
            readonly typeSymbol: "dsh-better-input#ConvertFileResult";
            readonly schema: import("zod").ZodObject<{
                success: import("zod").ZodBoolean;
                format: import("zod").ZodEnum<{
                    text: "text";
                    pdf: "pdf";
                    docx: "docx";
                    xlsx: "xlsx";
                    xls: "xls";
                    pptx: "pptx";
                    html: "html";
                    epub: "epub";
                    csv: "csv";
                    json: "json";
                    xml: "xml";
                    zip: "zip";
                }>;
                markdown: import("zod").ZodString;
                warnings: import("zod").ZodArray<import("zod").ZodString>;
                metadata: import("zod").ZodOptional<import("zod").ZodObject<{
                    pageCount: import("zod").ZodOptional<import("zod").ZodNumber>;
                    slideCount: import("zod").ZodOptional<import("zod").ZodNumber>;
                    sheetCount: import("zod").ZodOptional<import("zod").ZodNumber>;
                    wordCount: import("zod").ZodOptional<import("zod").ZodNumber>;
                    fileCount: import("zod").ZodOptional<import("zod").ZodNumber>;
                }, import("zod/v4/core").$strip>>;
            }, import("zod/v4/core").$strip>;
        };
    }, {
        readonly id: "dsh-better-input#betterInput/templatesList";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "templatesList";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [];
        readonly result: {
            readonly mode: "strict";
            readonly typeSymbol: "dsh-better-input#TemplateListResult";
            readonly schema: import("zod").ZodObject<{
                templates: import("zod").ZodArray<import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    name: import("zod").ZodString;
                    description: import("zod").ZodString;
                    content: import("zod").ZodString;
                    tags: import("zod").ZodArray<import("zod").ZodString>;
                    createdAt: import("zod").ZodNumber;
                    updatedAt: import("zod").ZodNumber;
                }, import("zod/v4/core").$strip>>;
            }, import("zod/v4/core").$strip>;
        };
    }, {
        readonly id: "dsh-better-input#betterInput/templatesSave";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "templatesSave";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [{
            readonly name: "template";
            readonly wire: "template";
            readonly source: "json";
            readonly codec: {
                readonly mode: "strict";
                readonly typeSymbol: "dsh-better-input#TemplateInput";
                readonly schema: import("zod").ZodObject<{
                    id: import("zod").ZodOptional<import("zod").ZodString>;
                    name: import("zod").ZodString;
                    description: import("zod").ZodOptional<import("zod").ZodString>;
                    content: import("zod").ZodString;
                    tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                }, import("zod/v4/core").$strip>;
            };
        }];
        readonly cancellation: {
            readonly parameter: "signal";
        };
        readonly result: {
            readonly mode: "strict";
            readonly typeSymbol: "dsh-better-input#TemplateSaveResult";
            readonly schema: import("zod").ZodObject<{
                template: import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    name: import("zod").ZodString;
                    description: import("zod").ZodString;
                    content: import("zod").ZodString;
                    tags: import("zod").ZodArray<import("zod").ZodString>;
                    createdAt: import("zod").ZodNumber;
                    updatedAt: import("zod").ZodNumber;
                }, import("zod/v4/core").$strip>;
            }, import("zod/v4/core").$strip>;
        };
    }, {
        readonly id: "dsh-better-input#betterInput/templatesRemove";
        readonly service: "BetterInputPolish";
        readonly namespace: "betterInput";
        readonly method: "templatesRemove";
        readonly invocation: {
            readonly kind: "direct";
        };
        readonly parameters: readonly [{
            readonly name: "id";
            readonly wire: "id";
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
            readonly typeSymbol: "dsh-better-input#TemplateRemoveResult";
            readonly schema: import("zod").ZodObject<{
                removed: import("zod").ZodBoolean;
            }, import("zod/v4/core").$strip>;
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
                readonly name: "getAbout";
                readonly signature: "getAbout(): AboutInfo";
                readonly summary: "Read the installed plugin identity and repository info.";
                readonly jsDoc: "/** Read the installed plugin identity and repository info. */";
            }, {
                readonly kind: "method";
                readonly name: "checkForUpdate";
                readonly signature: "checkForUpdate(signal: AbortSignal): Promise<UpdateCheckResult>";
                readonly summary: "Check the npm registry for the latest published version.";
                readonly jsDoc: "/** Check the npm registry for the latest published version. */";
            }, {
                readonly kind: "method";
                readonly name: "polish";
                readonly signature: "polish(transcript: string, provider: string, model: string, signal: AbortSignal): Promise<string>";
                readonly summary: "Polish one transcript through a selected dsh route.";
                readonly jsDoc: "/** Polish one transcript through a selected dsh route. */";
            }, {
                readonly kind: "method";
                readonly name: "optimize";
                readonly signature: "optimize(text: string, provider: string, model: string, context: string, signal: AbortSignal): Promise<string>";
                readonly summary: "Optimize one prompt through a selected dsh route.";
                readonly jsDoc: "/** Optimize one prompt through a selected dsh route. */";
            }, {
                readonly kind: "method";
                readonly name: "convertFile";
                readonly signature: "convertFile(fileName: string, fileData: string, ocr?: boolean, signal: AbortSignal): Promise<ConvertFileResult>";
                readonly summary: "Convert a binary file to Markdown on the Host. With ocr=true, scanned PDF pages / PPTX images are read by the vision model.";
                readonly jsDoc: "/** Convert a binary file to Markdown on the Host. With ocr=true, scanned PDF pages / PPTX images are read by the vision model. */";
            }, {
                readonly kind: "method";
                readonly name: "templatesList";
                readonly signature: "templatesList(): Promise<TemplateListResult>";
                readonly summary: "List all saved prompt templates, newest first.";
                readonly jsDoc: "/** List all saved prompt templates, newest first. */";
            }, {
                readonly kind: "method";
                readonly name: "templatesSave";
                readonly signature: "templatesSave(template: TemplateInput, signal: AbortSignal): Promise<TemplateSaveResult>";
                readonly summary: "Create or update one prompt template on the Host filesystem.";
                readonly jsDoc: "/** Create or update one prompt template on the Host filesystem. */";
            }, {
                readonly kind: "method";
                readonly name: "templatesRemove";
                readonly signature: "templatesRemove(id: string, signal: AbortSignal): Promise<TemplateRemoveResult>";
                readonly summary: "Remove one prompt template by id.";
                readonly jsDoc: "/** Remove one prompt template by id. */";
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
            }, {
                readonly name: "AboutInfo";
                readonly declaration: "export interface AboutInfo { repository: string; repositorySlug: string; version: string; license: string; updateCommand: string; updateCommandNpx: string }";
            }, {
                readonly name: "UpdateCheckResult";
                readonly declaration: "export type UpdateCheckResult = { status: 'up-to-date' | 'update-available' | 'unpublished' | 'error'; installed: string; latest: string | null; updateCommand: string; updateCommandNpx: string }";
            }, {
                readonly name: "ConvertFileResult";
                readonly declaration: "export type ConvertFileResult = { success: boolean; format: 'text' | 'pdf' | 'docx' | 'xlsx' | 'xls' | 'pptx' | 'html' | 'epub' | 'csv' | 'json' | 'xml' | 'zip'; markdown: string; warnings: readonly string[]; metadata?: { pageCount?: number; slideCount?: number; sheetCount?: number; wordCount?: number; fileCount?: number } }";
            }, {
                readonly name: "BetterInputTemplate";
                readonly declaration: "export interface BetterInputTemplate { id: string; name: string; description: string; content: string; tags: readonly string[]; createdAt: number; updatedAt: number }";
            }, {
                readonly name: "TemplateInput";
                readonly declaration: "export interface TemplateInput { id?: string; name: string; description?: string; content: string; tags?: readonly string[] }";
            }, {
                readonly name: "TemplateListResult";
                readonly declaration: "export interface TemplateListResult { templates: readonly BetterInputTemplate[] }";
            }, {
                readonly name: "TemplateSaveResult";
                readonly declaration: "export interface TemplateSaveResult { template: BetterInputTemplate }";
            }, {
                readonly name: "TemplateRemoveResult";
                readonly declaration: "export interface TemplateRemoveResult { removed: boolean }";
            }];
        }];
        readonly events: readonly [];
        readonly objects: readonly [];
    };
};
export default TYPERT;
