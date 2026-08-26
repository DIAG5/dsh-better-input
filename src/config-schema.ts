import s from '@deepseek-ai/schemastery'
import { DEFAULT_SETTINGS } from './config.js'

/** Host-only dsh settings schema; keep schemastery out of the browser bundle. */
export const BetterInputSettingsSchema = s.object({
  language: s.string().default(DEFAULT_SETTINGS.language).description('Recognition language, empty follows the dsh UI locale'),
  maxRecordingSeconds: s.number().default(DEFAULT_SETTINGS.maxRecordingSeconds).description('Recording limit in seconds'),
  polishingEnabled: s.boolean().default(DEFAULT_SETTINGS.polishingEnabled).description('Enable Host LLM polishing'),
  polishProvider: s.string().default(DEFAULT_SETTINGS.polishProvider).description('dsh polish provider id'),
  polishModel: s.string().default(DEFAULT_SETTINGS.polishModel).description('dsh polish model id'),
  polishReasoningEffort: s.string().default(DEFAULT_SETTINGS.polishReasoningEffort).description('dsh polish reasoning effort id, empty uses the adapter default (lowest tier)'),
  polishPrompt: s.string().default(DEFAULT_SETTINGS.polishPrompt).description('Custom polish system prompt, empty for built-in'),
  optimizeEnabled: s.boolean().default(DEFAULT_SETTINGS.optimizeEnabled).description('Enable prompt optimization'),
  optimizeProvider: s.string().default(DEFAULT_SETTINGS.optimizeProvider).description('dsh optimize provider id'),
  optimizeModel: s.string().default(DEFAULT_SETTINGS.optimizeModel).description('dsh optimize model id'),
  optimizeReasoningEffort: s.string().default(DEFAULT_SETTINGS.optimizeReasoningEffort).description('dsh optimize reasoning effort id, empty uses the adapter default (lowest tier)'),
  optimizePrompt: s.string().default(DEFAULT_SETTINGS.optimizePrompt).description('Custom optimize system prompt, empty for built-in'),
  contextTurns: s.number().default(DEFAULT_SETTINGS.contextTurns).description('Recent conversation turns included as context for optimization (0 = disabled)'),
  ocrProvider: s.string().default(DEFAULT_SETTINGS.ocrProvider).description('dsh OCR vision provider id, empty reuses the polish route'),
  ocrModel: s.string().default(DEFAULT_SETTINGS.ocrModel).description('dsh OCR vision model id, empty reuses the polish route')
})
