import { z } from 'zod';
export declare const textSchema: z.ZodString;
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
export type BetterInputSettingsWire = z.infer<typeof betterInputSettingsSchema>;
export type BetterInputSettingsPatchWire = z.infer<typeof betterInputSettingsPatchSchema>;
export type BetterInputSettingsViewWire = z.infer<typeof betterInputSettingsViewSchema>;
export type PolishRouteWire = z.infer<typeof polishRouteSchema>;
export type ReasoningEffortWire = z.infer<typeof reasoningEffortSchema>;
export type ResolveModelEffortsResultWire = z.infer<typeof resolveModelEffortsResultSchema>;
export type { BetterInputSettings, BetterInputSettingsPatch, BetterInputSettingsView, PolishRoute, ReasoningEffortInfo } from './config.js';
