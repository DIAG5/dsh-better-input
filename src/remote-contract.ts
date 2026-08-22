import { z } from 'zod'
import type { BetterInputSettings, BetterInputSettingsPatch, BetterInputSettingsView, PolishRoute } from './config.js'

export const textSchema = z.string()

export const betterInputSettingsSchema = z.object({
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
})

export const betterInputSettingsPatchSchema = z.object({
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
})

export const betterInputSettingsViewSchema = z.object({
  available: z.boolean(),
  writable: z.boolean(),
  settings: betterInputSettingsSchema,
  overridden: z.array(z.string()),
  defaultPolishPrompt: z.string(),
  defaultOptimizePrompt: z.string()
})

export const reasoningEffortSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional()
})

export const resolveModelEffortsResultSchema = z.object({
  efforts: z.array(reasoningEffortSchema),
  defaultEffort: z.string().optional()
})

export const polishRouteSchema = z.object({
  provider: z.string(),
  providerName: z.string(),
  model: z.string(),
  modelName: z.string(),
  reasoningEfforts: z.array(reasoningEffortSchema),
  defaultReasoningEffort: z.string().optional()
})

export const listRoutesResultSchema = z.array(polishRouteSchema)

export const polishResultSchema = z.string()

export const optimizeResultSchema = z.string()

export type BetterInputSettingsWire = z.infer<typeof betterInputSettingsSchema>
export type BetterInputSettingsPatchWire = z.infer<typeof betterInputSettingsPatchSchema>
export type BetterInputSettingsViewWire = z.infer<typeof betterInputSettingsViewSchema>
export type PolishRouteWire = z.infer<typeof polishRouteSchema>
export type ReasoningEffortWire = z.infer<typeof reasoningEffortSchema>
export type ResolveModelEffortsResultWire = z.infer<typeof resolveModelEffortsResultSchema>
export type { BetterInputSettings, BetterInputSettingsPatch, BetterInputSettingsView, PolishRoute, ReasoningEffortInfo } from './config.js'
