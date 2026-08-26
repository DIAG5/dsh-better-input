import JSZip from 'jszip'
import { createCanvas, DOMMatrix, Path2D, ImageData } from '@napi-rs/canvas'

/**
 * OCR ingest layer — turning a binary document into the raster images a vision
 * model can read. This module is parsing-only and never talks to the LLM;
 * the caller (`BetterInputPolishService`) feeds each returned PNG to the
 * configured vision model.
 *
 * Two sources are supported:
 *   - PDF pages: every page is rendered to a PNG via pdfjs + @napi-rs/canvas.
 *   - PPTX embedded raster images: extracted from the ZIP's `ppt/media/*`.
 *
 * @napi-rs/canvas is a native (binary) dependency kept out of the browser
 * bundle — like the other converter libs, it is an external runtime import.
 *
 * pdfjs is loaded lazily (dynamic `import()`) rather than statically. Its
 * legacy Node build polyfills `DOMMatrix`/`Path2D`/`ImageData` at module-load
 * time by requiring the `node-canvas` package — which we do not ship. To make
 * that check pass without `node-canvas`, we first install the equivalents
 * exported by @napi-rs/canvas onto `globalThis`, and only then import pdfjs.
 * Because ESM `import` is hoisted, a static pdfjs import would run its
 * polyfill check *before* our assignment; a dynamic import does not.
 */

// Install the geometry/image globals pdfjs needs BEFORE any pdfjs module loads.
// All three are idempotent — we never clobber a pre-existing implementation.
;(globalThis as Record<string, unknown>).DOMMatrix ??= DOMMatrix
;(globalThis as Record<string, unknown>).Path2D ??= Path2D
;(globalThis as Record<string, unknown>).ImageData ??= ImageData

/** One rasterized image ready for a vision model. */
export interface OcrImage {
  /** Stable, human-meaningful label (page number / original media name). */
  name: string
  /** PNG/JPEG bytes embedded in the source file. */
  data: Uint8Array
  /** Media type of `data`; must be one of the attachment store's accepted types. */
  mediaType: 'image/png' | 'image/jpeg' | 'image/webp'
}

/**
 * Render every page of a PDF to a PNG byte array, in page order. Each page is
 * rasterized at the view port's natural resolution (a 1x scale relative to
 * the PDF's intrinsic size), which is the attachment store's expected
 * admission format.
 */
export async function renderPdfPages(data: Uint8Array): Promise<OcrImage[]> {
  // Lazy-load pdfjs only after the DOMMatrix/Path2D/ImageData globals above
  // have been installed, so its module-load polyfill check never hits the
  // missing `node-canvas` package.
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.js')

  const canvasFactory = {
    create: (width: number, height: number) => {
      const canvas = createCanvas(Math.max(1, Math.ceil(width)), Math.max(1, Math.ceil(height)))
      return {
        canvas,
        // pdfjs writes through this context; napi-rs exposes the standard 2d API.
        context: canvas.getContext('2d') as unknown as CanvasRenderingContext2D,
      }
    },
    reset: (_canvas: unknown, _width: number, _height: number) => undefined,
    destroy: (_canvas: unknown) => undefined,
  }

  const task = getDocument({
    data: new Uint8Array(data),
    isEvalSupported: false,
    useSystemFonts: true,
    canvasFactory,
  })

  try {
    const pdf = await task.promise
    const images: OcrImage[] = []
    for (let n = 1; n <= pdf.numPages; n += 1) {
      const page = await pdf.getPage(n)
      const viewport = page.getViewport({ scale: 1 })
      // A fresh canvas per page keeps the raster independent of earlier pages.
      const width = Math.ceil(viewport.width)
      const height = Math.ceil(viewport.height)
      const canvas = createCanvas(Math.max(1, width), Math.max(1, height))
      const context = canvas.getContext('2d')
      await page.render({
        canvasContext: context as unknown as CanvasRenderingContext2D,
        viewport,
      }).promise
      const png = canvas.toBuffer('image/png')
      if (png.length > 0) {
        images.push({ name: `第 ${n} 页`, data: new Uint8Array(png), mediaType: 'image/png' })
      }
    }
    return images
  } finally {
    try {
      await task.destroy()
    } catch {
      // teardown best-effort
    }
  }
}

/**
 * Extract the embedded raster images from a .pptx (a ZIP of XML parts). The
 * slide images live under `ppt/media/` as PNG/JPEG/WebP; we return them for a
 * vision model to read. Vector shapes / charts without a raster are not
 * included — matching the PPTX text-layer converter's "no layout" caveat.
 */
export async function extractPptxImages(data: Uint8Array): Promise<OcrImage[]> {
  const zip = await JSZip.loadAsync(data)
  const names = Object.keys(zip.files)
    .filter((name) => /^ppt\/media\/.+/i.test(name) && !name.endsWith('/'))
    .sort()

  const images: OcrImage[] = []
  for (const name of names) {
    const mediaType = mediaTypeOf(name)
    if (mediaType === null) continue
    const file = zip.file(name)
    if (!file) continue
    const raw = await file.async('uint8array')
    if (raw.length === 0) continue
    images.push({ name, data: raw, mediaType })
  }
  return images
}

/** Map a media filename to an attachment-accepted media type, or null. */
function mediaTypeOf(name: string): OcrImage['mediaType'] | null {
  const dot = name.lastIndexOf('.')
  const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase() : ''
  switch (ext) {
    case 'png': return 'image/png'
    case 'jpg':
    case 'jpeg': return 'image/jpeg'
    case 'webp': return 'image/webp'
    default: return null
  }
}