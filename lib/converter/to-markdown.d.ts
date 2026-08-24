import type { ConvertResult } from './types.js';
export type { ConvertibleFormat, ConvertResult } from './types.js';
/**
 * Convert a named, in-memory file to Markdown.
 *
 * This is the single public entry the Host service calls. It detects the
 * format, dispatches to the matching converter, and guarantees a well-shaped
 * {@link ConvertResult} — throwing only for genuinely unsupported input.
 *
 * @throws when the format is unsupported or detection fails.
 */
export declare function convertFile(filePath: string, data: Uint8Array): Promise<ConvertResult>;
/** Recurse for a nested zip conversion (delegated by zip.ts). */
export declare function convertBuffer(filePath: string, data: Uint8Array): Promise<ConvertResult>;
