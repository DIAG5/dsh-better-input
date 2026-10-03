import type { Context } from '@deepseek-ai/cordis'
import { BetterInputSettingsSchema } from './config-schema.js'
import { BetterInputPolishService } from './polish/service.js'

export const name = 'dsh-better-input'

/**
 * The plugin's dsh config schema. cordis reads `plugin.Config` from the module
 * the Loader imports (`runtime.Config = plugin.Config`), and dsh-settings derives
 * the settings namespace and form from it — so it must live here, not on a
 * nested service.
 */
export const Config = BetterInputSettingsSchema

/**
 * Host half of dsh-better-input.
 *
 * Voice input runs in the browser through the Web Speech API; the Host
 * contributes the transcript polishing service (reusing dsh's own LLM routes
 * and credentials) and the plugin settings namespace. Future versions plug
 * PDF conversion and image input in here.
 */
export async function apply(ctx: Context): Promise<void> {
  ctx.inject(['settings'], (settingsCtx) => {
    // BetterInput ships its own settings.section UI, so suppress the native
    // auto-generated page. The owner must be THIS plugin's fiber — the default
    // owner is the settings service's own fiber, which maps to no entry.
    settingsCtx.effect(
      () => settingsCtx.settings.configure({ auto: false }, ctx.fiber),
      'dsh-better-input settings presentation'
    )
  })

  await ctx.plugin(BetterInputPolishService)

  ctx.effect(() => {
    return () => undefined
  }, 'dsh-better-input lifecycle')
}