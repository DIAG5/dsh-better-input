import type { Converter, ConvertResult } from './types.js'

/**
 * Convert a PDF to Markdown with pdfjs-dist.
 *
 * pdfjs extracts the text layer directly from the PDF's embedded fonts. Scanned
 * PDFs have no text layer, so they produce empty pages — we detect that and warn
 * (no OCR in Phase 1). Each page is emitted under an `### 第 N 页` heading.
 */

export const pdfConverter: Converter = async (_filePath, data): Promise<ConvertResult> => {
  // Dynamic import: pdfjs-dist/legacy is CommonJS and cannot be named-imported
  // from ESM under Node.js (Named export 'getDocument' not found). Matches the
  // pattern already used in ocr.ts.
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.js')
  const task = getDocument({
    data: new Uint8Array(data),
    isEvalSupported: false,
    useSystemFonts: true,
  })

  try {
    const pdf = await task.promise
    const pages: string[] = []
    let emptyPageCount = 0

    for (let n = 1; n <= pdf.numPages; n += 1) {
      const page = await pdf.getPage(n)
      const content = await page.getTextContent()
      const text = layoutText(content.items as Array<{ str?: string }>)
      if (text.trim() === '') {
        emptyPageCount += 1
        continue
      }
      pages.push(`### 第 ${n} 页\n\n${text.trim()}`)
    }

    const warnings: string[] = []
    if (emptyPageCount > 0) {
      warnings.push(`检测到 ${emptyPageCount} 页无文字层，可能为扫描件，未做 OCR`)
    }

    return {
      success: true,
      format: 'pdf',
      markdown: pages.join('\n').trim(),
      warnings,
      metadata: { pageCount: pdf.numPages },
    }
  } finally {
    try {
      await task.destroy()
    } catch {
      // ignore teardown errors
    }
  }
}

/**
 * Reconstruct text from pdfjs text items. Only text items carry a `str` —
 * marked-content entries are structure markers and are filtered out. Source
 * order is preserved; we join the text and normalize whitespace. Line
 * detection would need item coordinates, so for Phase 1 each page is a single
 * flowing paragraph.
 */
function layoutText(items: ReadonlyArray<{ str?: string }>): string {
  return items
    .map((item) => item.str ?? '')
    .filter((str) => str.trim() !== '')
    .join(' ')
    .replace(/\u00ad/g, '') // soft hyphen
    .replace(/\s+/g, ' ')
    .trim()
}