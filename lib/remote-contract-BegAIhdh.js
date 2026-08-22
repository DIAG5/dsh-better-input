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
const aboutInfoSchema = z.object({
	repository: z.string(),
	repositorySlug: z.string(),
	version: z.string(),
	license: z.string(),
	updateCommand: z.string(),
	updateCommandNpx: z.string()
});
const updateCheckResultSchema = z.object({
	status: z.enum([
		"up-to-date",
		"update-available",
		"unpublished",
		"error"
	]),
	installed: z.string(),
	latest: z.string().nullable(),
	updateCommand: z.string(),
	updateCommandNpx: z.string()
});
//#endregion
export { optimizeResultSchema as a, textSchema as c, listRoutesResultSchema as i, updateCheckResultSchema as l, betterInputSettingsPatchSchema as n, polishResultSchema as o, betterInputSettingsViewSchema as r, resolveModelEffortsResultSchema as s, aboutInfoSchema as t };

//# sourceMappingURL=remote-contract-BegAIhdh.js.map