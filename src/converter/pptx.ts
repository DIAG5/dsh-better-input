import JSZip from 'jszip'
import { XMLParser } from 'fast-xml-parser'
import type { Converter, ConvertResult } from './types.js'
import { MAX_CONVERTED_CHARACTERS } from './types.js'

/**
 * Convert a .pptx to Markdown.
 *
 * A pptx is a ZIP of XML. We read the slide parts (`ppt/slides/slideN.xml`),
 * walk the tree to collect every `<a:t>` text run, then group runs into
 * paragraphs (runs separated by blank `<a:p>` or empty text become newlines).
 * Each slide is emitted as an `## 第 N 页` heading. Visual positioning, charts
 * and images are not preserved.
 */

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: () => false,
})

/**
 * Walk any parsed XML value and collect every string leaf. fast-xml-parser
 * emits element text content as plain string values inside the object tree, so
 * a schema-agnostic depth-first walk (keys starting with `@_` are attributes
 * and are skipped) collects all `<a:t>` text without caring about nesting.
 */
function collectTexts(node: unknown, out: string[]): void {
  if (node === null || node === undefined || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) collectTexts(item, out)
    return
  }
  const record = node as Record<string, unknown>
  for (const key of Object.keys(record)) {
    if (key.startsWith('@_')) continue // attribute, not text content
    const value = record[key]
    if (typeof value === 'string') {
      out.push(value)
    } else if (value && typeof value === 'object') {
      collectTexts(value, out)
    }
  }
}

/** Turn a flat list of text runs into paragraph lines (empty string = break). */
function groupParagraphs(texts: readonly string[]): string[] {
  const paragraphs: string[] = []
  let buffer = ''
  for (const raw of texts) {
    const trimmed = (raw ?? '').trim()
    if (trimmed === '') {
      if (buffer !== '') {
        paragraphs.push(buffer)
        buffer = ''
      }
      continue
    }
    buffer = buffer === '' ? trimmed : `${buffer} ${trimmed}`
  }
  if (buffer !== '') paragraphs.push(buffer)
  return paragraphs
}

export const pptxConverter: Converter = async (_filePath, data): Promise<ConvertResult> => {
  const zip = await JSZip.loadAsync(data)
  const slideNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
    .sort((a, b) => {
      const na = Number(/slide(\d+)/i.exec(a)?.[1] ?? 0)
      const nb = Number(/slide(\d+)/i.exec(b)?.[1] ?? 0)
      return na - nb
    })

  if (slideNames.length === 0) {
    throw new Error('PPTX 中未找到幻灯片（可能不是有效的 .pptx）')
  }

  const slides: string[] = []
  for (let i = 0; i < slideNames.length; i += 1) {
    const raw = await zip.file(slideNames[i]!)!.async('string')
    const parsed = xmlParser.parse(raw)
    const texts: string[] = []
    collectTexts(parsed, texts)
    const body = groupParagraphs(texts).join('\n\n')
    slides.push(`## 第 ${i + 1} 页\n\n${body}`)
  }

  const markdown = slides.join('\n\n').trim()

  const warnings: string[] = []
  const capped = markdown.length > MAX_CONVERTED_CHARACTERS
  const output = capped
    ? `${markdown.slice(0, MAX_CONVERTED_CHARACTERS)}\n\n<!-- truncated: output exceeds ${MAX_CONVERTED_CHARACTERS} characters -->`
    : markdown
  if (capped) warnings.push('PPT 过大，已截断输出')
  warnings.push('PPT 仅提取文字内容，不保留排版/图表/图片')

  return {
    success: true,
    format: 'pptx',
    markdown: output,
    warnings,
    metadata: { slideCount: slideNames.length },
  }
}