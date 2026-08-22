import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol';
import type { ClientRemote } from '@deepseek-ai/dsh-api-remotes/client';
import type { AboutInfoWire, BetterInputSettingsPatch, BetterInputSettingsView, PolishRoute, ReasoningEffortInfo, UpdateCheckResultWire } from './remote-contract.js';
export type BetterInputRemote = ClientRemote['betterInput'];
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface TypertRemoteNamespace$betterInput {
        getSettings: () => Promise<RemoteResult<BetterInputSettingsView>>;
        updateSettings: (patch: BetterInputSettingsPatch, signal?: AbortSignal) => Promise<RemoteResult<BetterInputSettingsView>>;
        listRoutes: () => Promise<RemoteResult<PolishRoute[]>>;
        resolveModelEfforts: (provider: string, model: string) => Promise<RemoteResult<{
            efforts: readonly ReasoningEffortInfo[];
            defaultEffort?: string;
        }>>;
        getAbout: () => Promise<RemoteResult<AboutInfoWire>>;
        checkForUpdate: (signal?: AbortSignal) => Promise<RemoteResult<UpdateCheckResultWire>>;
        polish: (transcript: string, provider: string, model: string, signal?: AbortSignal) => Promise<RemoteResult<string>>;
        optimize: (text: string, provider: string, model: string, signal?: AbortSignal) => Promise<RemoteResult<string>>;
    }
    interface TypertRemoteMap {
        'betterInput/getSettings': () => Promise<RemoteResult<BetterInputSettingsView>>;
        'betterInput/updateSettings': (patch: BetterInputSettingsPatch, signal?: AbortSignal) => Promise<RemoteResult<BetterInputSettingsView>>;
        'betterInput/listRoutes': () => Promise<RemoteResult<PolishRoute[]>>;
        'betterInput/resolveModelEfforts': (provider: string, model: string) => Promise<RemoteResult<{
            efforts: readonly ReasoningEffortInfo[];
            defaultEffort?: string;
        }>>;
        'betterInput/getAbout': () => Promise<RemoteResult<AboutInfoWire>>;
        'betterInput/checkForUpdate': (signal?: AbortSignal) => Promise<RemoteResult<UpdateCheckResultWire>>;
        'betterInput/polish': (transcript: string, provider: string, model: string, signal?: AbortSignal) => Promise<RemoteResult<string>>;
        'betterInput/optimize': (text: string, provider: string, model: string, signal?: AbortSignal) => Promise<RemoteResult<string>>;
    }
    interface TypertRemoteNamespaceMap {
        betterInput: TypertRemoteNamespace$betterInput;
    }
}
export declare const TYPERT_REMOTE: TypertRemoteContribution;
export default TYPERT_REMOTE;
