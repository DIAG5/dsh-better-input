/**
 * Settings section for the prompt template library: list saved templates,
 * create/edit through an inline form, and delete with a two-step confirm.
 * Mirrors the settings section conventions (framework-injected `t` + local
 * frame/field components + dsw CSS variables).
 */

import { useEffect, useState } from 'react'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import type { TemplateWire } from '../remote-contract.js'
import { MAX_TEMPLATE_CONTENT_LENGTH, MAX_TEMPLATE_DESCRIPTION_LENGTH, MAX_TEMPLATE_NAME_LENGTH } from '../templates/model.js'
import { useTemplatesSnapshot } from './templates-controller.js'
import type { TemplateDraft, TemplatesController } from './templates-controller.js'

/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>

export type TemplatesSectionProps = {
  readonly close: () => void
  readonly t: Translate
  readonly templatesController: TemplatesController
}

type EditorState = { readonly kind: 'closed' } | { readonly kind: 'open'; readonly draft: TemplateDraft }

const EMPTY_DRAFT: TemplateDraft = { name: '', description: '', tags: '', content: '' }

function draftFromTemplate(template: TemplateWire): TemplateDraft {
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    tags: [...template.tags].join(', '),
    content: template.content
  }
}

export function TemplatesSection({ t, templatesController }: TemplatesSectionProps) {
  const snapshot = useTemplatesSnapshot(templatesController)
  const [editor, setEditor] = useState<EditorState>({ kind: 'closed' })
  const [busy, setBusy] = useState(false)
  const [actionFailed, setActionFailed] = useState(false)
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null)

  // Re-fetch on mount so the section always reflects the on-disk file (the
  // `/` trigger may have warmed the same controller earlier in the session).
  useEffect(() => {
    void templatesController.refresh()
  }, [templatesController])

  if (snapshot.status === 'loading') {
    return (
      <SectionFrame title={t('templatesTitle')}>
        <p style={hintStyle}>{t('loading')}</p>
      </SectionFrame>
    )
  }
  if (snapshot.status === 'error') {
    return (
      <SectionFrame title={t('templatesTitle')}>
        <p style={errorStyle}>{t('templatesLoadFailed')}: {snapshot.detail}</p>
        <button type="button" style={buttonStyle} onClick={() => void templatesController.refresh()}>
          {t('templatesRetry')}
        </button>
      </SectionFrame>
    )
  }

  const editing = editor.kind === 'open' ? editor.draft : null

  const saveDraft = async (): Promise<void> => {
    if (editing === null || busy) return
    if (editing.name.trim() === '' || editing.content.trim() === '') return
    setBusy(true)
    setActionFailed(false)
    const ok = await templatesController.save(editing)
    setBusy(false)
    if (ok) {
      setEditor({ kind: 'closed' })
    } else {
      setActionFailed(true)
    }
  }

  return (
    <SectionFrame title={t('templatesTitle')}>
      <p style={hintStyle}>{t('templatesDescription')}</p>
      {actionFailed ? <p style={errorStyle}>{t('templatesActionFailed')}</p> : null}
      {editing === null ? (
        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            setActionFailed(false)
            setArmedDeleteId(null)
            setEditor({ kind: 'open', draft: EMPTY_DRAFT })
          }}
        >
          {t('templatesNew')}
        </button>
      ) : (
        <div style={editorStyle}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={labelStyle}>{t('templatesNameLabel')}</span>
            <input
              value={editing.name}
              maxLength={MAX_TEMPLATE_NAME_LENGTH}
              placeholder={t('templatesNamePlaceholder')}
              onChange={(event) => setEditor({ kind: 'open', draft: { ...editing, name: event.target.value } })}
              style={inputStyle}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={labelStyle}>{t('templatesDescriptionLabel')}</span>
            <input
              value={editing.description}
              maxLength={MAX_TEMPLATE_DESCRIPTION_LENGTH}
              placeholder={t('templatesDescriptionPlaceholder')}
              onChange={(event) => setEditor({ kind: 'open', draft: { ...editing, description: event.target.value } })}
              style={inputStyle}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={labelStyle}>{t('templatesTagsLabel')}</span>
            <input
              value={editing.tags}
              placeholder={t('templatesTagsHint')}
              onChange={(event) => setEditor({ kind: 'open', draft: { ...editing, tags: event.target.value } })}
              style={inputStyle}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={labelStyle}>{t('templatesContentLabel')}</span>
            <textarea
              value={editing.content}
              rows={6}
              maxLength={MAX_TEMPLATE_CONTENT_LENGTH}
              placeholder={t('templatesContentPlaceholder')}
              onChange={(event) => setEditor({ kind: 'open', draft: { ...editing, content: event.target.value } })}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }}
            />
            <span style={hintStyle}>{editing.content.length} / {MAX_TEMPLATE_CONTENT_LENGTH}</span>
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              style={buttonStyle}
              disabled={busy || editing.name.trim() === '' || editing.content.trim() === ''}
              onClick={() => void saveDraft()}
            >
              {t('templatesSave')}
            </button>
            <button
              type="button"
              style={buttonStyle}
              disabled={busy}
              onClick={() => {
                setEditor({ kind: 'closed' })
                setActionFailed(false)
              }}
            >
              {t('templatesCancel')}
            </button>
          </div>
        </div>
      )}
      {snapshot.templates.length === 0 ? <p style={hintStyle}>{t('templatesEmpty')}</p> : null}
      {snapshot.templates.map((template) => (
        <div key={template.id} style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <strong style={{ fontSize: 13 }}>{template.name}</strong>
            <span style={hintStyle}>{new Date(template.updatedAt).toLocaleDateString()}</span>
          </div>
          {template.description !== '' ? <p style={hintStyle}>{template.description}</p> : null}
          <p style={previewStyle}>
            {template.content.length > 120 ? `${template.content.slice(0, 120)}…` : template.content}
          </p>
          {template.tags.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {template.tags.map((tag) => (
                <span key={tag} style={tagStyle}>{tag}</span>
              ))}
            </div>
          ) : null}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => {
                setActionFailed(false)
                setArmedDeleteId(null)
                setEditor({ kind: 'open', draft: draftFromTemplate(template) })
              }}
            >
              {t('templatesEdit')}
            </button>
            <button
              type="button"
              style={armedDeleteId === template.id ? deleteArmedStyle : buttonStyle}
              onClick={() => {
                if (armedDeleteId !== template.id) {
                  setArmedDeleteId(template.id)
                  return
                }
                setArmedDeleteId(null)
                void templatesController.remove(template.id).then((ok) => {
                  if (!ok) setActionFailed(true)
                })
              }}
            >
              {armedDeleteId === template.id ? t('templatesDeleteConfirm') : t('templatesDelete')}
            </button>
          </div>
        </div>
      ))}
    </SectionFrame>
  )
}

function SectionFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 16 }}>{title}</h2>
      {children}
    </div>
  )
}

const editorStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  border: '1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.4))',
  borderRadius: 6,
  background: 'var(--dsw-alias-bg-layer-1, rgba(0,0,0,0.03))'
}

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: 12,
  border: '1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.3))',
  borderRadius: 6
}

const previewStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  opacity: 0.8
}

const tagStyle: React.CSSProperties = {
  padding: '1px 6px',
  fontSize: 11,
  borderRadius: 4,
  border: '1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.3))',
  opacity: 0.85
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600
}

const buttonStyle: React.CSSProperties = {
  width: 'fit-content',
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.4))',
  background: 'var(--dsh-color-surface, transparent)',
  color: 'var(--dsw-alias-label-primary, inherit)',
  fontSize: 13,
  cursor: 'pointer'
}

const deleteArmedStyle: React.CSSProperties = {
  ...buttonStyle,
  borderColor: 'var(--dsw-alias-state-error-primary, #e5484d)',
  color: 'var(--dsw-alias-state-error-primary, #e5484d)'
}

const inputStyle: React.CSSProperties = {
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.4))',
  background: 'var(--dsw-alias-bg-layer-1, #f9f9f9)',
  color: 'var(--dsw-alias-label-primary, inherit)',
  fontSize: 13
}

const hintStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  opacity: 0.7
}

const errorStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: 'var(--dsw-alias-state-error-primary, #e5484d)'
}
