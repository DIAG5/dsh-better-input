import s from '@deepseek-ai/schemastery';
/** Host-only dsh settings schema; keep schemastery out of the browser bundle. */
export declare const BetterInputSettingsSchema: s<Schemastery.ObjectS<{
    language: s<string, string>;
    maxRecordingSeconds: s<number, number>;
    polishingEnabled: s<boolean, boolean>;
    polishProvider: s<string, string>;
    polishModel: s<string, string>;
    polishPrompt: s<string, string>;
}>, Schemastery.ObjectT<{
    language: s<string, string>;
    maxRecordingSeconds: s<number, number>;
    polishingEnabled: s<boolean, boolean>;
    polishProvider: s<string, string>;
    polishModel: s<string, string>;
    polishPrompt: s<string, string>;
}>>;
