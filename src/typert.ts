import { aboutInfoSchema, betterInputSettingsPatchSchema, betterInputSettingsViewSchema, booleanSchema, convertFileResultSchema, listRoutesResultSchema, optimizeResultSchema, polishResultSchema, resolveModelEffortsResultSchema, templateInputSchema, templateListResultSchema, templateRemoveResultSchema, templateSaveResultSchema, textSchema, updateCheckResultSchema } from './remote-contract.js'

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
          codec: { mode: 'strict', typeSymbol: 'string', schema: textSchema }
        },
        {
          name: 'model',
          wire: 'model',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', schema: textSchema }
        }
      ],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#ResolveModelEffortsResult',
        schema: resolveModelEffortsResultSchema
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
        schema: aboutInfoSchema
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
        schema: updateCheckResultSchema
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
        },
        {
          name: 'context',
          wire: 'context',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', schema: textSchema }
        }
      ],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'string',
        schema: optimizeResultSchema
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
          codec: { mode: 'strict', typeSymbol: 'string', schema: textSchema }
        },
        {
          name: 'fileData',
          wire: 'fileData',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'string', schema: textSchema }
        },
        {
          name: 'ocr',
          wire: 'ocr',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'boolean', schema: booleanSchema }
        }
      ],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#ConvertFileResult',
        schema: convertFileResultSchema
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
        schema: templateListResultSchema
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
        codec: { mode: 'strict', typeSymbol: 'dsh-better-input#TemplateInput', schema: templateInputSchema }
      }],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#TemplateSaveResult',
        schema: templateSaveResultSchema
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
        codec: { mode: 'strict', typeSymbol: 'string', schema: textSchema }
      }],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-better-input#TemplateRemoveResult',
        schema: templateRemoveResultSchema
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
            name: 'resolveModelEfforts',
            signature: 'resolveModelEfforts(provider: string, model: string): Promise<{ efforts: readonly ReasoningEffortInfo[]; defaultEffort?: string }>',
            summary: 'Resolve reasoning-effort tiers for one route (lazy).',
            jsDoc: '/** Resolve reasoning-effort tiers for one route (lazy). */'
          },
          {
            kind: 'method',
            name: 'getAbout',
            signature: 'getAbout(): AboutInfo',
            summary: 'Read the installed plugin identity and repository info.',
            jsDoc: '/** Read the installed plugin identity and repository info. */'
          },
          {
            kind: 'method',
            name: 'checkForUpdate',
            signature: 'checkForUpdate(signal: AbortSignal): Promise<UpdateCheckResult>',
            summary: 'Check the npm registry for the latest published version.',
            jsDoc: '/** Check the npm registry for the latest published version. */'
          },
          {
            kind: 'method',
            name: 'polish',
            signature: 'polish(transcript: string, provider: string, model: string, signal: AbortSignal): Promise<string>',
            summary: 'Polish one transcript through a selected dsh route.',
            jsDoc: '/** Polish one transcript through a selected dsh route. */'
          },
          {
            kind: 'method',
            name: 'optimize',
            signature: 'optimize(text: string, provider: string, model: string, context: string, signal: AbortSignal): Promise<string>',
            summary: 'Optimize one prompt through a selected dsh route.',
            jsDoc: '/** Optimize one prompt through a selected dsh route. */'
          },
          {
            kind: 'method',
            name: 'convertFile',
            signature: 'convertFile(fileName: string, fileData: string, ocr?: boolean, signal: AbortSignal): Promise<ConvertFileResult>',
            summary: 'Convert a binary file to Markdown on the Host. With ocr=true, scanned PDF pages / PPTX images are read by the vision model.',
            jsDoc: '/** Convert a binary file to Markdown on the Host. With ocr=true, scanned PDF pages / PPTX images are read by the vision model. */'
          },
          {
            kind: 'method',
            name: 'templatesList',
            signature: 'templatesList(): Promise<TemplateListResult>',
            summary: 'List all saved prompt templates, newest first.',
            jsDoc: '/** List all saved prompt templates, newest first. */'
          },
          {
            kind: 'method',
            name: 'templatesSave',
            signature: 'templatesSave(template: TemplateInput, signal: AbortSignal): Promise<TemplateSaveResult>',
            summary: 'Create or update one prompt template on the Host filesystem.',
            jsDoc: '/** Create or update one prompt template on the Host filesystem. */'
          },
          {
            kind: 'method',
            name: 'templatesRemove',
            signature: 'templatesRemove(id: string, signal: AbortSignal): Promise<TemplateRemoveResult>',
            summary: 'Remove one prompt template by id.',
            jsDoc: '/** Remove one prompt template by id. */'
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
            declaration: 'export interface ReasoningEffortInfo { id: string; name: string; description?: string } export interface PolishRoute { provider: string; providerName: string; model: string; modelName: string; reasoningEfforts: readonly ReasoningEffortInfo[]; defaultReasoningEffort?: string }'
          },
          {
            name: 'AboutInfo',
            declaration: 'export interface AboutInfo { repository: string; repositorySlug: string; version: string; license: string; updateCommand: string; updateCommandNpx: string }'
          },
          {
            name: 'UpdateCheckResult',
            declaration: "export type UpdateCheckResult = { status: 'up-to-date' | 'update-available' | 'unpublished' | 'error'; installed: string; latest: string | null; updateCommand: string; updateCommandNpx: string }"
          },
          {
            name: 'ConvertFileResult',
            declaration: "export type ConvertFileResult = { success: boolean; format: 'text' | 'pdf' | 'docx' | 'xlsx' | 'xls' | 'pptx' | 'html' | 'epub' | 'csv' | 'json' | 'xml' | 'zip'; markdown: string; warnings: readonly string[]; metadata?: { pageCount?: number; slideCount?: number; sheetCount?: number; wordCount?: number; fileCount?: number } }"
          },
          {
            name: 'BetterInputTemplate',
            declaration: 'export interface BetterInputTemplate { id: string; name: string; description: string; content: string; tags: readonly string[]; createdAt: number; updatedAt: number }'
          },
          {
            name: 'TemplateInput',
            declaration: 'export interface TemplateInput { id?: string; name: string; description?: string; content: string; tags?: readonly string[] }'
          },
          {
            name: 'TemplateListResult',
            declaration: 'export interface TemplateListResult { templates: readonly BetterInputTemplate[] }'
          },
          {
            name: 'TemplateSaveResult',
            declaration: 'export interface TemplateSaveResult { template: BetterInputTemplate }'
          },
          {
            name: 'TemplateRemoveResult',
            declaration: 'export interface TemplateRemoveResult { removed: boolean }'
          }
        ]
      }
    ],
    events: [],
    objects: []
  }
} as const

export default TYPERT
