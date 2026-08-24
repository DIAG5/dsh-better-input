import type { ConversionItem } from './conversion-types.js';
import { ConversionStore } from './conversion-store.js';
/**
 * The shape of an InputTriggerController controller's `toggleSource`, plus the
 * composer shell we read `draftRev` from — both are reachable through the
 * conversation `input` hub at runtime (which the public `IConversation` type
 * declares only narrowly as `SessionInputResolver`).
 */
interface InputTriggerControllerLike {
    toggleSource(source: string, hit: {
        trigger: '@';
        query: string;
        quoted: boolean;
        position: 'inline';
        span: {
            start: number;
            end: number;
            draftRev: number;
        };
    }): void;
}
interface InputShellLike {
    readonly snapshot: {
        readonly draftRev: number;
    };
}
/**
 * The runtime slice of the conversation input hub we depend on:
 * `inputTriggers(sessionId)` resolves the session's input-trigger controller
 * and `shell(sessionId)` reads its draft revision for the CAS span.
 */
export interface ConversationInputHubHandle {
    inputTriggers(sessionId: string): InputTriggerControllerLike | undefined;
    shell(sessionId: string): InputShellLike;
}
/**
 * Bridges the file-conversion dock to the composer's chip pipeline.
 *
 * `ctx.conversation.input` is the conversation input hub. At runtime it exposes
 * `inputTriggers(sessionId)` (a session-scoped controller launcher) and
 * `shell(sessionId)` (the composer shell whose snapshot carries the draft
 * revision for a correct CAS span) — mirroring how dsh itself launches the
 * command menu from composer chrome.
 */
export declare class ConversionController {
    /** The shared result store (one per plugin instance). */
    readonly store: ConversionStore;
    private readonly hub;
    constructor(store: ConversionStore, hub: ConversationInputHubHandle);
    /** Store a converted document and open the single-source picker menu so the
     *  user confirms inserting it as an inline chip. */
    insertConversion(sessionId: string, item: ConversionItem): void;
    /** Remove a conversion by ref (discarded / no longer needed). */
    removeConversion(ref: string): void;
    /** Replace the stored Markdown of one conversion (edit-in-place). */
    editConversion(ref: string, markdown: string): boolean;
}
export {};
