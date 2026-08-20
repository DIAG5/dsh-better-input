import { z } from 'zod';
import type { BetterInputSettings, BetterInputSettingsPatch, BetterInputSettingsView, PolishRoute } from './config.js';
export declare const textSchema: z.ZodString;
export declare const betterInputSettingsSchema: z.ZodObject<{
    language: z.ZodString;
    maxRecordingSeconds: z.ZodNumber;
    polishingEnabled: z.ZodBoolean;
    polishProvider: z.ZodString;
    polishModel: z.ZodString;
    polishPrompt: z.ZodString;
}, z.core.$strip>;
export declare const betterInputSettingsPatchSchema: z.ZodObject<{
    language: z.ZodOptional<z.ZodString>;
    maxRecordingSeconds: z.ZodOptional<z.ZodNumber>;
    polishingEnabled: z.ZodOptional<z.ZodBoolean>;
    polishProvider: z.ZodOptional<z.ZodString>;
    polishModel: z.ZodOptional<z.ZodString>;
    polishPrompt: z.ZodOptional<z.ZodString>;
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
        polishPrompt: z.ZodString;
    }, z.core.$strip>;
    overridden: z.ZodArray<z.ZodString>;
    defaultPolishPrompt: z.ZodString;
}, z.core.$strip>;
export declare const polishRouteSchema: z.ZodObject<{
    provider: z.ZodString;
    providerName: z.ZodString;
    model: z.ZodString;
    modelName: z.ZodString;
}, z.core.$strip>;
export declare const listRoutesResultSchema: z.ZodArray<z.ZodObject<{
    provider: z.ZodString;
    providerName: z.ZodString;
    model: z.ZodString;
    modelName: z.ZodString;
}, z.core.$strip>>;
export declare const polishResultSchema: z.ZodString;
export type BetterInputSettingsWire = z.infer<typeof betterInputSettingsSchema>;
export type BetterInputSettingsPatchWire = z.infer<typeof betterInputSettingsPatchSchema>;
export type BetterInputSettingsViewWire = z.infer<typeof betterInputSettingsViewSchema>;
export type PolishRouteWire = z.infer<typeof polishRouteSchema>;
export type { BetterInputSettings, BetterInputSettingsPatch, BetterInputSettingsView, PolishRoute };
