import TurndownService from 'turndown'
import type { Converter, ConvertResult } from './types.js'

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
    .replace(/<\/head>/gi, ' ')

  const markdown = turndown.turndown(cleaned).trim()

  const warnings: string[] = []

  return {
    success: true,
    format: 'html',
    markdown,
    warnings,
    metadata: { wordCount: markdown.split(/\s+/).filter(Boolean).length },
  }
}