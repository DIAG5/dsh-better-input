import { type BetterInputSettingsPatch, type BetterInputSettingsView, type PolishRoute } from '../config.js';
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
type Listener = () => void;
/**
 * Settings read/write controller for the settings page and the microphone
 * flow. Owns the remote calls and a simple external store so both the page
 * and the voice button observe the same values.
 */
export declare class SettingsController {
    private readonly remote;
    private settingsSnapshot;
    private routesSnapshot;
    private readonly listeners;
    private disposed;
    constructor(remote: BetterInputRemote);
    readonly getSettingsSnapshot: () => SettingsSnapshot;
    readonly getRoutesSnapshot: () => RoutesSnapshot;
    readonly subscribe: (listener: Listener) => (() => void);
    refreshSettings(): Promise<void>;
    refreshRoutes(): Promise<void>;
    update(patch: BetterInputSettingsPatch): Promise<boolean>;
    dispose(): void;
    private emit;
}
export declare function useSettingsSnapshot(controller: SettingsController): SettingsSnapshot;
export declare function useRoutesSnapshot(controller: SettingsController): RoutesSnapshot;
export {};
