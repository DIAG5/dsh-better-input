import { z } from "zod";
//#region src/remote-contract.ts
const textSchema = z.string();
const betterInputSettingsSchema = z.object({
	language: z.string(),
	maxRecordingSeconds: z.number(),
	polishingEnabled: z.boolean(),
	polishProvider: z.string(),
	polishModel: z.string(),
	polishReasoningEffort: z.string(),
	polishPrompt: z.string(),
	optimizeEnabled: z.boolean(),
	optimizeProvider: z.string(),
	optimizeModel: z.string(),
	optimizeReasoningEffort: z.string(),
	optimizePrompt: z.string()
});
const betterInputSettingsPatchSchema = z.object({
	language: z.string().optional(),
	maxRecordingSeconds: z.number().optional(),
	polishingEnabled: z.boolean().optional(),
	polishProvider: z.string().optional(),
	polishModel: z.string().optional(),
	polishReasoningEffort: z.string().optional(),
	polishPrompt: z.string().optional(),
	optimizeEnabled: z.boolean().optional(),
	optimizeProvider: z.string().optional(),
	optimizeModel: z.string().optional(),
	optimizeReasoningEffort: z.string().optional(),
	optimizePrompt: z.string().optional()
});
const betterInputSettingsViewSchema = z.object({
	available: z.boolean(),
	writable: z.boolean(),
	settings: betterInputSettingsSchema,
	overridden: z.array(z.string()),
	defaultPolishPrompt: z.string(),
	defaultOptimizePrompt: z.string()
});
const reasoningEffortSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional()
});
const resolveModelEffortsResultSchema = z.object({
	efforts: z.array(reasoningEffortSchema),
	defaultEffort: z.string().optional()
});
const polishRouteSchema = z.object({
	provider: z.string(),
	providerName: z.string(),
	model: z.string(),
	modelName: z.string(),
	reasoningEfforts: z.array(reasoningEffortSchema),
	defaultReasoningEffort: z.string().optional()
});
const listRoutesResultSchema = z.array(polishRouteSchema);
const polishResultSchema = z.string();
const optimizeResultSchema = z.string();
//#endregion
export { polishResultSchema as a, optimizeResultSchema as i, betterInputSettingsViewSchema as n, resolveModelEffortsResultSchema as o, listRoutesResultSchema as r, textSchema as s, betterInputSettingsPatchSchema as t };

//# sourceMappingURL=remote-contract-BGgzYDGY.js.map