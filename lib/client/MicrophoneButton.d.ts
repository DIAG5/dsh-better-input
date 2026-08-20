import { type BetterInputSettings, type BetterInputSettingsPatch } from '../config.js';
import type { BetterInputRemote } from '../remote.js';
import { type VoiceInputSession } from './voice-session.js';
/**
 * Standard props the conversation input zone hands to every
 * `conversation.input.right` entry, plus the injected voice session and
 * settings controller face.
 */
export type InputZoneLikeProps = {
    readonly input: {
        readonly draft: string;
    };
    readonly inputActions: {
        setDraft(text: string): void;
    };
    readonly voiceSession: VoiceInputSession;
    readonly remote: BetterInputRemote;
    readonly useSettings: () => SettingsFace;
};
export type SettingsFace = {
    readonly status: 'loading' | 'ready' | 'error';
    readonly settings: BetterInputSettings;
};
/**
 * The microphone button in the composer tool row. Click to start listening,
 * click again to stop. Transcripts stream into the draft in real time; when
 * polishing is enabled, the committed transcript is polished through the Host
 * LLM route and replaces the draft (unless the user edited it meanwhile).
 */
export declare function MicrophoneButton({ input, inputActions, voiceSession, remote, useSettings }: InputZoneLikeProps): import("react").JSX.Element;
export interface PolishDraftOptions {
    transcript: string;
    baseDraft: string;
    draftAtStop: string;
    provider: string;
    model: string;
    remote: BetterInputRemote;
    setState: (state: 'idle' | 'error' | 'polish-error' | 'polishing', detail?: string) => void;
    latestDraftRef: {
        current: string;
    };
    actionsRef: {
        current: {
            setDraft(text: string): void;
        };
    };
    polishAbortRef: {
        current: AbortController | null;
    };
}
export declare function polishDraft(options: PolishDraftOptions): Promise<void>;
/**
 * Only replace the draft when the user has not edited it since the transcript
 * landed. Both the transcript-at-stop and the base draft count as unchanged
 * (the user may have reverted the interim edits).
 */
export declare function shouldApplyPolishResult(currentDraft: string, draftAtStop: string, baseDraft: string): boolean;
/** Append transcript to a base draft with one space separator. */
export declare function updateDraft(baseDraft: string, transcript: string): string;
export declare function isSupported(): boolean;
export type { BetterInputSettingsPatch };
