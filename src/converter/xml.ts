import { XMLParser } from 'fast-xml-parser'
import type { Converter, ConvertResult } from './types.js'

/**
 * Convert an XML file to structured Markdown.
 *
 * Any XML document is parsed into a generic object tree and rendered with:
 * attributes folded into a JSON block, a single dominant repeated element
 * treated as a table when it holds flat records, and everything else rendered
 * as nested bullets with mixed-content text preserved. This is intentionally
 * schema-agnostic — the shape of the output follows the document itself.
 */

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  processEntities: true,
  isArray: () => false,
})

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')
}

/** Detect a repeated element key whose values are all plain flat records. */
function dominantRecordKey(node: unknown): string | null {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) return null
  const record = node as Record<string, unknown>
  // Everything is a repeated element when the parser merged one key.
  for (const [key, value] of Object.entries(record)) {
    if (!Array.isArray(value)) continue
    const flat = value.filter((item) => item !== null && typeof item === 'object' && !Array.isArray(item))
    if (flat.length === value.length && flat.length > 0) {
      const scalar = flat.every((item) => Object.keys(item as object).every((k) => !k.startsWith('@_')))
      if (scalar) return key
    }
  }
  return null
}

function renderValue(node: unknown, depth: number): string {
  if (node === null || node === undefined) return ''
  if (typeof node === 'string') return node.trim()
  if (Array.isArray(node)) {
    return node.map((item) => renderValue(item, depth)).filter((s) => s !== '').join('\n')
  }
  const record = node as Record<string, unknown>

  // Attributes collected into a JSON block.
  const attrs = Object.entries(record).filter(([k]) => k.startsWith('@_'))
  const attrBlock = attrs.length > 0
    ? `\n\`\`\`json\n${JSON.stringify(Object.fromEntries(attrs.map(([k, v]) => [k.slice(2), v])), null, 2)}\n\`\`\`\n`
    : ''

  // A big array of flat records -> markdown table.
  const tableKey = dominantRecordKey(node)
  if (tableKey && Array.isArray(record[tableKey])) {
    const rows = record[tableKey] as Record<string, unknown>[]
    const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r).filter((k) => !k.startsWith('@_')))))
    if (headers.length > 0) {
      const headerRow = `| ${headers.map((h) => escapeCell(h)).join(' | ')} |`
      const sepRow = `| ${headers.map(() => '---').join(' | ')} |`
      const body = rows.map((r) => `| ${headers.map((h) => escapeCell(r[h])).join(' | ')} |`)
      const table = [headerRow, sepRow, ...body].join('\n')
      const rest = Object.entries(record)
        .filter(([k]) => k !== tableKey)
        .map(([k, v]) => k.startsWith('@_') ? '' : `\n### ${k}\n\n${renderValue(v, depth + 1)}`)
        .filter((s) => s !== '')
        .join('\n')
      return `${attrBlock}${table}${rest}`
    }
  }

  // General object -> nested bullets.
  const parts = Object.entries(record)
    .map(([key, value]) => {
      if (key.startsWith('@_')) return ''
      if (typeof value === 'object' && value !== null) {
        return `\n**${key}**\n\n${indent(renderValue(value, depth + 1), depth)}`
      }
      return `- **${key}**: ${String(value)}`
    })
    .filter((s) => s !== '')
  return `${attrBlock}${parts.join('\n')}`
}

function indent(text: string, depth: number): string {
  if (depth === 0) return text
  const prefix = '  '.repeat(depth)
  return text.split('\n').map((l) => `${prefix}${l}`).join('\n')
}

export const xmlConverter: Converter = async (_filePath, data): Promise<ConvertResult> => {
  const decoded = new TextDecoder('utf-8', { fatal: false }).decode(data)
  const root = xmlParser.parse(decoded)

  const markdown = renderValue(root, 0).trim()

  const warnings: string[] = []

  return { success: true, format: 'xml', markdown, warnings }
}