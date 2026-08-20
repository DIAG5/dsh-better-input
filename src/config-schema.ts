import s from '@deepseek-ai/schemastery'
import { DEFAULT_SETTINGS } from './config.js'

/** Host-only dsh settings schema; keep schemastery out of the browser bundle. */
export const BetterInputSettingsSchema = s.object({
  language: s.string().default(DEFAULT_SETTINGS.language).description('Recognition language, empty follows the dsh UI locale'),
  maxRecordingSeconds: s.number().default(DEFAULT_SETTINGS.maxRecordingSeconds).description('Recording limit in seconds'),
  polishingEnabled: s.boolean().default(DEFAULT_SETTINGS.polishingEnabled).description('Enable Host LLM polishing'),
  polishProvider: s.string().default(DEFAULT_SETTINGS.polishProvider).description('dsh polish provider id'),
  polishModel: s.string().default(DEFAULT_SETTINGS.polishModel).description('dsh polish model id'),
  polishPrompt: s.string().default(DEFAULT_SETTINGS.polishPrompt).description('Custom polish system prompt, empty for built-in')
})
