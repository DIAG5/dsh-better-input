import mammoth from 'mammoth'
import TurndownService from 'turndown'
import type { Converter, ConvertResult } from './types.js'

/**
 * Convert a .docx file to Markdown.
 *
 * mammoth extracts HTML from the docx (it preserves headings, lists, bold,
 * italic, tables and hyperlinks); turndown then converts that HTML to Markdown.
 */

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
})

export const docxConverter: Converter = async (_filePath, data): Promise<ConvertResult> => {
  const { value: rawHtml } = await mammoth.convertToHtml({
    buffer: Buffer.from(data),
  })

  // Images inside a Word doc are inlined as base64 data URIs by mammoth and
  // would be dumped verbatim by turndown. Skip images entirely: the model gets
  // the document text, not binary blobs.
  const html = rawHtml.replace(/<img\b[^>]*>/gi, ' ')

  const markdown = turndown.turndown(html).trim()

  const warnings: string[] = []

  const wordCount = markdown.split(/\s+/).filter(Boolean).length
  return {
    success: true,
    format: 'docx',
    markdown,
    warnings,
    metadata: { wordCount },
  }
}