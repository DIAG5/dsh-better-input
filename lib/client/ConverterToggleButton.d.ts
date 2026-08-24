import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots';
import type { ConversionStore } from './conversion-store.js';
/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>;
/**
 * The small composer toolbar toggle for the file-conversion panel. Sits in the
 * `conversation.input.right` tool row (mirroring the prompt-optimize sparkle);
 * clicking expands/collapses the conversion dock with a non-linear transition.
 */
export declare function ConverterToggleButton({ store, t }: {
    store: ConversionStore;
    t: Translate;
}): import("react").JSX.Element;
export {};
