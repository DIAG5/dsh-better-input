import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { type BetterInputSettingsPatch, type BetterInputSettingsView, type PolishRoute } from '../config.js';
export declare class BetterInputPolishService extends TypertRemoteService {
    static inject: string[];
    private settings;
    constructor(ctx: Context);
    getSettings(): BetterInputSettingsView;
    updateSettings(patch: BetterInputSettingsPatch, signal: AbortSignal): Promise<BetterInputSettingsView>;
    listRoutes(): Promise<PolishRoute[]>;
    polish(transcript: string, provider: string, model: string, signal: AbortSignal): Promise<string>;
    private completePolish;
}
