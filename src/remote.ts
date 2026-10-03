import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol'
import type { ClientRemote } from '@deepseek-ai/dsh-api-remotes/client'
import { aboutInfoSchema, betterInputSettingsPatchSchema, betterInputSettingsViewSchema, booleanSchema, convertFileResultSchema, listRoutesResultSchema, optimizeResultSchema, polishResultSchema, resolveModelEffortsResultSchema, templateInputSchema, templateListResultSchema, templateRemoveResultSchema, templateSaveResultSchema, textSchema, updateCheckResultSchema } from './remote-contract.js'
import type { AboutInfoWire, BetterInputSettingsPatch, BetterInputSettingsView, ConvertFileResultWire, PolishRoute, ReasoningEffortInfo, TemplateInputWire, TemplateWire, UpdateCheckResultWire } from './remote-contract.js'

export type BetterInputRemote = ClientRemote['betterInput']

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespace$betterInput {
    getSettings: () => Promise<RemoteResult<BetterInputSettingsView>>
    updateSettings: (patch: BetterInputSettingsPatch, signal?: AbortSignal) => Promise<RemoteResult<BetterInputSettingsView>>
    listRoutes: () => Promise<RemoteResult<PolishRoute[]>>
    resolveModelEfforts: (provider: string, model: string) => Promise<RemoteResult<{ efforts: readonly ReasoningEffortInfo[]; defaultEffort?: string }>>
    getAbout: () => Promise<RemoteResult<AboutInfoWire>>
    checkForUpdate: (signal?: AbortSignal) => Promise<RemoteResult<UpdateCheckResultWire>>
    polish: (transcript: string, provider: string, model: string, signal?: AbortSignal) => Promise<RemoteResult<string>>
    optimize: (text: string, provider: string, model: string, context: string, signal?: AbortSignal) => Promise<RemoteResult<string>>
    convertFile: (fileName: string, fileData: string, ocr?: boolean, signal?: AbortSignal) => Promise<RemoteResult<ConvertFileResultWire>>
    templatesList: () => Promise<RemoteResult<{ templates: TemplateWire[] }>>
    templatesSave: (template: TemplateInputWire, signal?: AbortSignal) => Promise<RemoteResult<{ template: TemplateWire }>>
    templatesRemove: (id: string, signal?: AbortSignal) => Promise<RemoteResult<{ removed: boolean }>>
  }

  interface TypertRemoteMap {
    'betterInput/getSettings': () => Promise<RemoteResult<BetterInputSettingsView>>
    'betterInput/updateSettings': (patch: BetterInputSettingsPatch, signal?: AbortSignal) => Promise<RemoteResult<BetterInputSettingsView>>
    'betterInput/listRoutes': () => Promise<RemoteResult<PolishRoute[]>>
    'betterInput/resolveModelEfforts': (provider: string, model: string) => Promise<RemoteResult<{ efforts: readonly ReasoningEffortInfo[]; defaultEffort?: string }>>
    'betterInput/getAbout': () => Promise<RemoteResult<AboutInfoWire>>
    'betterInput/checkForUpdate': (signal?: AbortSignal) => Promise<RemoteResult<UpdateCheckResultWire>>
    'betterInput/polish': (transcript: string, provider: string, model: string, signal?: AbortSignal) => Promise<RemoteResult<string>>
    'betterInput/optimize': (text: string, provider: string, model: string, context: string, signal?: AbortSignal) => Promise<RemoteResult<string>>
    'betterInput/convertFile': (fileName: string, fileData: string, ocr?: boolean, signal?: AbortSignal) => Promise<RemoteResult<ConvertFileResultWire>>
    'betterInput/templatesList': () => Promise<RemoteResult<{ templates: TemplateWire[] }>>
    'betterInput/templatesSave': (template: TemplateInputWire, signal?: AbortSignal) => Promise<RemoteResult<{ template: TemplateWire }>>
    'betterInput/templatesRemove': (id: string, signal?: AbortSignal) => Promise<RemoteResult<{ removed: boolean }>>
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
        create: () => betterInputSettingsViewSchema
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
        codec: { mode: 'strict', typeSymbol: 'dsh-better-input#BetterInputSettingsPatch', create: () => betterInputSettingsPatchSchema }
      }],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#BetterInputSettingsView',
        create: () => betterInputSettingsViewSchema
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
        create: () => listRoutesResultSchema
      }
    },
    {
      id: 'dsh-better-input#betterInput/resolveModelEfforts',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'resolveModelEfforts',
      invocation: { kind: 'direct' },
      parameters: [
        {
          name: 'provider',
          wire: 'provider',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
        },
        {
          name: 'model',
          wire: 'model',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
        }
      ],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#ResolveModelEffortsResult',
        create: () => resolveModelEffortsResultSchema
      }
    },
    {
      id: 'dsh-better-input#betterInput/getAbout',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'getAbout',
      invocation: { kind: 'direct' },
      parameters: [],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#AboutInfo',
        create: () => aboutInfoSchema
      }
    },
    {
      id: 'dsh-better-input#betterInput/checkForUpdate',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'checkForUpdate',
      invocation: { kind: 'direct' },
      parameters: [],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#UpdateCheckResult',
        create: () => updateCheckResultSchema
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
          codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
        },
        {
          name: 'provider',
          wire: 'provider',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
        },
        {
          name: 'model',
          wire: 'model',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
        }
      ],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'string',
        create: () => polishResultSchema
      }
    },
    {
      id: 'dsh-better-input#betterInput/optimize',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'optimize',
      invocation: { kind: 'direct' },
      parameters: [
        {
          name: 'text',
          wire: 'text',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
        },
        {
          name: 'provider',
          wire: 'provider',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
        },
        {
          name: 'model',
          wire: 'model',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
        },
        {
          name: 'context',
          wire: 'context',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
        }
      ],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'string',
        create: () => optimizeResultSchema
      }
    },
    {
      id: 'dsh-better-input#betterInput/convertFile',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'convertFile',
      invocation: { kind: 'direct' },
      parameters: [
        {
          name: 'fileName',
          wire: 'fileName',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
        },
        {
          name: 'fileData',
          wire: 'fileData',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
        },
        {
          name: 'ocr',
          wire: 'ocr',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'boolean', create: () => booleanSchema }
        }
      ],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#ConvertFileResult',
        create: () => convertFileResultSchema
      }
    },
    {
      id: 'dsh-better-input#betterInput/templatesList',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'templatesList',
      invocation: { kind: 'direct' },
      parameters: [],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#TemplateListResult',
        create: () => templateListResultSchema
      }
    },
    {
      id: 'dsh-better-input#betterInput/templatesSave',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'templatesSave',
      invocation: { kind: 'direct' },
      parameters: [{
        name: 'template',
        wire: 'template',
        source: 'json',
        codec: { mode: 'strict', typeSymbol: 'dsh-better-input#TemplateInput', create: () => templateInputSchema }
      }],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#TemplateSaveResult',
        create: () => templateSaveResultSchema
      }
    },
    {
      id: 'dsh-better-input#betterInput/templatesRemove',
      service: 'BetterInputPolish',
      namespace: 'betterInput',
      method: 'templatesRemove',
      invocation: { kind: 'direct' },
      parameters: [{
        name: 'id',
        wire: 'id',
        source: 'json',
        codec: { mode: 'strict', typeSymbol: 'string', create: () => textSchema }
      }],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#TemplateRemoveResult',
        create: () => templateRemoveResultSchema
      }
    }
  ]
}

export default TYPERT_REMOTE
