import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import type { BetterInputRemote } from '../remote.js'
import type { ConversionController } from './conversion-controller.js'
import type { ConversionItem } from './conversion-types.js'

/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>

/**
 * Props handed to the file-conversion dock entry. `controller` drives the
 * conversion→chip pipeline for the current session; `remote` runs the Host
 * conversion.
 */
export type FileConvertDockProps = {
  readonly sessionId: string
  readonly remote: BetterInputRemote
  readonly controller: ConversionController
  readonly t: Translate
}

/** A queued file waiting to be converted. */
type PendingFile = {
  id: string
  name: string
  data: Uint8Array
  format: string
  state: 'idle' | 'converting'
  error?: string
}

/** Maximum bytes we send to the Host for conversion.
 *  Wide enough to admit image-heavy documents (large on disk, little text) that
 *  users may legitimately want converted; the Host independently caps the raw
 *  payload to avoid parsing an absurdly huge buffer. */
const MAX_UPLOAD_BYTES = 200 * 1024 * 1024

let nextRefId = 0

/** Convenience holder the dock shares so the source can re-render on edits. */
function refOf(name: string): string {
  nextRefId += 1
  return `bi-${Date.now().toString(36)}-${nextRefId}`
}

/**
 * The file-conversion dock above the composer. Users add local files as chips;
 * "开始转换" runs the Host converter and, on success, asks the controller to
 * open the picker so the document is inserted as an inline `@<label>` chip.
 * Each inserted conversion also keeps an "编辑" entry here so the Markdown can
 * be revised before sending.
 */
export function FileConvertDock({ sessionId, remote, controller, t }: FileConvertDockProps) {
  const [files, setFiles] = useState<PendingFile[]>([])
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [editingRef, setEditingRef] = useState<string | null>(null)
  const [ocrAsk, setOcrAsk] = useState<PendingFile | null>(null)
  const [expanded, setExpanded] = useState(controller.store.isExpanded())
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Re-render when a conversion's stored Markdown changes (after edits) or the
  // expanded flag flips (toolbar toggle).
  const [, setTick] = useState(0)
  useEffect(() => {
    return controller.store.subscribe(() => {
      setExpanded(controller.store.isExpanded())
      setTick((n) => n + 1)
    })
  }, [controller])

  const editing = editingRef !== null ? controller.store.get(editingRef) : undefined

  const handlePick = (list: FileList | null) => {
    if (!list) return
    releaseAbort()
    setError(null)
    const oversized = Array.from(list).some((f) => f.size > MAX_UPLOAD_BYTES)
    if (oversized) {
      setError(t('convertFileTooLarge'))
      return
    }
    for (const file of Array.from(list)) {
      if (file.size === 0) continue
      file.arrayBuffer().then((buf) => {
        const bytes = new Uint8Array(buf)
        return (async () => {
          const id = refOf(file.name)
          const format = fileTypeOf(file.name)
          const sendable = isPlainTextExtension(format)
          // For plain-text files, read content client-side so they can be sent
          // without conversion; binary documents wait for "开始转换".
          const markdown = sendable ? decodeText(bytes) : ''
          controller.store.set({
            ref: id,
            name: file.name,
            markdown,
            format,
            sendable,
          })
          setFiles((prev) => {
            if (prev.some((p) => p.name === file.name)) return prev
            return [...prev, { id, name: file.name, data: bytes, format, state: 'idle' }]
          })
        })()
      }).catch(() => setError(t('convertFailed')))
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleConvert = async (file: PendingFile, useOcr: boolean) => {
    if (file.state === 'converting') return
    if (file.data.byteLength === 0) {
      setError(t('convertEmptyFile'))
      return
    }
    setError(null)
    setFiles((prev) => prev.map((p) => p.id === file.id ? { ...p, state: 'converting' } : p))

    releaseAbort()
    const controller2 = new AbortController()
    abortRef.current = controller2

    try {
      const result = await remote.convertFile(file.name, bytesToBase64(file.data), useOcr, controller2.signal)
      if (controller2.signal.aborted) return
      if (!result.ok) {
        setError(result.error.message)
        return
      }
      if (!result.value.success) {
        setError(result.value.warnings[0] ?? t('convertFailed'))
        return
      }
      // Plain-text formats (DSH reads natively): no conversion needed — mark
      // the item sendable as-is and avoid opening the insert picker.
      if (result.value.format === 'text') {
        controller.store.set({
          ref: file.id,
          name: file.name,
          markdown: result.value.markdown,
          format: result.value.format,
          sendable: true,
        })
        setError(t('convertPlainReady'))
        return
      }
      // Converted binary document: now sendable — store the Markdown and open
      // the picker to insert it as a chip.
      const item: ConversionItem = {
        ref: file.id,
        name: file.name,
        markdown: result.value.markdown,
        format: result.value.format,
        sendable: true,
      }
      controller.insertConversion(sessionId, item)
      // Keep the file chip in the dock so the user can edit or re-insert it.
    } catch (err) {
      if (controller2.signal.aborted) return
      setError(err instanceof Error ? err.message : t('convertFailed'))
    } finally {
      if (abortRef.current === controller2) abortRef.current = null
      setFiles((prev) => prev.map((p) => p.id === file.id ? { ...p, state: 'idle' } : p))
    }
  }

  const handleRemove = (id: string) => {
    controller.store.delete(id)
    setFiles((prev) => prev.filter((p) => p.id !== id))
  }

  /** Start an OCR conversion, but first verify a vision model is configured.
   *  Without one we show a friendly info toast instead of running the Host
   *  (which would surface as an error). */
  const startOcrWithCheck = async (file: PendingFile) => {
    try {
      const view = await remote.getSettings()
      const settings = view.ok ? view.value.settings : undefined
      if (settings === undefined || settings.ocrProvider.trim() === '' || settings.ocrModel.trim() === '') {
        setInfo(t('ocrNotConfiguredInfo'))
        return
      }
    } catch {
      // If the settings read fails, let the Host decide (it still guards).
    }
    await handleConvert(file, true)
  }

  const releaseAbort = () => {
    abortRef.current?.abort()
    abortRef.current = null
  }

  return (
    <>
      <div
        data-better-input-convert-dock="true"
        style={foldStyle(expanded)}
        aria-hidden={!expanded}
        {...(!expanded ? { 'inert': '' } : {})}
      >
        <div style={dockStyle}>
          <div style={railStyle}>
          {files.map((file) => {
            const item = controller.store.get(file.id)
            const ready = item !== undefined && item.sendable
            return (
              <div key={file.id} style={chipStyle}>
                <FileGlyph />
                <span style={chipNameStyle} title={file.name}>{file.name}</span>
                {file.state === 'converting' ? (
                  <span style={busyStyle}>{t('convertBusy')}</span>
                ) : ready ? (
                  <span style={okBadgeStyle}>✓</span>
                ) : (
                  <button type="button" style={convertBtnStyle} onClick={() => {
                    if (file.format === 'pdf' || file.format === 'pptx') {
                      setOcrAsk(file)
                    } else {
                      void handleConvert(file, false)
                    }
                  }} title={t('convertStart')}>
                    {t('convertStart')}
                  </button>
                )}
                {ready && (
                  <button type="button" style={linkBtnStyle} onClick={() => setEditingRef(file.id)} title={t('convertEdit')}>
                    {t('convertEdit')}
                  </button>
                )}
                <button type="button" aria-label={t('convertRemove')} title={t('convertRemove')} onClick={() => handleRemove(file.id)} style={closeBtnStyle}>
                  ×
                </button>
              </div>
            )
          })}
          {files.length === 0 && <span style={placeholderStyle}>{t('convertNoFile')}</span>}
          </div>
          <button type="button" onClick={() => inputRef.current?.click()} style={addBtnStyle} title={t('convertAddFile')}>
            <AttachGlyph /> {t('convertAddFile')}
          </button>
          <input ref={inputRef} type="file" multiple style={{ display: 'none' }} onChange={(e) => handlePick(e.target.files)} />
        </div>
      </div>

      {editing ? (
        <EditModal
          item={editing}
          t={t}
          onSave={(md) => { controller.editConversion(editing.ref, md); setEditingRef(null) }}
          onClose={() => setEditingRef(null)}
        />
      ) : null}

      {ocrAsk ? (
        <OcrConfirmModal
          fileName={ocrAsk.name}
          t={t}
          onRegular={() => {
            const f = ocrAsk
            setOcrAsk(null)
            void handleConvert(f, false)
          }}
          onOcr={() => {
            const f = ocrAsk
            setOcrAsk(null)
            void startOcrWithCheck(f)
          }}
          onClose={() => setOcrAsk(null)}
        />
      ) : null}

      {info ? <InfoToast message={info} onDismiss={() => setInfo(null)} /> : null}

      {error ? <ErrorToast message={error} onDismiss={() => setError(null)} /> : null}
    </>
  )
}

function fileTypeOf(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : ''
}

/** Extensions DSH reads natively as plain text (mirrors the Host set). */
const PLAIN_TEXT_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'log', 'py', 'js', 'ts', 'tsx', 'jsx',
  'html', 'htm', 'css', 'scss', 'less', 'json', 'yaml', 'yml', 'xml',
  'ini', 'toml', 'cfg', 'conf', 'env', 'properties', 'sh', 'bash', 'zsh',
  'ps1', 'bat', 'cmd', 'c', 'cpp', 'h', 'hpp', 'java', 'go', 'rs', 'rb',
  'php', 'sql', 'swift', 'kt',
])

function isPlainTextExtension(ext: string): boolean {
  return PLAIN_TEXT_EXTENSIONS.has(ext)
}

/** Decode bytes as UTF-8 text (client-side plain-text passthrough). */
function decodeText(bytes: Uint8Array): string {
  const decoder = new TextDecoder('utf-8', { fatal: false })
  return decoder.decode(bytes).replace(/\r\n/g, '\n')
}

// --- Edit modal (secondary editing of a converted result) ---

function EditModal(props: {
  item: ConversionItem
  t: Translate
  onSave: (markdown: string) => void
  onClose: () => void
}) {
  const [md, setMd] = useState(props.item.markdown)
  return (
    <ModalShell onClose={props.onClose} title={`${props.t('convertEdit')}: ${props.item.name}`}>
      <div style={metaRowStyle}>
        <span style={metaItemStyle}>{props.t('convertPreviewFormatLabel')}: {props.item.format.toUpperCase()}</span>
      </div>
      <textarea
        value={md}
        onChange={(e) => setMd(e.target.value)}
        spellCheck={false}
        style={editableStyle}
      />
      <div style={actionsStyle}>
        <button type="button" style={cancelBtnStyle} onClick={props.onClose}>{props.t('convertCancel')}</button>
        <button type="button" style={overwriteBtnStyle} onClick={() => props.onSave(md)}>{props.t('convertSave')}</button>
      </div>
    </ModalShell>
  )
}

// --- OCR confirm modal: ask whether to run the vision model on PDF/PPT ---

function OcrConfirmModal(props: {
  fileName: string
  t: Translate
  onRegular: () => void
  onOcr: () => void
  onClose: () => void
}) {
  const { fileName, t, onRegular, onOcr, onClose } = props
  return (
    <ModalShell onClose={onClose} title={t('ocrConfirmTitle')}>
      <p style={modalBodyStyle}>{t('ocrConfirmBody')}</p>
      <div style={metaRowStyle}>
        <span style={metaItemStyle}>{fileName}</span>
      </div>
      <div style={actionsStyle}>
        <button type="button" style={cancelBtnStyle} onClick={onClose}>{t('ocrConfirmCancel')}</button>
        <button type="button" style={linkBtnStyle} onClick={onRegular}>{t('ocrConfirmRegular')}</button>
        <button type="button" style={overwriteBtnStyle} onClick={onOcr}>{t('ocrConfirmOcr')}</button>
      </div>
    </ModalShell>
  )
}

// --- Portals & styles reuse the plugin's existing modal/doc patterns ---

function ModalShell(props: { title: string; onClose: () => void; children: React.ReactNode }) {
  return createPortal(
    <div style={overlayStyle} onClick={props.onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalTitleStyle}>{props.title}</div>
        {props.children}
      </div>
    </div>,
    document.body
  )
}

function ErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return createPortal(
    <div style={toastOverlayStyle} onClick={onDismiss}>
      <div style={toastStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ flex: 1 }}>{message}</div>
        <button type="button" style={toastCloseStyle} onClick={onDismiss}>×</button>
      </div>
    </div>,
    document.body
  )
}

function InfoToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return createPortal(
    <div style={toastOverlayStyle} onClick={onDismiss}>
      <div style={infoToastStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ flex: 1 }}>{message}</div>
        <button type="button" style={toastCloseStyle} onClick={onDismiss}>×</button>
      </div>
    </div>,
    document.body
  )
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

function FileGlyph() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 16 16" width="14">
      <path d="M3 1.5h7l3 3v10h-10z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M10 1.5v3h3" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

function AttachGlyph() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 16 16" width="14">
      <path d="M8 3v6m0-6 L5.5 5.5M8 3l2.5 2.5M8 10a2 2 0 0 0 2-2V4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// --- Styles (mirror the plugin's CSS-var-led design) ---

/**
 * Non-linear fold/unfold wrapper: a single outer height/opacity/translate
 * transition with a springy cubic-bezier so expanding feels alive rather than
 * a linear slide.
 */
const foldStyle = (expanded: boolean): React.CSSProperties => ({
  overflow: 'hidden',
  maxHeight: expanded ? 160 : 0,
  opacity: expanded ? 1 : 0,
  transform: expanded ? 'translateY(0)' : 'translateY(-6px)',
  pointerEvents: expanded ? 'auto' : 'none',
  transition: 'max-height 0.34s cubic-bezier(0.22,1,0.36,1), opacity 0.28s cubic-bezier(0.22,1,0.36,1), transform 0.28s cubic-bezier(0.22,1,0.36,1)'
})

const dockStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 8,
  fontSize: 12, lineHeight: '18px',
  background: 'var(--dsh-color-surface-raised, rgba(0,0,0,0.04))',
  color: 'var(--dsh-color-text, inherit)'
}
const railStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, flex: 1, overflowX: 'auto', minWidth: 0 }
const chipStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 6px', borderRadius: 6, background: 'var(--dsh-color-surface, #fff)', border: '1px solid var(--dsh-color-border, #e0e0e0)', whiteSpace: 'nowrap' }
const chipNameStyle: React.CSSProperties = { maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'inherit' }
const okBadgeStyle: React.CSSProperties = { color: 'var(--dsh-color-success, #2f9e44)', fontWeight: 600 }
const busyStyle: React.CSSProperties = { color: 'var(--dsh-color-text-secondary, #888)' }
const convertBtnStyle: React.CSSProperties = { padding: '1px 6px', border: 'none', borderRadius: 4, background: 'var(--dsh-color-primary, #4f8cff)', color: '#fff', cursor: 'pointer', fontSize: 11 }
const linkBtnStyle: React.CSSProperties = { padding: '1px 6px', border: '1px solid var(--dsh-color-border, #ddd)', borderRadius: 4, background: 'transparent', color: 'var(--dsh-color-text, inherit)', cursor: 'pointer', fontSize: 11 }
const addBtnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', border: '1px solid var(--dsh-color-border, #ddd)', borderRadius: 6, background: 'transparent', color: 'var(--dsh-color-text, inherit)', cursor: 'pointer', fontSize: 12, flex: 'none' }
const closeBtnStyle: React.CSSProperties = { border: 'none', background: 'transparent', color: 'var(--dsh-color-text-secondary, #888)', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1 }
const placeholderStyle: React.CSSProperties = { color: 'var(--dsh-color-text-secondary, #888)' }

const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99998 }
const modalStyle: React.CSSProperties = { padding: 14, borderRadius: 10, background: 'var(--dsh-color-surface, #fff)', border: '1px solid var(--dsh-color-border, #e0e0e0)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', width: 'min(680px, 92vw)', maxHeight: '80vh', display: 'flex', flexDirection: 'column', zIndex: 99999 }
const modalTitleStyle: React.CSSProperties = { fontSize: 14, fontWeight: 600, marginBottom: 10, color: 'var(--dsh-color-text, inherit)' }
const metaRowStyle: React.CSSProperties = { display: 'flex', gap: 16, marginBottom: 8, fontSize: 12, color: 'var(--dsh-color-text-secondary, #888)' }
const metaItemStyle: React.CSSProperties = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
const editableStyle: React.CSSProperties = { flex: 1, minHeight: 240, maxHeight: '46vh', padding: 10, fontSize: 12, lineHeight: 1.6, borderRadius: 6, border: '1px solid var(--dsh-color-border, #e8e8e8)', background: 'var(--dsh-color-surface-muted, #f9f9f9)', color: 'var(--dsh-color-text, inherit)', fontFamily: 'inherit', resize: 'none', whiteSpace: 'pre-wrap' }
const actionsStyle: React.CSSProperties = { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }
const modalBodyStyle: React.CSSProperties = { margin: '0 0 8px', fontSize: 13, lineHeight: 1.6, color: 'var(--dsh-color-text, inherit)' }
const overwriteBtnStyle: React.CSSProperties = { padding: '6px 16px', border: 'none', borderRadius: 6, background: 'var(--dsh-color-primary, #4f8cff)', color: '#fff', cursor: 'pointer', fontSize: 13 }
const cancelBtnStyle: React.CSSProperties = { padding: '6px 16px', border: '1px solid var(--dsh-color-border, #ddd)', borderRadius: 6, background: 'transparent', color: 'var(--dsh-color-text, inherit)', cursor: 'pointer', fontSize: 13 }
const toastOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 99998, pointerEvents: 'none', paddingTop: 16 }
const toastStyle: React.CSSProperties = { padding: '10px 14px', borderRadius: 8, background: 'var(--dsh-color-surface, #fff)', border: '1px solid var(--dsh-color-danger, #f5c2c7)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', color: 'var(--dsh-color-danger-text, #c33)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, maxWidth: 480, pointerEvents: 'auto' }
const infoToastStyle: React.CSSProperties = { padding: '10px 14px', borderRadius: 8, background: 'var(--dsh-color-surface, #fff)', border: '1px solid var(--dsh-color-border, #ddd)', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', color: 'var(--dsh-color-text, inherit)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, maxWidth: 480, pointerEvents: 'auto' }
const toastCloseStyle: React.CSSProperties = { border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1, flex: 'none' }