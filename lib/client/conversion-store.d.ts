import type { ConversionItem } from './conversion-types.js';
type Listener = () => void;
/**
 * Client-side store of converted documents waiting to be sent.
 *
 * Keyed by the reference id carried on each composer chip. Conversion results
 * are registered here after a successful convert; the input-trigger source
 * reads a conversion's Markdown by ref when DSH serializes the chip on submit.
 * Kept intentionally tiny — one mutable Map plus a subscribe-notify surface so
 * the dock can re-render on edits.
 */
export declare class ConversionStore {
    private readonly items;
    private readonly listeners;
    private expanded;
    /** Register or replace one conversion. */
    set(item: ConversionItem): void;
    /** Read one conversion by reference id. */
    get(ref: string): ConversionItem | undefined;
    /** All conversions, in registration order. */
    values(): readonly ConversionItem[];
    /** Remove one conversion (e.g. when its chip is removed or adopted). */
    delete(ref: string): void;
    /** Replace the Markdown of one conversion in place. */
    updateMarkdown(ref: string, markdown: string): boolean;
    /** Subscribe to mutations; returns an unsubscribe. */
    subscribe(listener: Listener): () => void;
    /** Exchange the current expanded flag for the next and notify (toggle helper). */
    setExpanded(value: boolean): void;
    /** Whether the conversion panel is currently expanded. */
    isExpanded(): boolean;
    private notify;
}
export {};
