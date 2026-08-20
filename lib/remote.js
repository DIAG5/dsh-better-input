import { a as textSchema, i as polishResultSchema, n as betterInputSettingsViewSchema, r as listRoutesResultSchema, t as betterInputSettingsPatchSchema } from "./remote-contract-CMSAI1bH.js";
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
		}
	]
};
//#endregion
export { TYPERT_REMOTE, TYPERT_REMOTE as default };

//# sourceMappingURL=remote.js.map