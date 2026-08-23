import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Loads the conversation SlotMap augmentation (registers
// 'conversation.input.right' / 'conversation.input.dock' slot keys).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// Loads the settings SlotMap augmentation ('settings.section').
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { TYPERT_REMOTE } from '../remote.js'
import type { BetterInputRemote } from '../remote.js'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { BETTER_INPUT_NS, en, zh } from './strings.js'
import { MicrophoneButton, type SettingsFace } from './MicrophoneButton.js'
import { OptimizeButton } from './OptimizeButton.js'
import { VoiceRecognitionBar } from './VoiceRecognitionBar.js'
import { BetterInputSettingsSection } from './settings.jsx'
import { SettingsController, useSettingsSnapshot } from './settings-controller.js'
import { VoiceInputSession } from './voice-session.js'
import { ModelSelector } from './ModelSelector.js'
import { CSS as EFFORT_SLIDER_CSS } from './effort-slider.css.js'

const PULSE_KEYFRAMES = `@keyframes dsh-better-input-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}`

/** Required Client services: the slot registry, the Typert remote hub, the
 * DSH locale runtime, and the model-directories service (provided by the
 * DSH web-app bundle's `@deepseek-ai/dsh-client-ui-model-selection` plugin).
 * `remote.betterInput` is mounted by this plugin's own apply() via
 * `ctx.remote.$mount`, so it MUST NOT appear here — the outer inject gates
 * plugin activation and would deadlock waiting for itself. It is declared
 * only on the inner ctx.inject() below, which runs after the mount.
 * Settings reach the browser through `SettingsScopeBinder` (provided by
 * `@deepseek-ai/dsh-client-ui-settings`) and are read inside the settings
 * section slot itself, not via a top-level `settings` service here. */
export const inject = ['slots', 'remote', 'locale', 'modelDirectories']

export async function apply(ctx: ClientContext): Promise<() => Promise<void>> {
  const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE)
  // Register our bilingual dictionary with the DSH locale runtime BEFORE any
  // slot renders, so the injected `t` seat never hits a missing namespace.
  const disposeLocaleDicts = ctx.locale.register(BETTER_INPUT_NS, { zh, en })
  await ctx.inject(['slots', 'remote', 'remote.betterInput', 'modelDirectories'], async (remoteCtx) => {
    const remote = remoteCtx.remote.betterInput as BetterInputRemote
    const controller = new SettingsController(remote)

    const voiceSessions = new Map<string, VoiceInputSession>()
    const voiceSessionFor = (sessionId: string): VoiceInputSession => {
      let session = voiceSessions.get(sessionId)
      if (session === undefined) {
        session = new VoiceInputSession()
        voiceSessions.set(sessionId, session)
      }
      return session
    }

    remoteCtx.effect(() => () => {
      for (const session of voiceSessions.values()) session.dispose()
      voiceSessions.clear()
      controller.dispose()
    }, 'dsh-better-input sessions lifecycle')

    // Inject the keyframes used by the recognition bar pulse and the
    // effort-slider stylesheet.
    remoteCtx.effect(() => {
      const styleTag = document.createElement('style')
      styleTag.dataset.plugin = 'dsh-better-input'
      styleTag.textContent = PULSE_KEYFRAMES + '\n' + EFFORT_SLIDER_CSS
      document.head.appendChild(styleTag)
      return () => {
        styleTag.remove()
      }
    }, 'dsh-better-input styles')

    void controller.refreshSettings()
    void controller.refreshRoutes()

    const useSettings = (): SettingsFace => {
      const snapshot = useSettingsSnapshot(controller)
      if (snapshot.status !== 'ready') return { status: 'loading', settings: snapshot.view.settings }
      return { status: 'ready', settings: snapshot.view.settings }
    }

    // Recognition bar stays in `dock` (above the composer card, the
    // horizontal status strip) — unchanged placement.
    remoteCtx.slots.inject('conversation.input.dock', () =>
      remoteCtx.slots.register(
        {
          name: 'conversation.input.dock',
          id: 'better-input-recognition-bar',
          order: 15,
          locale: BETTER_INPUT_NS,
          inject: (sessionId) => ({ voiceSession: voiceSessionFor(sessionId) })
        },
        VoiceRecognitionBar
      )
    )

    // The sparkle (prompt-optimize) button sits inline inside the
    // `conversation.input.right` toolbar, immediately to the left of the
    // microphone. order = 9998 places it one slot before the mic (9999),
    // which is the rightmost edge of the public right slot — the model
    // picker and send button follow in their own, non-slot seats.
    remoteCtx.slots.inject('conversation.input.right', () =>
      remoteCtx.slots.register(
        {
          name: 'conversation.input.right',
          id: 'better-input-optimize',
          order: 9998,
          locale: BETTER_INPUT_NS,
          inject: () => ({
            remote,
            useSettings
          })
        },
        OptimizeButton
      )
    )

    // Microphone is the LAST registered entry in the public
    // `conversation.input.right` list, so it sits immediately right of the
    // sparkle and immediately left of DSH's built-in model-select seat.
    remoteCtx.slots.inject('conversation.input.right', () =>
      remoteCtx.slots.register(
        {
          name: 'conversation.input.right',
          id: 'better-input-voice',
          order: 9999,
          locale: BETTER_INPUT_NS,
          inject: (sessionId) => ({
            remote,
            voiceSession: voiceSessionFor(sessionId),
            useSettings
          })
        },
        MicrophoneButton
      )
    )

    remoteCtx.slots.inject('settings.section', () =>
      remoteCtx.slots.register(
        {
          name: 'settings.section',
          id: 'dsh-better-input',
          order: 16,
          // Thunk so the sidebar row follows the active locale on switches.
          label: () => ctx.locale.bind(BETTER_INPUT_NS)('settingsTitle'),
          locale: BETTER_INPUT_NS,
          inject: () => ({ settingsController: controller })
        },
        BetterInputSettingsSection
      )
    )

    // ── Model selector (replaces the built-in conversation.input.model) ──
    // Follow the canonical slot pattern: wrap `slots.register` in
    // `slots.inject(name, …)` so the loader waits for the parent entry to
    // declare the seat before Registering our occupant. The seat is a
    // single-slot, so we register with a lower priority (entriesOfSlot
    // returns the first entry, sorted by priority ascending) to shadow the
    // default occupant. The inject factory resolves the per-session model
    // directory from the `modelDirectories` service.
    //
    // If the user disables the composer slider in settings, this component
    // renders `null` and Cordis falls back to the next entry in the single
    // slot — i.e. the built-in model picker.
    remoteCtx.slots.inject('conversation.input.model', () =>
      remoteCtx.slots.register(
        {
          name: 'conversation.input.model',
          priority: -1,
          inject: (sessionId: string) => ({
            directory: remoteCtx.modelDirectories.directoryFor(sessionId),
            settingsController: controller,
          }),
        },
        ModelSelector
      )
    )

    return () => {
      // Slots and effects are disposed through their own fiber.
    }
  })

  return async () => {
    disposeLocaleDicts()
    await disposeRemote()
  }
}
