import TurndownService from 'turndown'
import type { Converter, ConvertResult } from './types.js'
import { MAX_CONVERTED_CHARACTERS } from './types.js'

/**
 * Convert an HTML file to Markdown with turndown.
 *
 * The source may be a full HTML document or a fragment; turndown handles both.
 * `<head>` content (scripts, styles) is stripped before conversion so only
 * visible body text reaches the output.
 */

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
})

export const htmlConverter: Converter = async (_filePath, data): Promise<ConvertResult> => {
  const raw = new TextDecoder('utf-8', { fatal: false }).decode(data)

  const cleaned = raw
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<(img|video|audio|svg)\b[^>]*>/gi, ' ')
    .replace(/<\/(head)>/gi, ' $1 ')

  const markdown = turndown.turndown(cleaned).trim()

  const warnings: string[] = []
  const capped = markdown.length > MAX_CONVERTED_CHARACTERS
  const output = capped
    ? `${markdown.slice(0, MAX_CONVERTED_CHARACTERS)}\n\n<!-- truncated: output exceeds ${MAX_CONVERTED_CHARACTERS} characters -->`
    : markdown
  if (capped) warnings.push('HTML 过大，已截断输出')

  return {
    success: true,
    format: 'html',
    markdown: output,
    warnings,
    metadata: { wordCount: output.split(/\s+/).filter(Boolean).length },
  }
}