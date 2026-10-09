import { useEffect, useState } from 'react'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { ConversionStore } from './conversion-store.js'

/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>

/**
 * The file-conversion toggle in the `conversation.input.right` tool row.
 * Clicking expands/collapses the conversion dock with a non-linear transition.
 * Styled to the composer's round "selector" button convention (28px circle).
 */
export function ConverterToggleButton({ store, t }: { store: ConversionStore; t: Translate }) {
  const [expanded, setExpanded] = useState(store.isExpanded())
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    return store.subscribe(() => setExpanded(store.isExpanded()))
  }, [store])

  const toggle = () => store.setExpanded(!store.isExpanded())
  const label = t('convertToggle')

  return (
    <Tooltip side="top" delayMs={500} label={label}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={expanded}
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={buttonStyle(expanded, hovered)}
      >
        <ConvertGlyph />
      </button>
    </Tooltip>
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

/**
 * The composer's round selector button: 28px circle with the
 * `--dsw-specific-selector` fill and a hover fill. Hover is tracked in React
 * state (the plugin styles everything inline) rather than a CSS pseudo-class.
 */
function buttonStyle(expanded: boolean, hovered: boolean): React.CSSProperties {
  const background = expanded
    ? 'var(--dsw-alias-state-business-tertiary, rgba(79,140,255,0.15))'
    : hovered
      ? 'var(--dsw-alias-interactive-bg-hover-solid)'
      : 'var(--dsw-specific-selector)'
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    padding: 0,
    border: 'none',
    borderRadius: 999,
    background,
    color: expanded ? 'var(--dsw-alias-state-business-primary, #4f8cff)' : 'var(--dsw-alias-label-primary)',
    cursor: 'pointer',
    flex: 'none',
    transition: 'background 0.18s cubic-bezier(0.22,1,0.36,1), color 0.18s cubic-bezier(0.22,1,0.36,1)'
  }
}