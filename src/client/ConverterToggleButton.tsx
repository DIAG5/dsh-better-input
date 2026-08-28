import { useEffect, useState } from 'react'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import type { ConversionStore } from './conversion-store.js'

/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>

/**
 * The small composer toolbar toggle for the file-conversion panel. Sits in the
 * `conversation.input.right` tool row (mirroring the prompt-optimize sparkle);
 * clicking expands/collapses the conversion dock with a non-linear transition.
 */
export function ConverterToggleButton({ store, t }: { store: ConversionStore; t: Translate }) {
  const [expanded, setExpanded] = useState(store.isExpanded())

  useEffect(() => {
    return store.subscribe(() => setExpanded(store.isExpanded()))
  }, [store])

  const toggle = () => store.setExpanded(!store.isExpanded())

  return (
    <button
      type="button"
      aria-label={t('convertToggle')}
      title={t('convertToggle')}
      aria-expanded={expanded}
      onClick={toggle}
      style={buttonStyle(expanded)}
    >
      <ConvertGlyph />
    </button>
  )
}

function ConvertGlyph() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 16 16" width="14">
      <path d="M8 3v6m0 0L5.5 6.5M8 9l2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function buttonStyle(expanded: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    height: 26,
    padding: '0 8px',
    border: 'none',
    borderRadius: 6,
    background: expanded ? 'var(--dsw-alias-state-business-tertiary, rgba(79,140,255,0.15))' : 'transparent',
    color: expanded ? 'var(--dsw-alias-state-business-primary, #4f8cff)' : 'var(--dsw-alias-label-secondary, inherit)',
    cursor: 'pointer',
    fontSize: 12,
    opacity: expanded ? 1 : 0.75,
    flex: 'none',
    transition: 'background 0.18s cubic-bezier(0.22,1,0.36,1), color 0.18s cubic-bezier(0.22,1,0.36,1), opacity 0.18s cubic-bezier(0.22,1,0.36,1)'
  }
}