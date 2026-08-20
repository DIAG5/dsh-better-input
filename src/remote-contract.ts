import { z } from 'zod'
import type { BetterInputSettings, BetterInputSettingsPatch, BetterInputSettingsView, PolishRoute } from './config.js'

export const textSchema = z.string()

export const betterInputSettingsSchema = z.object({
  language: z.string(),
  maxRecordingSeconds: z.number(),
  polishingEnabled: z.boolean(),
  polishProvider: z.string(),
  polishModel: z.string(),
  polishPrompt: z.string()
})

export const betterInputSettingsPatchSchema = z.object({
  language: z.string().optional(),
  maxRecordingSeconds: z.number().optional(),
  polishingEnabled: z.boolean().optional(),
  polishProvider: z.string().optional(),
  polishModel: z.string().optional(),
  polishPrompt: z.string().optional()
})

export const betterInputSettingsViewSchema = z.object({
  available: z.boolean(),
  writable: z.boolean(),
  settings: betterInputSettingsSchema,
  overridden: z.array(z.string()),
  defaultPolishPrompt: z.string()
})

export const polishRouteSchema = z.object({
  provider: z.string(),
  providerName: z.string(),
  model: z.string(),
  modelName: z.string()
})

export const listRoutesResultSchema = z.array(polishRouteSchema)

export const polishResultSchema = z.string()

export type BetterInputSettingsWire = z.infer<typeof betterInputSettingsSchema>
export type BetterInputSettingsPatchWire = z.infer<typeof betterInputSettingsPatchSchema>
export type BetterInputSettingsViewWire = z.infer<typeof betterInputSettingsViewSchema>
export type PolishRouteWire = z.infer<typeof polishRouteSchema>
export type { BetterInputSettings, BetterInputSettingsPatch, BetterInputSettingsView, PolishRoute }
