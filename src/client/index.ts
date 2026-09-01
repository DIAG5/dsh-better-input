import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Loads the conversation SlotMap augmentation (registers
// 'conversation.input.right' / 'conversation.input.dock' slot keys).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// Loads the settings SlotMap augmentation ('settings.section').
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Activates the `ctx.inputTriggers` service augmentation (module-level side effect).
import type {} from '@deepseek-ai/dsh-client-ui-input-trigger/client'
import { TYPERT_REMOTE } from '../remote.js'
import type { BetterInputRemote } from '../remote.js'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { BETTER_INPUT_NS, en, zh } from './strings.js'
import { MicrophoneButton, type SettingsFace } from './MicrophoneButton.js'
import { OptimizeButton } from './OptimizeButton.js'
import { VoiceRecognitionBar } from './VoiceRecognitionBar.js'
import { FileConvertDock } from './FileConvertDock.js'
import { ConverterToggleButton } from './ConverterToggleButton.js'
import { ConversionStore } from './conversion-store.js'
import { createConversionSource } from './conversion-source.js'
import { ConversionController } from './conversion-controller.js'
import { BetterInputSettingsSection } from './settings.jsx'
import { SettingsController, useSettingsSnapshot } from './settings-controller.js'
import { createTemplatesSource } from './templates-source.js'
import { TemplatesController } from './templates-controller.js'
import { TemplatesSection } from './templates-section.jsx'
import { VoiceInputSession } from './voice-session.js'

const PULSE_KEYFRAMES = `@keyframes dsh-better-input-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}`

/**
 * Narrow `remoteCtx.conversation.input` (the input hub) to the slice we
 * depend on. At runtime it exposes the session-scoped `inputTriggers(sessionId)`
 * and `shell(sessionId)` used to launch the picker — the public `IConversation`
 * type only declares `for`, so we cast through an opaque handle.
 */
function conversationInputHub(conversation: unknown): import('./conversion-controller.js').ConversationInputHubHandle {
  return conversation as import('./conversion-controller.js').ConversationInputHubHandle
}

/** Required Client services: the slot registry, the Typert remote hub, and
 * the DSH locale runtime. `remote.betterInput` is mounted by this plugin's
 * own apply() via `ctx.remote.$mount`, so it MUST NOT appear here — the
 * outer inject gates plugin activation and would deadlock waiting for
 * itself. It is declared only on the inner ctx.inject() below, which runs
 * after the mount. Settings reach the browser through `SettingsScopeBinder`
 * (provided by `@deepseek-ai/dsh-client-ui-settings`) and are read inside
 * the settings section slot itself, not via a top-level `settings` service
 * here. */
export const inject = ['slots', 'remote', 'locale', 'inputTriggers', 'conversation']

export async function apply(ctx: ClientContext): Promise<() => Promise<void>> {
  const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE)
  // Register our bilingual dictionary with the DSH locale runtime BEFORE any
  // slot renders, so the injected `t` seat never hits a missing namespace.
  const disposeLocaleDicts = ctx.locale.register(BETTER_INPUT_NS, { zh, en })
  await ctx.inject(['slots', 'remote', 'remote.betterInput', 'inputTriggers', 'conversation'], async (remoteCtx) => {
    const remote = remoteCtx.remote.betterInput as BetterInputRemote
    const controller = new SettingsController(remote)
    const templatesController = new TemplatesController(remote)

    const voiceSessions = new Map<string, VoiceInputSession>()
    const voiceSessionFor = (sessionId: string): VoiceInputSession => {
      let session = voiceSessions.get(sessionId)
      if (session === undefined) {
        session = new VoiceInputSession()
        voiceSessions.set(sessionId, session)
      }
      return session
    }

    // File-conversion chip pipeline: one shared result store; the input-trigger
    // source exposes converted documents as inline `@<label>` chips.
    const conversionStore = new ConversionStore()
    const disposeConversionSource = remoteCtx.inputTriggers.registerSource(createConversionSource(conversionStore))

    // Prompt template library: the `/` trigger source and the settings section
    // share one controller so both see the same optimistic updates.
    const disposeTemplatesSource = remoteCtx.inputTriggers.registerSource(createTemplatesSource(templatesController))

    remoteCtx.effect(() => () => {
      for (const session of voiceSessions.values()) session.dispose()
      voiceSessions.clear()
      disposeConversionSource()
      disposeTemplatesSource()
      controller.dispose()
      templatesController.dispose()
    }, 'dsh-better-input sessions lifecycle')

    // Inject the keyframes used by the recognition bar pulse.
    remoteCtx.effect(() => {
      const styleTag = document.createElement('style')
      styleTag.dataset.plugin = 'dsh-better-input'
      styleTag.textContent = PULSE_KEYFRAMES
      document.head.appendChild(styleTag)
      return () => {
        styleTag.remove()
      }
    }, 'dsh-better-input styles')

    void controller.refreshSettings()
    void controller.refreshRoutes()
    void templatesController.ensureLoaded()

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

    // The file-conversion dock sits on its own line above the composer,
    // directly under the recognition bar. Converting inserts the result as an
    // inline `@<label>` chip through the session-scoped controller; the dock
    // keeps an edit entry so the Markdown can be revised before sending.
    remoteCtx.slots.inject('conversation.input.dock', () =>
      remoteCtx.slots.register(
        {
          name: 'conversation.input.dock',
          id: 'better-input-file-convert',
          order: 20,
          locale: BETTER_INPUT_NS,
          inject: (sessionId) => ({
            sessionId,
            remote,
            controller: new ConversionController(conversionStore, conversationInputHub(remoteCtx.conversation.input)),
          })
        },
        FileConvertDock
      )
    )

    // The file-conversion toolbar toggle sits just left of the prompt-optimize
    // sparkle in the same `conversation.input.right` tool row. Click toggles
    // the conversion dock above the composer (collapsed by default).
    remoteCtx.slots.inject('conversation.input.right', () =>
      remoteCtx.slots.register(
        {
          name: 'conversation.input.right',
          id: 'better-input-convert-toggle',
          order: 9997,
          locale: BETTER_INPUT_NS,
          inject: () => ({ store: conversionStore })
        },
        ConverterToggleButton
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

    // Prompt template library management (list/create/edit/delete), right
    // under the main BetterInput settings section.
    remoteCtx.slots.inject('settings.section', () =>
      remoteCtx.slots.register(
        {
          name: 'settings.section',
          id: 'dsh-better-input-templates',
          order: 17,
          label: () => ctx.locale.bind(BETTER_INPUT_NS)('templatesTitle'),
          locale: BETTER_INPUT_NS,
          inject: () => ({ templatesController })
        },
        TemplatesSection
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
