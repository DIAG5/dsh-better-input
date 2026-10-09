import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots';
import type { ConversionStore } from './conversion-store.js';
/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>;
/**
 * The file-conversion toggle in the `conversation.input.right` tool row.
 * Clicking expands/collapses the conversion dock with a non-linear transition.
 * Styled to the composer's round "selector" button convention (28px circle).
 */
export declare function ConverterToggleButton({ store, t }: {
    store: ConversionStore;
    t: Translate;
}): import("react").JSX.Element;
export {};
