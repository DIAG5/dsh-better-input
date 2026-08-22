import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import { useVoiceInputSession, type VoiceInputSession } from './voice-session.js'

/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>

export type RecognitionBarProps = {
  readonly voiceSession: VoiceInputSession
  readonly t: Translate
}

/**
 * The recognition status bar above the composer. Shows live state and a stop
 * button while recording; the bar renders nothing when idle.
 */
export function VoiceRecognitionBar({ voiceSession, t }: RecognitionBarProps) {
  const snapshot = useVoiceInputSession(voiceSession)

  const active = snapshot.state === 'starting' || snapshot.state === 'recording'
  const label = active
    ? t('listening')
    : snapshot.state === 'transcribing'
      ? t('transcribing')
      : snapshot.state === 'polishing'
        ? t('polishing')
        : snapshot.state === 'polish-error'
          ? t('polishFailedKeepOriginal')
          : snapshot.state === 'error'
            ? t('voiceFailed')
            : ''

  if (label === '') return null

  return (
    <div
      data-better-input-bar="true"
      role="status"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 10px',
        borderRadius: 8,
        fontSize: 12,
        lineHeight: '18px',
        background: 'var(--dsh-color-surface-raised, rgba(0,0,0,0.04))',
        color: 'var(--dsh-color-text, inherit)'
      }}
    >
      {active ? <PulsingDot /> : null}
      <span>{label}</span>
      {(snapshot.state === 'error' || snapshot.state === 'polish-error') && snapshot.detail !== '' ? (
        <span style={{ opacity: 0.7 }}>{snapshot.detail}</span>
      ) : null}
      {active ? (
        <button
          type="button"
          onClick={() => voiceSession.requestStop()}
          style={{
            marginLeft: 'auto',
            padding: '2px 8px',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            background: 'var(--dsh-color-danger, #e5484d)',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          {t('voiceStop')}
        </button>
      ) : null}
    </div>
  )
}

function PulsingDot() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#e5484d',
        animation: 'dsh-better-input-pulse 1.2s ease-in-out infinite'
      }}
    />
  )
}
