import Papa from 'papaparse'
import type { Converter, ConvertResult } from './types.js'

/**
 * Convert a delimited text file (CSV/TSV) to a Markdown table.
 *
 * PapaParse handles quoting and multiline fields. When the column headers are
 * the first row we lock that row as the Markdown header; otherwise we synthesise
 * `Col 1`, `Col 2`, … for the separator row.
 */

/** Guess the delimiter: tabs beat commas when the header has tabs. */
function sniffDelimiter(decoded: string): string {
  const head = decoded.slice(0, 8192)
  const tabs = head.split('\t').length
  const commas = head.split(',').length
  return tabs > commas ? '\t' : ','
}

/** Escape markdown table cells: pipes, newlines, leading/trailing space. */
function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  const text = String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '<br>')
  // Leading/trailing spaces must be inside the "cell" — pad with non-breaking.
  return text.replace(/^ /, '&nbsp;').replace(/ $/, '&nbsp;')
}

export const csvConverter: Converter = async (_filePath, data): Promise<ConvertResult> => {
  const decoded = new TextDecoder('utf-8', { fatal: false }).decode(data)
  const delimiter = sniffDelimiter(decoded)

  const { data: rows, errors } = Papa.parse<readonly unknown[]>(decoded, {
    delimiter,
    skipEmptyLines: 'greedy',
  })

  if (errors.length > 0 && rows.length === 0) {
    throw new Error(`CSV 解析失败：${errors[0]?.message ?? '未知错误'}`)
  }

  const matrix: unknown[][] = rows.map((row) =>
    Array.isArray(row) ? row : []
  )
  if (matrix.length === 0) {
    return { success: true, format: 'csv', markdown: '', warnings: ['CSV 内容为空'] }
  }

  const header = matrix[0]!.map((cell, i) => escapeCell(cell) || `Col ${i + 1}`)
  const body = matrix.slice(1)

  let width = header.length
  for (const row of body) {
    if (row.length > width) width = row.length
  }
  const pad = (r: unknown[], i: number) => escapeCell(r[i] ?? '')

  const headerRow = `| ${Array.from({ length: width }, (_, i) => header[i] ?? `Col ${i + 1}`).join(' | ')} |`
  const sepRow = `| ${Array.from({ length: width }, () => '---').join(' | ')} |`
  const bodyRows = body.map((r) => `| ${Array.from({ length: width }, (_, i) => pad(r, i)).join(' | ')} |`)

  const rowsMd = [headerRow, sepRow, ...bodyRows].join('\n')
  const warnings: string[] = []

  return {
    success: true,
    format: 'csv',
    markdown: rowsMd,
    warnings,
    metadata: { wordCount: matrix.length },
  }
}