import type { Context } from '@deepseek-ai/cordis'
import { BetterInputPolishService } from './polish/service.js'

export const name = 'dsh-better-input'

/**
 * Host half of dsh-better-input.
 *
 * Voice input runs in the browser through the Web Speech API; the Host
 * contributes the transcript polishing service (reusing dsh's own LLM routes
 * and credentials) and the plugin settings namespace. Future versions plug
 * PDF conversion and image input in here.
 */
export async function apply(ctx: Context): Promise<void> {
  await ctx.plugin(BetterInputPolishService)

  ctx.effect(() => {
    return () => undefined
  }, 'dsh-better-input lifecycle')
}
