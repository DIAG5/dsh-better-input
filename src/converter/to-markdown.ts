import type { ConvertibleFormat, ConvertResult } from './types.js'
import { detectFormat, isConvertible } from './detect.js'
import { docxConverter } from './docx.js'
import { htmlConverter } from './html.js'
import { csvConverter } from './csv.js'
import { xlsxConverter } from './xlsx.js'
import { jsonConverter } from './json.js'
import { pdfConverter } from './pdf.js'
import { pptxConverter } from './pptx.js'
import { epubConverter } from './epub.js'
import { xmlConverter } from './xml.js'
import { zipConverter } from './zip.js'

/**
 * File extensions DSH natively accepts as plain text — these need no Markdown
 * conversion. They are routed to a "read as-is" converter that returns the
 * raw content in a fenced code block, keeping them useful alongside the
 * binary-document converters.
 */
const PLAIN_TEXT_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'log',
  'py', 'js', 'ts', 'tsx', 'jsx', 'html', 'htm', 'css', 'scss', 'less',
  'json', 'yaml', 'yml', 'xml',
  'ini', 'toml', 'cfg', 'conf', 'env', 'properties',
  'sh', 'bash', 'zsh', 'ps1', 'bat', 'cmd',
  'c', 'cpp', 'h', 'hpp', 'java', 'go', 'rs', 'rb', 'php', 'sql', 'swift', 'kt',
])

/** Map a detected (non-plain-text) format to its converter. 'text' is handled
 *  separately above and never dispatched through this map. */
const CONVERTERS: Record<Exclude<ConvertibleFormat, 'text'>, (path: string, data: Uint8Array) => Promise<ConvertResult>> = {
  pdf: pdfConverter,
  docx: docxConverter,
  xlsx: xlsxConverter,
  xls: xlsxConverter, // SheetJS reads .xls too
  pptx: pptxConverter,
  html: htmlConverter,
  epub: epubConverter,
  csv: csvConverter,
  json: jsonConverter,
  xml: xmlConverter,
  zip: zipConverter,
}

export type { ConvertibleFormat, ConvertResult } from './types.js'

/**
 * Convert a named, in-memory file to Markdown.
 *
 * This is the single public entry the Host service calls. It detects the
 * format, dispatches to the matching converter, and guarantees a well-shaped
 * {@link ConvertResult} — throwing only for genuinely unsupported input.
 *
 * @throws when the format is unsupported or detection fails.
 */
export async function convertFile(
  filePath: string,
  data: Uint8Array
): Promise<ConvertResult> {
  const extension = extLabel(filePath)
  // Plain-text files DSH reads natively: present the original content as-is.
  // Success without conversion, so the client can say "无需转换，可直接发送".
  if (extension !== '' && PLAIN_TEXT_EXTENSIONS.has(extension)) {
    return convertPlainText(extension, data)
  }

  const format = detectFormat(filePath, data)
  if (!isConvertible(format)) {
    throw new Error(`不支持的文件类型：${format ?? (extension || '未知')}`)
  }
  // At this point `format` is never 'text' (detectFormat cannot return it),
  // and plain-text extensions were routed above; dispatch to the binary
  // converters.
  const converter = CONVERTERS[format as Exclude<ConvertibleFormat, 'text'>]
  return converter(filePath, data)
}

/** Read a plain-text file verbatim, fenced under its language tag. */
function convertPlainText(extension: string, data: Uint8Array): ConvertResult {
  const text = new TextDecoder('utf-8', { fatal: false }).decode(data)
  const lang = fenceLanguageOf(extension)
  return {
    success: true,
    format: 'text',
    markdown: '```' + lang + '\n' + text.replace(/\r\n/g, '\n') + '\n```\n',
    warnings: ['DSH 原生支持该文件，无需转换，已按原样提供'],
    metadata: { wordCount: text.split(/\s+/).filter(Boolean).length },
  }
}

/** Map a plain-text extension to a fenced-code language tag ('' = none). */
function fenceLanguageOf(extension: string): string {
  const map: Record<string, string> = {
    txt: 'text', md: 'markdown', markdown: 'markdown', log: 'text',
    py: 'python', js: 'javascript', ts: 'typescript', tsx: 'tsx', jsx: 'jsx',
    html: 'html', htm: 'html', css: 'css', scss: 'scss', less: 'less',
    json: 'json', yaml: 'yaml', yml: 'yaml', xml: 'xml',
    ini: 'ini', toml: 'toml', cfg: 'ini', conf: 'ini', env: 'ini', properties: 'ini',
    sh: 'bash', bash: 'bash', zsh: 'bash', ps1: 'powershell', bat: 'bat', cmd: 'bat',
    c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp', java: 'java', go: 'go', rs: 'rust',
    rb: 'ruby', php: 'php', sql: 'sql', swift: 'swift', kt: 'kotlin',
  }
  return map[extension] ?? ''
}

/** Recurse for a nested zip conversion (delegated by zip.ts). */
export async function convertBuffer(
  filePath: string,
  data: Uint8Array
): Promise<ConvertResult> {
  return convertFile(filePath, data)
}

function extLabel(filePath: string): string {
  const dot = filePath.lastIndexOf('.')
  return dot >= 0 ? filePath.slice(dot + 1).toLowerCase() : ''
}