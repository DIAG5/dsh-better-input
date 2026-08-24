/**
 * Shared types for the file-conversion chip pipeline.
 *
 * A "conversion" is one file the user converted on the Host. Its Markdown is
 * held in a client-side store and exposed to the composer as an inline
 * reference chip (`@<label>`); on submit, DSH serializes the chip back to the
 * stored Markdown via the registered input-trigger source's codec.
 */
/**
 * One document awaiting send. `ref` is the owner-scoped reference id carried on
 * the composer chip; `markdown` holds the text that will be injected into the
 * message on send. `sendable` is false until the item is directly sendable:
 * pure-text files are always sendable as-is; binary documents become sendable
 * only after conversion (or via "选择文件" passthrough).
 */
export interface ConversionItem {
    /** Reference id stored on the chip (stable, unique). */
    ref: string;
    /** Chip display label, e.g. `report.pdf`. */
    name: string;
    /** The text content; user-editable before send. */
    markdown: string;
    /** Display format label (e.g. 'PDF', 'text'). */
    format: string;
    /** Whether this item can be inserted and sent as-is (true for ready items). */
    sendable: boolean;
}
