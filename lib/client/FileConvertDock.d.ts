import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots';
import type { BetterInputRemote } from '../remote.js';
import type { ConversionController } from './conversion-controller.js';
/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>;
/**
 * Props handed to the file-conversion dock entry. `controller` drives the
 * conversion→chip pipeline for the current session; `remote` runs the Host
 * conversion.
 */
export type FileConvertDockProps = {
    readonly sessionId: string;
    readonly remote: BetterInputRemote;
    readonly controller: ConversionController;
    readonly t: Translate;
};
/**
 * The file-conversion dock above the composer. Users add local files as chips;
 * "开始转换" runs the Host converter and, on success, asks the controller to
 * open the picker so the document is inserted as an inline `@<label>` chip.
 * Each inserted conversion also keeps an "编辑" entry here so the Markdown can
 * be revised before sending.
 */
export declare function FileConvertDock({ sessionId, remote, controller, t }: FileConvertDockProps): import("react").JSX.Element;
export {};
