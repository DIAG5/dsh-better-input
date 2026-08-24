import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { type BetterInputSettingsPatch, type BetterInputSettingsView, type PolishRoute, type ReasoningEffortInfo } from '../config.js';
import { type AboutInfo, type UpdateCheckResult } from '../about.js';
import type { ConvertibleFormat } from '../converter/types.js';
export declare class BetterInputPolishService extends TypertRemoteService {
    static inject: string[];
    private settings;
    constructor(ctx: Context);
    getSettings(): BetterInputSettingsView;
    updateSettings(patch: BetterInputSettingsPatch, signal: AbortSignal): Promise<BetterInputSettingsView>;
    listRoutes(): Promise<PolishRoute[]>;
    /**
     * Lazily resolve reasoning efforts for a single route. Only called once the
     * settings UI actually displays that model's effort selector — so we never
     * blast the adapter/provide with hundreds of upfront resolveModelInfo calls.
     * Returns `{ efforts: [] }` (no defaultEffort key) if the metadata is
     * unavailable (adapter offline, model unknown, etc.).
     */
    resolveModelEfforts(provider: string, model: string): Promise<{
        efforts: readonly ReasoningEffortInfo[];
        defaultEffort?: string;
    }>;
    getAbout(): AboutInfo;
    checkForUpdate(signal: AbortSignal): Promise<UpdateCheckResult>;
    polish(transcript: string, provider: string, model: string, signal: AbortSignal): Promise<string>;
    optimize(text: string, provider: string, model: string, context: string, signal: AbortSignal): Promise<string>;
    private completePolish;
    private completeOptimize;
    /**
     * Convert a binary file to Markdown on the Host. The raw bytes arrive as a
     * base64 string; we decode once and hand them to the converter package.
     * This runs only on the Host so the heavy parsing libraries never ship to
     * the browser.
     */
    convertFile(fileName: string, fileData: string, signal: AbortSignal): Promise<{
        success: boolean;
        format: ConvertibleFormat;
        markdown: string;
        warnings: readonly string[];
        metadata?: {
            pageCount?: number;
            slideCount?: number;
            sheetCount?: number;
            wordCount?: number;
            fileCount?: number;
        };
    }>;
    /**
     * Resolve the effective reasoning-effort wire config for one route. An
     * explicit stored selection is forwarded as-is. The empty default means
     * "thinking off": when the model advertises an `off` tier we send it, and
     * otherwise we omit the field so the adapter's own default applies.
     */
    private resolveEffortConfig;
}
