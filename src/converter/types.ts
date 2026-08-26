/**
 * Shared types for the file-to-markdown conversion layer.
 *
 * Conversion runs on the Host (Node) side, so these types are written for a
 * Node runtime. The Typert wire shape lives in remote-contract.ts; this file
 * keeps only the concepts the converter package itself needs.
 */

/** The file formats this plugin can convert (Phase 1 set). */
export type ConvertibleFormat =
  | 'text'
  | 'pdf'
  | 'docx'
  | 'xlsx'
  | 'xls'
  | 'pptx'
  | 'html'
  | 'epub'
  | 'csv'
  | 'json'
  | 'xml'
  | 'zip'

/** A human-readable label for the detected format. */
export const FORMAT_LABELS: Record<ConvertibleFormat, string> = {
  text: 'Text',
  pdf: 'PDF',
  docx: 'Word',
  xlsx: 'Excel',
  xls: 'Excel',
  pptx: 'PPT',
  html: 'HTML',
  epub: 'EPUB',
  csv: 'CSV',
  json: 'JSON',
  xml: 'XML',
  zip: 'ZIP',
} as const

/** Optional structured metadata produced by a converter (all omitted when unknown). */
export interface ConvertMetadata {
  pageCount?: number
  slideCount?: number
  sheetCount?: number
  wordCount?: number
  fileCount?: number
}

/** The result of one conversion attempt. */
export interface ConvertResult {
  success: boolean
  format: ConvertibleFormat
  markdown: string
  /** Non-fatal notices, e.g. "likely scanned PDF, text may be incomplete". */
  warnings: readonly string[]
  /** Structured metadata; omitted entirely when none was produced. */
  metadata?: ConvertMetadata
}

/**
 * The signature every per-format converter implements. `data` is the raw file
 * bytes; `filePath` is used only for detecting the format and messages.
 */
export type Converter = (
  filePath: string,
  data: Uint8Array
) => Promise<ConvertResult>

/**
 * Hard ceiling on the raw input bytes accepted for conversion. This guards the
 * Host against parsing an unexpectedly huge payload (which would build a large
 * in-memory document model), independent of any conversion result — a big file
 * with little text (e.g. an image-heavy PDF) must not be rejected merely
 * because we cannot infer characters from bytes.
 */
export const MAX_INPUT_BYTES = 200_000_000