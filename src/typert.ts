import { betterInputSettingsPatchSchema, betterInputSettingsViewSchema, listRoutesResultSchema, polishResultSchema, textSchema } from './remote-contract.js'

export const TYPERT = {
  package: 'dsh-better-input',
  face: 'host',
  schemas: [],
  invocations: [
    {
      id: 'dsh-better-input#betterInput/getSettings',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'getSettings',
      invocation: { kind: 'direct' },
      parameters: [],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#BetterInputSettingsView',
        schema: betterInputSettingsViewSchema
      }
    },
    {
      id: 'dsh-better-input#betterInput/updateSettings',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'updateSettings',
      invocation: { kind: 'direct' },
      parameters: [{
        name: 'patch',
        wire: 'patch',
        source: 'json',
        codec: { mode: 'strict', typeSymbol: 'dsh-better-input#BetterInputSettingsPatch', schema: betterInputSettingsPatchSchema }
      }],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#BetterInputSettingsView',
        schema: betterInputSettingsViewSchema
      }
    },
    {
      id: 'dsh-better-input#betterInput/listRoutes',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'listRoutes',
      invocation: { kind: 'direct' },
      parameters: [],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#PolishRoute[]',
        schema: listRoutesResultSchema
      }
    },
    {
      id: 'dsh-better-input#betterInput/polish',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'polish',
      invocation: { kind: 'direct' },
      parameters: [
        {
          name: 'transcript',
          wire: 'transcript',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', schema: textSchema }
        },
        {
          name: 'provider',
          wire: 'provider',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', schema: textSchema }
        },
        {
          name: 'model',
          wire: 'model',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', schema: textSchema }
        }
      ],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'string',
        schema: polishResultSchema
      }
    }
  ],
  model: {
    services: [
      {
        description: 'Host-side dsh route discovery and transcript polishing.',
        summary: 'Voice transcript polishing service.',
        tags: [],
        jsDoc: '/** Host-side dsh route discovery and transcript polishing. */',
        key: 'BetterInputPolish',
        exportName: 'BetterInputPolishService',
        members: [
          {
            kind: 'method',
            name: 'getSettings',
            signature: 'getSettings(): BetterInputSettingsView',
            summary: 'Read the current plugin settings.',
            jsDoc: '/** Read the current plugin settings. */'
          },
          {
            kind: 'method',
            name: 'updateSettings',
            signature: 'updateSettings(patch: BetterInputSettingsPatch, signal: AbortSignal): Promise<BetterInputSettingsView>',
            summary: 'Update plugin settings when the request has not been cancelled.',
            jsDoc: '/** Update plugin settings when the request has not been cancelled. */'
          },
          {
            kind: 'method',
            name: 'listRoutes',
            signature: 'listRoutes(): Promise<PolishRoute[]>',
            summary: 'List models already registered in dsh.',
            jsDoc: '/** List models already registered in dsh. */'
          },
          {
            kind: 'method',
            name: 'polish',
            signature: 'polish(transcript: string, provider: string, model: string, signal: AbortSignal): Promise<string>',
            summary: 'Polish one transcript through a selected dsh route.',
            jsDoc: '/** Polish one transcript through a selected dsh route. */'
          }
        ],
        types: [
          {
            name: 'BetterInputSettingsView',
            declaration: 'export interface BetterInputSettingsView { available: boolean; writable: boolean; settings: BetterInputSettings; overridden: string[] }'
          },
          {
            name: 'BetterInputSettingsPatch',
            declaration: 'export type BetterInputSettingsPatch = Partial<BetterInputSettings>'
          },
          {
            name: 'PolishRoute',
            declaration: 'export interface PolishRoute { provider: string; providerName: string; model: string; modelName: string }'
          }
        ]
      }
    ],
    events: [],
    objects: []
  }
} as const

export default TYPERT
