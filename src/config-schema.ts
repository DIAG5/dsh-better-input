import s from '@deepseek-ai/schemastery'
import { DEFAULT_SETTINGS } from './config.js'

/**
 * Host-only dsh settings schema; keep schemastery out of the browser bundle.
 *
 * Exported as the plugin's `Config` from `index.ts` so the Loader can own the
 * entry. Every field must be marked `.volatile()`: dsh 0.2.0's `SettingsForms`
 * only projects fields that sit under a volatile node, and rejects writes to
 * any path outside one.
 */
export const BetterInputSettingsSchema = s.object({
  language: s.string().default(DEFAULT_SETTINGS.language).description('Recognition language, empty follows the dsh UI locale').volatile(),
  maxRecordingSeconds: s.number().default(DEFAULT_SETTINGS.maxRecordingSeconds).description('Recording limit in seconds').volatile(),
  polishingEnabled: s.boolean().default(DEFAULT_SETTINGS.polishingEnabled).description('Enable Host LLM polishing').volatile(),
  polishProvider: s.string().default(DEFAULT_SETTINGS.polishProvider).description('dsh polish provider id').volatile(),
  polishModel: s.string().default(DEFAULT_SETTINGS.polishModel).description('dsh polish model id').volatile(),
  polishReasoningEffort: s.string().default(DEFAULT_SETTINGS.polishReasoningEffort).description('dsh polish reasoning effort id, empty uses the adapter default (lowest tier)').volatile(),
  polishPrompt: s.string().default(DEFAULT_SETTINGS.polishPrompt).description('Custom polish system prompt, empty for built-in').volatile(),
  optimizeEnabled: s.boolean().default(DEFAULT_SETTINGS.optimizeEnabled).description('Enable prompt optimization').volatile(),
  optimizeProvider: s.string().default(DEFAULT_SETTINGS.optimizeProvider).description('dsh optimize provider id').volatile(),
  optimizeModel: s.string().default(DEFAULT_SETTINGS.optimizeModel).description('dsh optimize model id').volatile(),
  optimizeReasoningEffort: s.string().default(DEFAULT_SETTINGS.optimizeReasoningEffort).description('dsh optimize reasoning effort id, empty uses the adapter default (lowest tier)').volatile(),
  optimizePrompt: s.string().default(DEFAULT_SETTINGS.optimizePrompt).description('Custom optimize system prompt, empty for built-in').volatile(),
  contextTurns: s.number().default(DEFAULT_SETTINGS.contextTurns).description('Recent conversation turns included as context for optimization (0 = disabled)').volatile(),
  ocrProvider: s.string().default(DEFAULT_SETTINGS.ocrProvider).description('dsh OCR vision provider id, empty reuses the polish route').volatile(),
  ocrModel: s.string().default(DEFAULT_SETTINGS.ocrModel).description('dsh OCR vision model id, empty reuses the polish route').volatile()
})