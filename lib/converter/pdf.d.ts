import type { Converter } from './types.js';
/**
 * Convert a PDF to Markdown with pdfjs-dist.
 *
 * pdfjs extracts the text layer directly from the PDF's embedded fonts. Scanned
 * PDFs have no text layer, so they produce empty pages — we detect that and warn
 * (no OCR in Phase 1). Each page is emitted under an `### 第 N 页` heading.
 */
export declare const pdfConverter: Converter;
