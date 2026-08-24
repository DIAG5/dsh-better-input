import type { InputTriggerSource } from '@deepseek-ai/dsh-client-ui-input-trigger/client';
import type { ConversionStore } from './conversion-store.js';
/** Unique source name on the `@` trigger (the menu group title). */
export declare const CONVERSION_SOURCE_NAME = "better-input-conversion";
/**
 * The input-trigger source that exposes picked documents as inline
 * `@<label>` reference chips.
 *
 * - `candidates()` lists every file the dock has added, marking whether it is
 *   ready to send as-is (pure text) or needs conversion first.
 * - `onPick()` returns a {@link ReferenceInsert} only for sendable items;
 *   non-sendable documents (unconverted binary) are a no-op so nothing is
 *   inserted.
 * - `lexicon()` feeds the chip decorator with only the sendable names.
 * - `codec.serialize(ref)` returns the (possibly user-edited) text that is
 *   injected into the message on send; it never serializes an unusable item.
 *
 * The source is context-free — it only reads the store — and is registered
 * once on the client root context.
 */
export declare function createConversionSource(store: ConversionStore): InputTriggerSource;
