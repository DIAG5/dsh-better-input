import { useEffect, useRef } from 'react'
import { effectiveRecognitionLanguage, effectiveRecordingSeconds, type BetterInputSettings, type BetterInputSettingsPatch } from '../config.js'
import type { BetterInputRemote } from '../remote.js'
import { stringsForBrowser } from './strings.js'
import { WebSpeechSession, isWebSpeechAvailable } from './web-speech.js'
import { useVoiceInputSession, type VoiceInputSession } from './voice-session.js'

/**
 * Standard props the conversation input zone hands to every
 * `conversation.input.right` entry, plus the injected voice session and
 * settings controller face.
 */
export type InputZoneLikeProps = {
  readonly input: {
    readonly draft: string
  }
  readonly inputActions: {
    setDraft(text: string): void
  }
  readonly voiceSession: VoiceInputSession
  readonly remote: BetterInputRemote
  readonly useSettings: () => SettingsFace
}

export type SettingsFace = {
  readonly status: 'loading' | 'ready' | 'error'
  readonly settings: BetterInputSettings
}

/**
 * The microphone button in the composer tool row. Click to start listening,
 * click again to stop. Transcripts stream into the draft in real time; when
 * polishing is enabled, the committed transcript is polished through the Host
 * LLM route and replaces the draft (unless the user edited it meanwhile).
 */
export function MicrophoneButton({ input, inputActions, voiceSession, remote, useSettings }: InputZoneLikeProps) {
  const strings = stringsForBrowser()
  const snapshot = useVoiceInputSession(voiceSession)
  const state = snapshot.state
  const setState = (next: typeof state, detail = '') => voiceSession.setState(next, detail)

  const speechRef = useRef<WebSpeechSession | null>(null)
  const baseDraftRef = useRef('')
  const mountedRef = useRef(true)
  const stopRef = useRef<(() => void) | null>(null)
  const polishAbortRef = useRef<AbortController | null>(null)
  const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const settingsRef = useRef<BetterInputSettings | null>(null)
  const settingsFace = useSettings()
  if (settingsFace.status === 'ready') settingsRef.current = settingsFace.settings

  // The latest committed draft. Updated on every input prop change so the
  // polish race check can tell whether the user edited the draft meanwhile.
  const latestDraftRef = useRef(input.draft)
  useEffect(() => {
    latestDraftRef.current = input.draft
  }, [input.draft])

  useEffect(() => {
    mountedRef.current = true
    const stop = voiceSession.onStopRequested(() => stopRef.current?.())
    const cancel = voiceSession.onCancelRequested(() => {
      speechRef.current?.abort()
      polishAbortRef.current?.abort()
    })
    return () => {
      mountedRef.current = false
      stop()
      cancel()
      speechRef.current?.abort()
      speechRef.current = null
      polishAbortRef.current?.abort()
      polishAbortRef.current = null
      clearRecordingTimer(recordingTimerRef)
      voiceSession.setState('idle')
    }
  }, [voiceSession])

  const active = state === 'starting' || state === 'recording'
  const busy = state === 'transcribing' || state === 'polishing'

  const startListening = () => {
    if (active || busy) return
    const baseDraft = input.draft
    baseDraftRef.current = baseDraft
    let sessionDraft = baseDraft
    let failed = false
    setState('starting')

    let session: WebSpeechSession
    try {
      session = new WebSpeechSession({
        language: effectiveRecognitionLanguage(settingsRef.current?.language ?? ''),
        onInterim: (text) => {
          sessionDraft = updateDraft(baseDraft, text)
          inputActions.setDraft(sessionDraft)
        },
        onFinal: (text) => {
          sessionDraft = updateDraft(baseDraft, text)
          inputActions.setDraft(sessionDraft)
        },
        onError: (error) => {
          failed = true
          setState('error', error.message)
        },
        onEnd: (text) => {
          speechRef.current = null
          clearRecordingTimer(recordingTimerRef)
          if (!mountedRef.current) return
          const transcript = text.trim()
          if (failed) return
          if (transcript === '') {
            setState('idle')
            return
          }
          const draftAtStop = updateDraft(baseDraft, transcript)
          inputActions.setDraft(draftAtStop)
          latestDraftRef.current = draftAtStop
          const settings = settingsRef.current
          if (settings !== null && settings.polishingEnabled && settings.polishProvider.trim() !== '' && settings.polishModel.trim() !== '') {
            void polishDraft({
              transcript,
              baseDraft,
              draftAtStop,
              provider: settings.polishProvider,
              model: settings.polishModel,
              remote,
              setState,
              latestDraftRef,
              actionsRef: { current: inputActions },
              polishAbortRef
            })
          } else {
            setState('idle')
          }
        }
      })
    } catch (error) {
      if (mountedRef.current) {
        setState('error', error instanceof Error ? error.message : 'Speech recognition is unavailable in this browser')
      }
      return
    }

    speechRef.current = session
    session.start()
    setState('recording')
    // Auto-stop at the configured recording limit so an abandoned session
    // never holds the microphone forever.
    armRecordingTimer(recordingTimerRef, effectiveRecordingSeconds(settingsRef.current ?? { maxRecordingSeconds: 120 }), () => {
      speechRef.current?.stop()
    })
  }

  const stopListening = () => {
    clearRecordingTimer(recordingTimerRef)
    if (!active) return
    speechRef.current?.stop()
  }

  stopRef.current = stopListening

  const tooltip = busy
    ? strings.voiceBusy
    : active
      ? strings.voiceStop
      : state === 'polish-error'
        ? strings.polishFailedKeepOriginal
        : state === 'error'
          ? strings.voiceFailed
          : strings.voiceStart
  const label = busy ? '…' : active ? strings.voiceStop : strings.voiceStart

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={busy}
      title={tooltip}
      onClick={active ? stopListening : startListening}
      data-better-input-state={state}
      style={buttonStyle(active, busy)}
    >
      <MicrophoneIcon />
    </button>
  )
}

export interface PolishDraftOptions {
  transcript: string
  baseDraft: string
  draftAtStop: string
  provider: string
  model: string
  remote: BetterInputRemote
  setState: (state: 'idle' | 'error' | 'polish-error' | 'polishing', detail?: string) => void
  latestDraftRef: { current: string }
  actionsRef: { current: { setDraft(text: string): void } }
  polishAbortRef: { current: AbortController | null }
}

export async function polishDraft(options: PolishDraftOptions): Promise<void> {
  if (options.provider.trim() === '' || options.model.trim() === '') return
  const controller = new AbortController()
  options.polishAbortRef.current = controller
  options.setState('polishing')

  try {
    const result = await options.remote.polish(options.transcript, options.provider, options.model, controller.signal)
    if (controller.signal.aborted) return
    if (!shouldApplyPolishResult(options.latestDraftRef.current, options.draftAtStop, options.baseDraft)) {
      options.setState('idle')
      return
    }
    if (!result.ok) {
      options.setState('polish-error', result.error.message)
      return
    }
    const text = result.value.trim() !== '' ? result.value.trim() : options.transcript
    const nextDraft = updateDraft(options.baseDraft, text)
    options.latestDraftRef.current = nextDraft
    options.actionsRef.current.setDraft(nextDraft)
    options.setState('idle')
  } catch (error) {
    if (controller.signal.aborted) return
    options.setState('polish-error', error instanceof Error ? error.message : 'Polishing failed')
  } finally {
    if (options.polishAbortRef.current === controller) options.polishAbortRef.current = null
  }
}

/**
 * Only replace the draft when the user has not edited it since the transcript
 * landed. Both the transcript-at-stop and the base draft count as unchanged
 * (the user may have reverted the interim edits).
 */
export function shouldApplyPolishResult(currentDraft: string, draftAtStop: string, baseDraft: string): boolean {
  const current = collapseDraft(currentDraft)
  return current === collapseDraft(draftAtStop) || current === collapseDraft(baseDraft)
}

function collapseDraft(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function buttonStyle(active: boolean, busy: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    padding: 0,
    border: 'none',
    borderRadius: 6,
    background: active ? 'var(--dsh-color-primary, #4f8cff)' : 'transparent',
    color: active ? '#fff' : 'var(--dsh-color-text, inherit)',
    cursor: busy ? 'default' : 'pointer',
    opacity: busy ? 0.5 : 1,
    flex: 'none'
  }
}

function MicrophoneIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M8 1.75a2.25 2.25 0 0 0-2.25 2.25v3.5a2.25 2.25 0 0 0 4.5 0V4A2.25 2.25 0 0 0 8 1.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12.25V14M5.5 14h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  )
}

/** Append transcript to a base draft with one space separator. */
export function updateDraft(baseDraft: string, transcript: string): string {
  const text = transcript.trim()
  if (text === '') return baseDraft
  if (baseDraft === '') return text
  if (/\s$/.test(baseDraft) || /^\s/.test(text)) return baseDraft + text
  return `${baseDraft} ${text}`
}

function armRecordingTimer(timerRef: { current: ReturnType<typeof setTimeout> | null }, seconds: number, stop: () => void): void {
  clearRecordingTimer(timerRef)
  timerRef.current = setTimeout(stop, Math.max(1, seconds) * 1000)
}

function clearRecordingTimer(timerRef: { current: ReturnType<typeof setTimeout> | null }): void {
  if (timerRef.current === null) return
  clearTimeout(timerRef.current)
  timerRef.current = null
}

export function isSupported(): boolean {
  return isWebSpeechAvailable()
}

export type { BetterInputSettingsPatch }
