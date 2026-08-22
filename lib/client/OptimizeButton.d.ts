import type { BetterInputRemote } from '../remote.js';
import type { SettingsFace } from './MicrophoneButton.js';
/**
 * Props handed to every `conversation.input.dock` entry, plus the injected
 * remote and settings face. The standard session kit provides `inputActions`
 * and `useInput` separately; the owner share gives us `input.draft`.
 */
export type OptimizeButtonProps = {
    readonly input: {
        readonly draft: string;
    };
    readonly inputActions: {
        setDraft(text: string): void;
    };
    readonly remote: BetterInputRemote;
    readonly useSettings: () => SettingsFace;
};
/**
 * The ✨ optimize button rendered above the composer card (in
 * `conversation.input.dock`), right-aligned. Click reads the current draft,
 * calls the Host LLM to optimize it, then shows a confirmation panel with
 * the original and optimized text. The draft is replaced only when the user
 * clicks "Adopt".
 */
export declare function OptimizeButton({ input, inputActions, remote, useSettings }: OptimizeButtonProps): import("react").JSX.Element | null;
