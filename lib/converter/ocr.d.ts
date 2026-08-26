/** One rasterized image ready for a vision model. */
export interface OcrImage {
    /** Stable, human-meaningful label (page number / original media name). */
    name: string;
    /** PNG/JPEG bytes embedded in the source file. */
    data: Uint8Array;
    /** Media type of `data`; must be one of the attachment store's accepted types. */
    mediaType: 'image/png' | 'image/jpeg' | 'image/webp';
}
/**
 * Render every page of a PDF to a PNG byte array, in page order. Each page is
 * rasterized at the view port's natural resolution (a 1x scale relative to
 * the PDF's intrinsic size), which is the attachment store's expected
 * admission format.
 */
export declare function renderPdfPages(data: Uint8Array): Promise<OcrImage[]>;
/**
 * Extract the embedded raster images from a .pptx (a ZIP of XML parts). The
 * slide images live under `ppt/media/` as PNG/JPEG/WebP; we return them for a
 * vision model to read. Vector shapes / charts without a raster are not
 * included — matching the PPTX text-layer converter's "no layout" caveat.
 */
export declare function extractPptxImages(data: Uint8Array): Promise<OcrImage[]>;
