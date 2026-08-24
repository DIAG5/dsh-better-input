import type { ConvertibleFormat } from './types.js';
/**
 * Detect the conversion format for a named buffer. Returns the format, or
 * `null` when the file is not one we can convert.
 */
export declare function detectFormat(filePath: string, data: Uint8Array): ConvertibleFormat | null;
/** Whether a detected format is recognized as convertible by this plugin. */
export declare function isConvertible(format: unknown): format is ConvertibleFormat;
