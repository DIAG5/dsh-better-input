import { z } from 'zod';
export declare const textSchema: z.ZodString;
export declare const booleanSchema: z.ZodOptional<z.ZodBoolean>;
export declare const betterInputSettingsSchema: z.ZodObject<{
    language: z.ZodString;
    maxRecordingSeconds: z.ZodNumber;
    polishingEnabled: z.ZodBoolean;
    polishProvider: z.ZodString;
    polishModel: z.ZodString;
    polishReasoningEffort: z.ZodString;
    polishPrompt: z.ZodString;
    optimizeEnabled: z.ZodBoolean;
    optimizeProvider: z.ZodString;
    optimizeModel: z.ZodString;
    optimizeReasoningEffort: z.ZodString;
    optimizePrompt: z.ZodString;
    contextTurns: z.ZodNumber;
    ocrProvider: z.ZodString;
    ocrModel: z.ZodString;
}, z.core.$strip>;
export declare const betterInputSettingsPatchSchema: z.ZodObject<{
    language: z.ZodOptional<z.ZodString>;
    maxRecordingSeconds: z.ZodOptional<z.ZodNumber>;
    polishingEnabled: z.ZodOptional<z.ZodBoolean>;
    polishProvider: z.ZodOptional<z.ZodString>;
    polishModel: z.ZodOptional<z.ZodString>;
    polishReasoningEffort: z.ZodOptional<z.ZodString>;
    polishPrompt: z.ZodOptional<z.ZodString>;
    optimizeEnabled: z.ZodOptional<z.ZodBoolean>;
    optimizeProvider: z.ZodOptional<z.ZodString>;
    optimizeModel: z.ZodOptional<z.ZodString>;
    optimizeReasoningEffort: z.ZodOptional<z.ZodString>;
    optimizePrompt: z.ZodOptional<z.ZodString>;
    contextTurns: z.ZodOptional<z.ZodNumber>;
    ocrProvider: z.ZodOptional<z.ZodString>;
    ocrModel: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const betterInputSettingsViewSchema: z.ZodObject<{
    available: z.ZodBoolean;
    writable: z.ZodBoolean;
    settings: z.ZodObject<{
        language: z.ZodString;
        maxRecordingSeconds: z.ZodNumber;
        polishingEnabled: z.ZodBoolean;
        polishProvider: z.ZodString;
        polishModel: z.ZodString;
        polishReasoningEffort: z.ZodString;
        polishPrompt: z.ZodString;
        optimizeEnabled: z.ZodBoolean;
        optimizeProvider: z.ZodString;
        optimizeModel: z.ZodString;
        optimizeReasoningEffort: z.ZodString;
        optimizePrompt: z.ZodString;
        contextTurns: z.ZodNumber;
        ocrProvider: z.ZodString;
        ocrModel: z.ZodString;
    }, z.core.$strip>;
    overridden: z.ZodArray<z.ZodString>;
    defaultPolishPrompt: z.ZodString;
    defaultOptimizePrompt: z.ZodString;
}, z.core.$strip>;
export declare const reasoningEffortSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const resolveModelEffortsResultSchema: z.ZodObject<{
    efforts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    defaultEffort: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const polishRouteSchema: z.ZodObject<{
    provider: z.ZodString;
    providerName: z.ZodString;
    model: z.ZodString;
    modelName: z.ZodString;
    reasoningEfforts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    defaultReasoningEffort: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const listRoutesResultSchema: z.ZodArray<z.ZodObject<{
    provider: z.ZodString;
    providerName: z.ZodString;
    model: z.ZodString;
    modelName: z.ZodString;
    reasoningEfforts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    defaultReasoningEffort: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export declare const polishResultSchema: z.ZodString;
export declare const optimizeResultSchema: z.ZodString;
export declare const aboutInfoSchema: z.ZodObject<{
    repository: z.ZodString;
    repositorySlug: z.ZodString;
    version: z.ZodString;
    license: z.ZodString;
    updateCommand: z.ZodString;
    updateCommandNpx: z.ZodString;
}, z.core.$strip>;
export declare const updateCheckResultSchema: z.ZodObject<{
    status: z.ZodEnum<{
        "up-to-date": "up-to-date";
        "update-available": "update-available";
        unpublished: "unpublished";
        error: "error";
    }>;
    installed: z.ZodString;
    latest: z.ZodNullable<z.ZodString>;
    updateCommand: z.ZodString;
    updateCommandNpx: z.ZodString;
}, z.core.$strip>;
/** Supported file formats the converter can produce Markdown for. */
export declare const convertibleFormatSchema: z.ZodEnum<{
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
export declare const convertMetadataSchema: z.ZodObject<{
    pageCount: z.ZodOptional<z.ZodNumber>;
    slideCount: z.ZodOptional<z.ZodNumber>;
    sheetCount: z.ZodOptional<z.ZodNumber>;
    wordCount: z.ZodOptional<z.ZodNumber>;
    fileCount: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const convertFileResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    format: z.ZodEnum<{
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
    markdown: z.ZodString;
    warnings: z.ZodArray<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        pageCount: z.ZodOptional<z.ZodNumber>;
        slideCount: z.ZodOptional<z.ZodNumber>;
        sheetCount: z.ZodOptional<z.ZodNumber>;
        wordCount: z.ZodOptional<z.ZodNumber>;
        fileCount: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AboutInfoWire = z.infer<typeof aboutInfoSchema>;
export type UpdateCheckResultWire = z.infer<typeof updateCheckResultSchema>;
export type ConvertibleFormatWire = z.infer<typeof convertibleFormatSchema>;
export type ConvertFileResultWire = z.infer<typeof convertFileResultSchema>;
export type BetterInputSettingsWire = z.infer<typeof betterInputSettingsSchema>;
export type BetterInputSettingsPatchWire = z.infer<typeof betterInputSettingsPatchSchema>;
export type BetterInputSettingsViewWire = z.infer<typeof betterInputSettingsViewSchema>;
export type PolishRouteWire = z.infer<typeof polishRouteSchema>;
export type ReasoningEffortWire = z.infer<typeof reasoningEffortSchema>;
export type ResolveModelEffortsResultWire = z.infer<typeof resolveModelEffortsResultSchema>;
export type { BetterInputSettings, BetterInputSettingsPatch, BetterInputSettingsView, PolishRoute, ReasoningEffortInfo } from './config.js';
