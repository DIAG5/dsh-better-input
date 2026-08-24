import type { Converter, ConvertResult } from './types.js'
import { MAX_CONVERTED_CHARACTERS } from './types.js'

/**
 * Convert a JSON file to structured Markdown.
 *
 * - An array of objects/arrays becomes a Markdown table (first key set = headers).
 * - A plain object becomes a key/value list.
 * - Nested objects/arrays render as fenced JSON blocks to keep the structure
 *   readable without inventing a schema.
 */

function isNonEmptyArray(value: unknown): value is readonly unknown[] {
  return Array.isArray(value) && value.length > 0
}

function escapeCell(value: unknown): string {
  if (typeof value === 'string') return value.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return '```json\n' + JSON.stringify(value) + '\n```'
  return String(value)
}

/** Convert a JSON array of uniform records into a Markdown table. */
function tableFromRows(rows: readonly Record<string, unknown>[]): string {
  const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))))
  const headerRow = `| ${headers.map((h) => escapeCell(h)).join(' | ')} |`
  const sepRow = `| ${headers.map(() => '---').join(' | ')} |`
  const body = rows.map((r) => `| ${headers.map((h) => escapeCell(r[h])).join(' | ')} |`)
  return [headerRow, sepRow, ...body].join('\n')
}

function convertValue(value: unknown, indentTitle: string): string {
  if (isNonEmptyArray(value)) {
    if (value.every((v) => typeof v === 'object' && v !== null && !Array.isArray(v))) {
      return tableFromRows(value as unknown as Record<string, unknown>[])
    }
    return value.map((item, i) => {
      const sub = convertValue(item, `${indentTitle}[${i}]`)
      return sub
    }).filter((s) => s !== '').join('\n\n')
  }
  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>
    const parts = Object.entries(record).map(([key, sub]) => {
      if (typeof sub === 'string' && sub.length < 200 && !sub.includes('\n')) {
        return `- **${key}**: ${sub}`
      }
      if (Array.isArray(sub) || (typeof sub === 'object' && sub !== null)) {
        return `\n### ${key}\n\n${convertValue(sub, `${indentTitle}.${key}`)}`
      }
      return `- **${key}**: ${String(sub)}`
    })
    return parts.join('\n')
  }
  return String(value)
}

export const jsonConverter: Converter = async (_filePath, data): Promise<ConvertResult> => {
  const decoded = new TextDecoder('utf-8', { fatal: false }).decode(data)
  let parsed: unknown
  try {
    parsed = JSON.parse(decoded)
  } catch (error) {
    throw new Error(`JSON 解析失败：${error instanceof Error ? error.message : String(error)}`)
  }

  const markdown = convertValue(parsed, '$').trim()

  const warnings: string[] = []
  const capped = markdown.length > MAX_CONVERTED_CHARACTERS
  const output = capped
    ? `${markdown.slice(0, MAX_CONVERTED_CHARACTERS)}\n\n<!-- truncated: output exceeds ${MAX_CONVERTED_CHARACTERS} characters -->`
    : markdown
  if (capped) warnings.push('JSON 过大，已截断输出')

  return { success: true, format: 'json', markdown: output, warnings }
}