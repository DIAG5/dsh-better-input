export type VoiceInputState = 'idle' | 'starting' | 'recording' | 'transcribing' | 'polishing' | 'error' | 'polish-error';
export type VoiceInputSessionSnapshot = {
    readonly state: VoiceInputState;
    readonly detail: string;
};
type Listener = () => void;
type StopListener = () => void;
export declare const VOICE_ERROR_DISMISS_MS = 2600;
/**
 * Shared voice-input state for one session, written from scratch for
 * dsh-better-input. The microphone button and the recognition bar both
 * subscribe; the bar can request stop/cancel through the same instance.
 */
export declare class VoiceInputSession {
    private snapshot;
    private readonly listeners;
    private readonly stopListeners;
    private readonly cancelListeners;
    private epoch;
    private errorTimer;
    captureEpoch(): number;
    isCurrentEpoch(epoch: number): boolean;
    readonly getSnapshot: () => VoiceInputSessionSnapshot;
    readonly subscribe: (listener: Listener) => (() => void);
    readonly onStopRequested: (listener: StopListener) => (() => void);
    readonly onCancelRequested: (listener: StopListener) => (() => void);
    setState(state: VoiceInputState, detail?: string): void;
    requestStop(): void;
    requestCancel(): void;
    dispose(): void;
    private clearErrorTimer;
    private emit;
}
export declare function useVoiceInputSession(session: VoiceInputSession): VoiceInputSessionSnapshot;
export {};
