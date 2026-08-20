import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol'
import type { ClientRemote } from '@deepseek-ai/dsh-api-remotes/client'
import { betterInputSettingsPatchSchema, betterInputSettingsViewSchema, listRoutesResultSchema, polishResultSchema, textSchema } from './remote-contract.js'
import type { BetterInputSettingsPatch, BetterInputSettingsView, PolishRoute } from './remote-contract.js'

export type BetterInputRemote = ClientRemote['betterInput']

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespace$betterInput {
    getSettings: () => Promise<RemoteResult<BetterInputSettingsView>>
    updateSettings: (patch: BetterInputSettingsPatch, signal?: AbortSignal) => Promise<RemoteResult<BetterInputSettingsView>>
    listRoutes: () => Promise<RemoteResult<PolishRoute[]>>
    polish: (transcript: string, provider: string, model: string, signal?: AbortSignal) => Promise<RemoteResult<string>>
  }

  interface TypertRemoteMap {
    'betterInput/getSettings': () => Promise<RemoteResult<BetterInputSettingsView>>
    'betterInput/updateSettings': (patch: BetterInputSettingsPatch, signal?: AbortSignal) => Promise<RemoteResult<BetterInputSettingsView>>
    'betterInput/listRoutes': () => Promise<RemoteResult<PolishRoute[]>>
    'betterInput/polish': (transcript: string, provider: string, model: string, signal?: AbortSignal) => Promise<RemoteResult<string>>
  }

  interface TypertRemoteNamespaceMap {
    betterInput: TypertRemoteNamespace$betterInput
  }
}

export const TYPERT_REMOTE: TypertRemoteContribution = {
  package: 'dsh-better-input',
  descriptors: [
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
  ]
}

export default TYPERT_REMOTE
