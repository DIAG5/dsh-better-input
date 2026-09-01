/**
 * Client-side store for the prompt template library. Mirrors the settings
 * controller: an external-store class consumed via useSyncExternalStore,
 * one sticky initial fetch (also kicked off by the `/` trigger warm hook),
 * and optimistic list updates after save/remove so the menu and the settings
 * section stay in sync without refetching.
 */
import type { TemplateWire } from '../remote-contract.js';
import type { BetterInputRemote } from '../remote.js';
export type TemplatesSnapshot = {
    readonly status: 'loading' | 'ready' | 'error';
    readonly templates: readonly TemplateWire[];
    readonly detail: string;
};
/** Form state: tags stay a raw comma-separated string until save. */
export type TemplateDraft = {
    readonly id?: string;
    readonly name: string;
    readonly description: string;
    readonly tags: string;
    readonly content: string;
};
type Listener = () => void;
export declare class TemplatesController {
    private readonly remote;
    private snapshot;
    private readonly listeners;
    private disposed;
    private loadPromise;
    constructor(remote: BetterInputRemote);
    readonly getSnapshot: () => TemplatesSnapshot;
    readonly subscribe: (listener: Listener) => (() => void);
    readonly byId: (id: string) => TemplateWire | undefined;
    /** Kick off the one-time initial fetch; safe to call repeatedly. */
    readonly ensureLoaded: () => void;
    refresh(): Promise<void>;
    /** Create or update one template; resolves false when the call failed. */
    save(draft: TemplateDraft): Promise<boolean>;
    /** Remove one template; resolves false when the call failed. */
    remove(id: string): Promise<boolean>;
    dispose(): void;
    private emit;
}
export declare function useTemplatesSnapshot(controller: TemplatesController): TemplatesSnapshot;
export {};
