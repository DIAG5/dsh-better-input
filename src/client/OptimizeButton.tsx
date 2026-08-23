import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import type { ConversationSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import type { BetterInputRemote } from '../remote.js'
import type { SettingsFace } from './MicrophoneButton.js'

/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>

/**
 * Props handed to every `conversation.input.dock` entry, plus the injected
 * remote and settings face. The standard session kit provides `inputActions`
 * and `useInput` separately; the owner share gives us `input.draft` and
 * `session` (the conversation snapshot with message history).
 */
export type OptimizeButtonProps = {
  readonly input: {
    readonly draft: string
  }
  readonly inputActions: {
    setDraft(text: string): void
  }
  readonly session: ConversationSnapshot
  readonly remote: BetterInputRemote
  readonly useSettings: () => SettingsFace
  readonly t: Translate
}

type OptimizeState =
  | { kind: 'idle' }
  | { kind: 'optimizing' }
  | { kind: 'result'; original: string; optimized: string }
  | { kind: 'error'; message: string }

/**
 * The ✨ optimize button rendered above the composer card (in
 * `conversation.input.dock`), right-aligned. Click reads the current draft,
 * calls the Host LLM to optimize it, then shows a confirmation panel with
 * the original and optimized text. The draft is replaced only when the user
 * clicks "Adopt".
 */
export function OptimizeButton({ input, inputActions, session, remote, useSettings, t }: OptimizeButtonProps) {
  const [state, setState] = useState<OptimizeState>({ kind: 'idle' })
  const settingsFace = useSettings()
  const abortRef = useRef<AbortController | null>(null)

  // Keep the latest draft in a ref so the click handler can read it without
  // re-subscribing on every keystroke.
  const draftRef = useRef(input.draft)
  useEffect(() => {
    draftRef.current = input.draft
  }, [input.draft])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const settings = settingsFace.status === 'ready' ? settingsFace.settings : null
  // The prompt-optimize feature is a core capability: an on/off toggle works
  // against the "everything is a plugin" philosophy, so it stays always-on
  // and users just configure its provider/model/prompt in settings.

  const provider = settings?.optimizeProvider.trim() ?? ''
  const model = settings?.optimizeModel.trim() ?? ''
  const modelConfigured = provider !== '' && model !== ''

  const handleClick = async () => {
    if (state.kind === 'optimizing') return
    const draft = draftRef.current.trim()
    if (draft === '') {
      setState({ kind: 'error', message: t('optimizeEmpty') })
      return
    }

    if (!modelConfigured) {
      setState({ kind: 'error', message: t('optimizeNotConfigured') })
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setState({ kind: 'optimizing' })

    try {
      // Extract conversation context based on user settings
      const contextTurns = settings?.contextTurns ?? 3
      const context = contextTurns > 0 ? extractConversationContext(session, contextTurns) : ''
      const result = await remote.optimize(draft, provider, model, context, controller.signal)
      if (controller.signal.aborted) return
      if (!result.ok) {
        setState({ kind: 'error', message: result.error.message })
        return
      }
      const optimized = result.value.trim()
      if (optimized === '') {
        setState({ kind: 'error', message: t('optimizeFailed') })
        return
      }
      // Always show the comparison panel, even when the model returned the
      // text unchanged — silently closing after a visible loading state
      // reads as "the button did nothing".
      setState({ kind: 'result', original: draft, optimized })
    } catch (error) {
      if (controller.signal.aborted) return
      setState({ kind: 'error', message: error instanceof Error ? error.message : t('optimizeFailed') })
    } finally {
      if (abortRef.current === controller) abortRef.current = null
    }
  }

  const handleAdopt = () => {
    if (state.kind !== 'result') return
    inputActions.setDraft(state.optimized)
    setState({ kind: 'idle' })
  }

  const handleCancel = () => {
    setState({ kind: 'idle' })
  }

  const busy = state.kind === 'optimizing'
  const disabled = busy || !modelConfigured
  const buttonTitle = modelConfigured ? t('optimizeButton') : t('optimizeNotConfigured')

  const errorToast = state.kind === 'error' ? (
    <ErrorToastPortal
      message={state.message}
      onDismiss={handleCancel}
    />
  ) : null

  const confirmModal = state.kind === 'result' ? (
    <ConfirmModalPortal
      title={t('optimizePanelTitle')}
      originalLabel={t('optimizeOriginalLabel')}
      optimizedLabel={t('optimizeOptimizedLabel')}
      original={state.original}
      optimized={state.optimized}
      adoptLabel={t('optimizeAdopt')}
      cancelLabel={t('optimizeCancel')}
      onAdopt={handleAdopt}
      onCancel={handleCancel}
    />
  ) : null

  return (
    <>
      <div style={containerStyle}>
        <button
          type="button"
          aria-label={buttonTitle}
          title={buttonTitle}
          disabled={disabled}
          onClick={handleClick}
          style={buttonStyle(disabled)}
        >
          <SparkleIcon />
          {busy ? t('optimizeBusy') : ''}
        </button>
      </div>
      {errorToast}
      {confirmModal}
    </>
  )
}

function OptimizeConfirmPanel(props: {
  title: string
  originalLabel: string
  optimizedLabel: string
  original: string
  optimized: string
  adoptLabel: string
  cancelLabel: string
  onAdopt: () => void
  onCancel: () => void
}) {
  return (
    <div style={modalContentStyle}>
      <div style={panelTitleStyle}>{props.title}</div>
      <div style={compareRowStyle}>
        <div style={compareColStyle}>
          <div style={compareLabelStyle}>{props.originalLabel}</div>
          <pre style={preStyle}>{props.original}</pre>
        </div>
        <div style={compareColStyle}>
          <div style={compareLabelStyle}>{props.optimizedLabel}</div>
          <pre style={{ ...preStyle, borderColor: 'var(--dsh-color-primary, #4f8cff)' }}>{props.optimized}</pre>
        </div>
      </div>
      <div style={panelActionsStyle}>
        <button type="button" style={cancelBtnStyle} onClick={props.onCancel}>{props.cancelLabel}</button>
        <button type="button" style={adoptBtnStyle} onClick={props.onAdopt}>{props.adoptLabel}</button>
      </div>
    </div>
  )
}

/**
 * Comparison modal portalled to `document.body`. DSH renders slot content
 * inside shadow roots whose ancestors may clip or contain fixed-position
 * children, so the overlay must escape the component tree entirely.
 */
function ConfirmModalPortal(props: {
  title: string
  originalLabel: string
  optimizedLabel: string
  original: string
  optimized: string
  adoptLabel: string
  cancelLabel: string
  onAdopt: () => void
  onCancel: () => void
}) {
  return createPortal(
    <div style={modalOverlayStyle} onClick={props.onCancel}>
      <div onClick={(e) => e.stopPropagation()}>
        <OptimizeConfirmPanel {...props} />
      </div>
    </div>,
    document.body
  )
}

/**
 * Small error modal, also portalled to `document.body` for the same
 * stacking/escaping reasons as the comparison modal.
 */
function ErrorToastPortal({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return createPortal(
    <div style={modalOverlayStyle} onClick={onDismiss}>
      <div style={errorModalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ flex: 1 }}>{message}</div>
        <button type="button" style={errorDismissStyle} onClick={onDismiss}>×</button>
      </div>
    </div>,
    document.body
  )
}

function SparkleIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 16 16" width="14">
      <path
        d="M8 1.5l1.3 3.7L13 6.5l-3.7 1.3L8 11.5 6.7 7.8 3 6.5l3.7-1.3L8 1.5z"
        fill="currentColor"
      />
      <path
        d="M12.5 10.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  )
}

/**
 * Extract recent conversation context from the session snapshot. Returns a
 * plain-text summary of the last N user/assistant turns, formatted as:
 *
 *   User: <message text>
 *   Assistant: <response text (truncated at 500 chars)>
 *
 * Returns an empty string when there are no user/assistant nodes.
 */
function extractConversationContext(session: ConversationSnapshot, maxTurns: number): string {
  // Collect user and assistant nodes in display order.
  const relevant: Array<{ role: 'user' | 'assistant'; text: string }> = []
  for (const node of session.nodes) {
    if (node.kind === 'user') {
      // Extract text from user content blocks.
      const text = (node as unknown as { content: readonly { type: string; text: string }[] }).content
        .filter((c) => c.type === 'text')
        .map((c) => c.text)
        .join('')
      if (text.trim()) relevant.push({ role: 'user', text: text.trim() })
    } else if (node.kind === 'assistant') {
      // Extract text from assistant blocks.
      const text = (node as unknown as { blocks: readonly { kind: string; text: string }[] }).blocks
        .filter((b) => b.kind === 'text')
        .map((b) => b.text)
        .join('')
      if (text.trim()) relevant.push({ role: 'assistant', text: text.trim().slice(0, 500) })
    }
  }

  // Take only the last `maxTurns` turns (a turn = user + assistant pair).
  const recent = relevant.slice(-maxTurns * 2)
  if (recent.length === 0) return ''

  return recent
    .map((entry) => (entry.role === 'user' ? `User: ${entry.text}` : `Assistant: ${entry.text}`))
    .join('\n')
}

// --- Styles ---
// Now rendered inline as a regular item in the `conversation.input.right`
// flex row (left of the microphone button). No more position hacks — order
// in `index.ts` places it on the microphone's immediate left.

const containerStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 26,
  flex: 'none'
}

const buttonStyle = (disabled: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  height: 26,
  padding: '0 8px',
  border: 'none',
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--dsh-color-text-secondary, inherit)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  fontSize: 12,
  flex: 'none'
})

// "Full-screen" overlay with position:fixed anchored to the viewport so it
// escapes any overflow clipping inside the composer card.
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 99998
}

const modalContentStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 10,
  background: 'var(--dsh-color-surface, #fff)',
  border: '1px solid var(--dsh-color-border, #e0e0e0)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  width: 'min(640px, 92vw)',
  zIndex: 99999
}

const panelTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 10,
  color: 'var(--dsh-color-text, inherit)'
}

const compareRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  maxHeight: 300
}

const compareColStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0
}

const compareLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--dsh-color-text-secondary, #888)',
  marginBottom: 4
}

const preStyle: React.CSSProperties = {
  margin: 0,
  padding: 10,
  fontSize: 12,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflow: 'auto',
  maxHeight: 240,
  borderRadius: 6,
  border: '1px solid var(--dsh-color-border, #e8e8e8)',
  background: 'var(--dsh-color-surface-muted, #f9f9f9)',
  color: 'var(--dsh-color-text, inherit)',
  fontFamily: 'inherit'
}

const panelActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  marginTop: 12
}

const adoptBtnStyle: React.CSSProperties = {
  padding: '6px 16px',
  border: 'none',
  borderRadius: 6,
  background: 'var(--dsh-color-primary, #4f8cff)',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 13
}

const cancelBtnStyle: React.CSSProperties = {
  padding: '6px 16px',
  border: '1px solid var(--dsh-color-border, #ddd)',
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--dsh-color-text, inherit)',
  cursor: 'pointer',
  fontSize: 13
}

// Error toast, also portal-rendered on top of everything.
const errorModalStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 8,
  background: 'var(--dsh-color-surface, #fff)',
  border: '1px solid var(--dsh-color-danger, #f5c2c7)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  color: 'var(--dsh-color-danger-text, #c33)',
  fontSize: 13,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  zIndex: 99999,
  maxWidth: 420,
  width: 'min(420px, 90vw)'
}

const errorDismissStyle: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: 18,
  padding: 0,
  lineHeight: 1,
  flex: 'none'
}
