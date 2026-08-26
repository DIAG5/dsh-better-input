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
     *
     * When `ocr` is true and the detected format is a raster-friendly document
     * (PDF pages / PPTX embedded images), conversion routes through the vision
     * model instead of the text-layer converters — for scanned or image-heavy
     * files whose text layer is empty. Any other file with `ocr` set falls back
     * to the normal text-layer conversion.
     */
    convertFile(fileName: string, fileData: string, ocr: boolean | undefined, signal: AbortSignal): Promise<{
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
     * OCR one scanned document through the configured vision model. Every page
     * (PDF) or embedded image (PPTX) is saved through the attachment store and
     * read by the model sequentially (one image per call), then concatenated
     * into a single Markdown document. A per-image failure is recorded as a
     * comment rather than aborting the whole conversion.
     */
    private ocrConvert;
    /** Run one vision-model read of a single saved image, returning its Markdown. */
    private ocrOne;
    /**
     * Resolve the effective reasoning-effort wire config for one route. An
     * explicit stored selection is forwarded as-is. The empty default means
     * "thinking off": when the model advertises an `off` tier we send it, and
     * otherwise we omit the field so the adapter's own default applies.
     */
    private resolveEffortConfig;
}
