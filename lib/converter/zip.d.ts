import type { Converter } from './types.js';
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
export declare const zipConverter: Converter;
