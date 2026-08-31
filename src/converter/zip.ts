import JSZip from 'jszip'
import type { Converter, ConvertResult } from './types.js'
import { detectFormat, isConvertible } from './detect.js'

/**
 * Convert a .zip archive to Markdown.
 *
 * Every entry whose name maps to a convertible format is converted in archive
 * order and concatenated under a per-entry heading. Nested .zip entries are
 * flattened to a single readable document. Binary entries (images etc.) with
 * no converter are skipped with a note.
 *
 * The nested-conversion entry is a lazy dynamic import of `to-markdown.js` to
 * avoid a module-level cycle (that module registers `zipConverter` itself).
 */

export const zipConverter: Converter = async (_filePath, data): Promise<ConvertResult> => {
  const zip = await JSZip.loadAsync(data)
  const parts: string[] = []
  const warnings: string[] = []
  let fileCount = 0
  let skipped = 0

  const { convertFile } = await import('./to-markdown.js')

  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue
    // Skip Mac resource forks and other meta entries.
    if (entry.name.startsWith('__MACOSX/')) continue

    const format = detectFormat(entry.name, new Uint8Array(0))
    if (!isConvertible(format)) {
      skipped += 1
      continue
    }

    const content = await entry.async('uint8array')
    const result = await convertFile(entry.name, content)
    if (result.success) {
      parts.push(`## ${entry.name}\n\n${result.markdown}`)
      fileCount += 1
      warnings.push(...result.warnings)
    } else {
      warnings.push(`无法转换 ${entry.name}：${result.warnings.join(' ')}`)
    }
  }

  if (fileCount === 0 && parts.length === 0) {
    throw new Error('ZIP 内没有可转换的文件类型')
  }

  if (skipped > 0) {
    warnings.push(`跳过了 ${skipped} 个不支持的文件（如图片/音频）`)
  }

  return {
    success: true,
    format: 'zip',
    markdown: parts.join('\n\n'),
    warnings,
    metadata: { fileCount },
  }
}