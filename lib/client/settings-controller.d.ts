import { type BetterInputSettingsPatch, type BetterInputSettingsView, type PolishRoute, type ReasoningEffortInfo } from '../config.js';
import type { AboutInfoWire, UpdateCheckResultWire } from '../remote-contract.js';
import type { BetterInputRemote } from '../remote.js';
export type SettingsStatus = 'loading' | 'ready' | 'error';
export type SettingsSnapshot = {
    readonly status: SettingsStatus;
    readonly view: BetterInputSettingsView;
    readonly detail: string;
};
export type RoutesSnapshot = {
    readonly status: 'loading' | 'ready' | 'error';
    readonly routes: readonly PolishRoute[];
    readonly detail: string;
};
/** Keyed by `${provider}\u0000${model}` — undefined effort = loading requested,
 *  null effort = load failed, object = resolved efforts. */
export type EffortsSnapshot = Readonly<Record<string, EffortsEntry>>;
export type EffortsEntry = {
    readonly status: 'loading' | 'ready' | 'error';
    readonly efforts: readonly ReasoningEffortInfo[];
    readonly defaultEffort?: string;
    readonly detail: string;
};
export type AboutSnapshot = {
    readonly status: 'loading' | 'ready' | 'error';
    readonly about: AboutInfoWire;
    readonly detail: string;
};
export type UpdateSnapshot = {
    readonly status: 'idle' | 'loading' | 'ready' | 'error';
    readonly update: UpdateCheckResultWire | null;
    readonly detail: string;
};
type Listener = () => void;
/**
 * Settings read/write controller for the settings page and the microphone
 * flow. Owns the remote calls and a simple external store so both the page
 * and the voice button observe the same values. Also caches per-model
 * reasoning-effort metadata loaded lazily through resolveModelEfforts so
 * opening the effort dropdown never double-fetches across renders.
 */
export declare class SettingsController {
    private readonly remote;
    private settingsSnapshot;
    private routesSnapshot;
    private effortsSnapshot;
    private aboutSnapshot;
    private updateSnapshot;
    private readonly listeners;
    private disposed;
    constructor(remote: BetterInputRemote);
    readonly getSettingsSnapshot: () => SettingsSnapshot;
    readonly getRoutesSnapshot: () => RoutesSnapshot;
    readonly getEffortsSnapshot: () => EffortsSnapshot;
    readonly getAboutSnapshot: () => AboutSnapshot;
    readonly getUpdateSnapshot: () => UpdateSnapshot;
    readonly subscribe: (listener: Listener) => (() => void);
    refreshSettings(): Promise<void>;
    refreshRoutes(): Promise<void>;
    private readonly autoPopulateDefaultRoutesIfNeeded;
    update(patch: BetterInputSettingsPatch): Promise<boolean>;
    /**
     * Lazily fetch reasoning efforts for a route. Results are cached in the
     * controller so changing the effort dropdown back and forth doesn't
     * re-trigger remote calls. Returns a snapshot entry immediately — the
     * caller subscribes via `useEffortsSnapshot` to re-render when the data
     * lands.
     */
    ensureEffortsFor(provider: string, model: string): Promise<void>;
    /**
     * Resolve the settings patch for switching one route.
     *
     * A route is a provider + model pair, and the two are always written
     * together so the selected model can never outlive its provider. The
     * reasoning effort, however, is an independent setting: it names a tier of
     * the *previous* model. Carrying it across a route switch would send an
     * effort the new model does not advertise, and the Host rejects that with
     * `UNSUPPORTED_REASONING_EFFORT`.
     *
     * So the switch resolves the new route's effort tiers and drops the stored
     * effort when the new model does not offer it. An empty effort means "let
     * the Host pick the model's default", which every route accepts.
     *
     * `effortField` names the single setting that belongs to the route being
     * switched. The polish and optimize routes are independent, so switching
     * one must not disturb the other's effort.
     *
     * When the new route's metadata cannot be resolved the stored effort is
     * left alone: an unknown tier list is not evidence that the effort is
     * invalid, and clearing it would silently discard a valid preference.
     */
    buildRouteSwitchPatch(route: {
        provider: string;
        model: string;
    }, effortField: 'polishReasoningEffort' | 'optimizeReasoningEffort', storedEffort: string): Promise<{
        patch: BetterInputSettingsPatch;
        effortCleared: boolean;
    }>;
    refreshAbout(): Promise<void>;
    checkForUpdate(): Promise<void>;
    dispose(): void;
    private emit;
}
export declare function useSettingsSnapshot(controller: SettingsController): SettingsSnapshot;
export declare function useRoutesSnapshot(controller: SettingsController): RoutesSnapshot;
export declare function useEffortsSnapshot(controller: SettingsController): EffortsSnapshot;
export declare function useAboutSnapshot(controller: SettingsController): AboutSnapshot;
export declare function useUpdateSnapshot(controller: SettingsController): UpdateSnapshot;
export {};
