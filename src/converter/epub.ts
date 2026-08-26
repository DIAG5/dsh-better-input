import JSZip from 'jszip'
import TurndownService from 'turndown'
import type { Converter, ConvertResult } from './types.js'

/**
 * Convert an .epub to Markdown.
 *
 * An epub is a ZIP whose OCF container lists its spine (reading order of HTML
 * chapters) in `META-INF/container.xml` → rootfile → `content.opf`. We resolve
 * the spine order, read each chapter XHTML in that order, strip markup chrome,
 * and run turndown over every chapter. Output preserves chapters as `## Nh`
 * headings with front-matter metadata from the OPF if present.
 */

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
})

/** Resolve META-INF/container.xml to the OPF rootfile href. */
function resolveOpfPath(containerXml: string | undefined): string | null {
  if (!containerXml) return null
  const href = /rootfile[^>]*path\s*=\s*"([^"]+)"/i.exec(containerXml)
  return href ? href[1]! : null
}

/** Parse the OPF to an ordered spine of manifest hrefs. */
function resolveSpineHrefs(opfRaw: string): string[] {
  // Extract the manifest id → href map.
  const ids = new Map<string, string>()
  for (const match of opfRaw.matchAll(/<item\b[^>]*>/gi)) {
    const tag = match[0]
    const id = /(?:id|idref)\s*=\s*"([^"]+)"/i.exec(tag)?.[1]
    const href = /href\s*=\s*"([^"]+)"/i.exec(tag)?.[1]
    if (id && href) ids.set(id, href)
  }

  // Extract spine order.
  const hrefs: string[] = []
  for (const match of opfRaw.matchAll(/<(?:itemref|itemRef)\b[^>]*>/gi)) {
    const idref = /idref\s*=\s*"([^"]+)"/i.exec(match[0])?.[1]
    if (idref) {
      const href = ids.get(idref)
      if (href) hrefs.push(href)
    }
  }
  return hrefs
}

export const epubConverter: Converter = async (_filePath, data): Promise<ConvertResult> => {
  const zip = await JSZip.loadAsync(data)

  // Find the OPF root file via the container.
  const containerXml = await zip.file('META-INF/container.xml')?.async('string')
  const opfHref = resolveOpfPath(containerXml)
  if (!opfHref) throw new Error('EPUB 中未找到内容清单（.opf），可能不是有效的 epub')

  const opfRaw = await zip.file(opfHref)?.async('string')
  if (!opfRaw) throw new Error('EPUB 缺少根清单文件')

  // Resolve spine item order.
  const hrefs = resolveSpineHrefs(opfRaw)
  const baseDir = opfHref.includes('/') ? opfHref.slice(0, opfHref.lastIndexOf('/') + 1) : ''
  const chapters: string[] = []
  let chapterCount = 0

  for (const href of hrefs) {
    const full = `${baseDir}${href}`
    const file = zip.file(full) ?? (href.startsWith(baseDir) ? zip.file(href) : zip.file(href))
    if (!file) continue
    const raw = await file.async('string')
    const cleaned = raw
      .replace(/<\?xml[\s\S]*?\?>/i, '')
      .replace(/<!DOCTYPE[\s\S]*?>/i, '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<(img|video|audio|svg)\b[^>]*>/gi, ' ')
    const md = turndown.turndown(cleaned).trim()
    if (md === '') continue
    chapterCount += 1
    chapters.push(`## ${href}\n\n${md}`)
  }

  if (chapterCount === 0) throw new Error('EPUB 未解析出任何章节文本')

  const markdown = chapters.join('\n\n')
  const warnings: string[] = []

  return {
    success: true,
    format: 'epub',
    markdown,
    warnings,
    metadata: { fileCount: chapterCount },
  }
}