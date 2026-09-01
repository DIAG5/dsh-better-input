import { a as convertFileResultSchema, c as polishResultSchema, d as templateListResultSchema, f as templateRemoveResultSchema, h as updateCheckResultSchema, i as booleanSchema, l as resolveModelEffortsResultSchema, m as textSchema, n as betterInputSettingsPatchSchema, o as listRoutesResultSchema, p as templateSaveResultSchema, r as betterInputSettingsViewSchema, s as optimizeResultSchema, t as aboutInfoSchema, u as templateInputSchema } from "./remote-contract-DFZf097n.js";
//#region src/remote.ts
const TYPERT_REMOTE = {
	package: "dsh-better-input",
	descriptors: [
		{
			id: "dsh-better-input#betterInput/getSettings",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "getSettings",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-better-input#BetterInputSettingsView",
				schema: betterInputSettingsViewSchema
			}
		},
		{
			id: "dsh-better-input#betterInput/updateSettings",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "updateSettings",
			invocation: { kind: "direct" },
			parameters: [{
				name: "patch",
				wire: "patch",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-better-input#BetterInputSettingsPatch",
					schema: betterInputSettingsPatchSchema
				}
			}],
			cancellation: { parameter: "signal" },
			result: {
				mode: "strict",
				typeSymbol: "dsh-better-input#BetterInputSettingsView",
				schema: betterInputSettingsViewSchema
			}
		},
		{
			id: "dsh-better-input#betterInput/listRoutes",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "listRoutes",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-better-input#PolishRoute[]",
				schema: listRoutesResultSchema
			}
		},
		{
			id: "dsh-better-input#betterInput/resolveModelEfforts",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "resolveModelEfforts",
			invocation: { kind: "direct" },
			parameters: [{
				name: "provider",
				wire: "provider",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "string",
					schema: textSchema
				}
			}, {
				name: "model",
				wire: "model",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "string",
					schema: textSchema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-better-input#ResolveModelEffortsResult",
				schema: resolveModelEffortsResultSchema
			}
		},
		{
			id: "dsh-better-input#betterInput/getAbout",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "getAbout",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-better-input#AboutInfo",
				schema: aboutInfoSchema
			}
		},
		{
			id: "dsh-better-input#betterInput/checkForUpdate",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "checkForUpdate",
			invocation: { kind: "direct" },
			parameters: [],
			cancellation: { parameter: "signal" },
			result: {
				mode: "strict",
				typeSymbol: "dsh-better-input#UpdateCheckResult",
				schema: updateCheckResultSchema
			}
		},
		{
			id: "dsh-better-input#betterInput/polish",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "polish",
			invocation: { kind: "direct" },
			parameters: [
				{
					name: "transcript",
					wire: "transcript",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "string",
						schema: textSchema
					}
				},
				{
					name: "provider",
					wire: "provider",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "string",
						schema: textSchema
					}
				},
				{
					name: "model",
					wire: "model",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "string",
						schema: textSchema
					}
				}
			],
			cancellation: { parameter: "signal" },
			result: {
				mode: "strict",
				typeSymbol: "string",
				schema: polishResultSchema
			}
		},
		{
			id: "dsh-better-input#betterInput/optimize",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "optimize",
			invocation: { kind: "direct" },
			parameters: [
				{
					name: "text",
					wire: "text",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "string",
						schema: textSchema
					}
				},
				{
					name: "provider",
					wire: "provider",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "string",
						schema: textSchema
					}
				},
				{
					name: "model",
					wire: "model",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "string",
						schema: textSchema
					}
				},
				{
					name: "context",
					wire: "context",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "string",
						schema: textSchema
					}
				}
			],
			cancellation: { parameter: "signal" },
			result: {
				mode: "strict",
				typeSymbol: "string",
				schema: optimizeResultSchema
			}
		},
		{
			id: "dsh-better-input#betterInput/convertFile",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "convertFile",
			invocation: { kind: "direct" },
			parameters: [
				{
					name: "fileName",
					wire: "fileName",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "string",
						schema: textSchema
					}
				},
				{
					name: "fileData",
					wire: "fileData",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "string",
						schema: textSchema
					}
				},
				{
					name: "ocr",
					wire: "ocr",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "boolean",
						schema: booleanSchema
					}
				}
			],
			cancellation: { parameter: "signal" },
			result: {
				mode: "strict",
				typeSymbol: "dsh-better-input#ConvertFileResult",
				schema: convertFileResultSchema
			}
		},
		{
			id: "dsh-better-input#betterInput/templatesList",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "templatesList",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-better-input#TemplateListResult",
				schema: templateListResultSchema
			}
		},
		{
			id: "dsh-better-input#betterInput/templatesSave",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "templatesSave",
			invocation: { kind: "direct" },
			parameters: [{
				name: "template",
				wire: "template",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-better-input#TemplateInput",
					schema: templateInputSchema
				}
			}],
			cancellation: { parameter: "signal" },
			result: {
				mode: "strict",
				typeSymbol: "dsh-better-input#TemplateSaveResult",
				schema: templateSaveResultSchema
			}
		},
		{
			id: "dsh-better-input#betterInput/templatesRemove",
			service: "BetterInputPolish",
			namespace: "betterInput",
			method: "templatesRemove",
			invocation: { kind: "direct" },
			parameters: [{
				name: "id",
				wire: "id",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "string",
					schema: textSchema
				}
			}],
			cancellation: { parameter: "signal" },
			result: {
				mode: "strict",
				typeSymbol: "dsh-better-input#TemplateRemoveResult",
				schema: templateRemoveResultSchema
			}
		}
	]
};
//#endregion
export { TYPERT_REMOTE, TYPERT_REMOTE as default };

//# sourceMappingURL=remote.js.map