import { z } from "zod";
//#region src/remote-contract.ts
const textSchema = z.string();
const betterInputSettingsSchema = z.object({
	language: z.string(),
	maxRecordingSeconds: z.number(),
	polishingEnabled: z.boolean(),
	polishProvider: z.string(),
	polishModel: z.string(),
	polishPrompt: z.string()
});
const betterInputSettingsPatchSchema = z.object({
	language: z.string().optional(),
	maxRecordingSeconds: z.number().optional(),
	polishingEnabled: z.boolean().optional(),
	polishProvider: z.string().optional(),
	polishModel: z.string().optional(),
	polishPrompt: z.string().optional()
});
const betterInputSettingsViewSchema = z.object({
	available: z.boolean(),
	writable: z.boolean(),
	settings: betterInputSettingsSchema,
	overridden: z.array(z.string()),
	defaultPolishPrompt: z.string()
});
const polishRouteSchema = z.object({
	provider: z.string(),
	providerName: z.string(),
	model: z.string(),
	modelName: z.string()
});
const listRoutesResultSchema = z.array(polishRouteSchema);
const polishResultSchema = z.string();
//#endregion
export { textSchema as a, polishResultSchema as i, betterInputSettingsViewSchema as n, listRoutesResultSchema as r, betterInputSettingsPatchSchema as t };

//# sourceMappingURL=remote-contract-CMSAI1bH.js.map