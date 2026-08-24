import * as XLSX from 'xlsx'
import type { Converter, ConvertResult } from './types.js'
import { MAX_CONVERTED_CHARACTERS } from './types.js'

/**
 * Convert an Excel workbook (.xlsx / .xls) to Markdown.
 *
 * SheetJS reads the workbook; every non-empty sheet becomes a Markdown table
 * headed by the sheet name. `sheet_to_json` uses the first row as headers,
 * which is the natural table projection for spreadsheets.
 */

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')
}

export const xlsxConverter: Converter = async (filePath, data): Promise<ConvertResult> => {
  const isXls = /\.xls$/i.test(filePath)
  const workbook = XLSX.read(data, { type: 'buffer', cellDates: false })

  const parts: string[] = []
  let sheetCount = 0

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]!
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: '',
      blankrows: false,
    })
    if (!Array.isArray(json)) continue

    sheetCount += 1
    const title = parts.length > 0 ? `\n## ${sheetName}\n` : `# ${sheetName}\n`
    if (json.length === 0) {
      // Empty sheet: emit just its heading.
      parts.push(title)
      continue
    }

    const headers = Object.keys(json[0]!)
    const headerRow = `| ${headers.map(escapeCell).join(' | ')} |`
    const sepRow = `| ${headers.map(() => '---').join(' | ')} |`
    const bodyRows = json
      .slice(0, 5000)
      .map((row) => `| ${headers.map((h) => escapeCell(row[h])).join(' | ')} |`)

    const rowsMd = [title, headerRow, sepRow, ...bodyRows].join('\n')
    parts.push(rowsMd)
  }

  const markdown = parts.join('\n').trim()

  const warnings: string[] = []
  const capped = markdown.length > MAX_CONVERTED_CHARACTERS
  const output = capped
    ? `${markdown.slice(0, MAX_CONVERTED_CHARACTERS)}\n\n<!-- truncated: output exceeds ${MAX_CONVERTED_CHARACTERS} characters -->`
    : markdown
  if (capped) warnings.push('表格过大，已截断输出')

  return {
    success: true,
    format: isXls ? 'xls' : 'xlsx',
    markdown: output,
    warnings,
    metadata: { sheetCount },
  }
}