import type { ConvertibleFormat } from './types.js'

/**
 * Detect a file's format from its extension and leading bytes.
 *
 * Two signals are combined: a lowercase extension map (fast, handles files the
 * user renamed) and a small set of magic-byte signatures (authoritative for the
 * container formats). Extension wins for ambiguous container-compatible types
 * (e.g. `.docx` vs `.zip`) because inside the DSH flow a `.docx` should still
 * route to the Word converter even though a ZIP reader could also open it.
 */

const EXTENSION_TO_FORMAT: Record<string, ConvertibleFormat> = {
  // Documents
  pdf: 'pdf',
  docx: 'docx',
  xlsx: 'xlsx',
  xls: 'xls',
  pptx: 'pptx',
  // Web / markup
  html: 'html',
  htm: 'html',
  xhtml: 'html',
  // E-books
  epub: 'epub',
  // Data
  csv: 'csv',
  tsv: 'csv',
  json: 'json',
  xml: 'xml',
  // Container
  zip: 'zip',
}

/** Leading bytes that identify a format regardless of its file extension. */
function detectByMagicBytes(data: Uint8Array): ConvertibleFormat | null {
  const view = data
  const len = view.length
  const at = (i: number, start = 0): number => len > start + i ? view[start + i]! : 0

  const isZipSig =
    at(0) === 0x50 && at(1) === 0x4b && (at(2) === 0x03 || at(2) === 0x05 || at(2) === 0x07)
  if (isZipSig) {
    // DOCX / XLSX / PPTX are ZIP containers with a distinctive [Content_Types].xml
    // at the root. Distinguish them only when the extension is missing.
    const probe = new TextDecoder('utf-8', { fatal: false }).decode(view.slice(0, 4096))
    if (!probe.includes('[Content_Types].xml')) return 'zip'
    return 'zip' // extension decides below; without it we cannot tell doc/book apart
  }

  const isPdfSig = at(0) === 0x25 && at(1) === 0x50 && at(2) === 0x44 && at(3) === 0x46
  if (isPdfSig) return 'pdf'

  return null
}

/** Extract and normalize the file extension from a path or name. */
function extensionOf(filePath: string): string {
  const base = filePath.split(/[\\/]/).pop() ?? filePath
  const dot = base.lastIndexOf('.')
  if (dot < 0) return ''
  return base.slice(dot + 1).toLowerCase()
}

/**
 * Detect the conversion format for a named buffer. Returns the format, or
 * `null` when the file is not one we can convert.
 */
export function detectFormat(filePath: string, data: Uint8Array): ConvertibleFormat | null {
  const ext = extensionOf(filePath)

  // Prefer a known extension for the container-based Office formats so renamed
  // files route correctly.
  const byExt = ext === '' ? undefined : EXTENSION_TO_FORMAT[ext]
  if (byExt !== undefined) return byExt

  // Fall back to magic bytes when there is no usable extension.
  return detectByMagicBytes(data)
}

/** Whether a detected format is recognized as convertible by this plugin. */
export function isConvertible(format: unknown): format is ConvertibleFormat {
  return (
    format === 'text' || format === 'pdf' || format === 'docx' || format === 'xlsx' || format === 'xls' ||
    format === 'pptx' || format === 'html' || format === 'epub' || format === 'csv' ||
    format === 'json' || format === 'xml' || format === 'zip'
  )
}