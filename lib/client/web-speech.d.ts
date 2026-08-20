/**
 * Browser Web Speech recognition session, written from scratch for
 * dsh-better-input. Wraps SpeechRecognition / webkitSpeechRecognition with a
 * small structural interface so no DOM lib augmentation is required.
 */
export type WebSpeechState = 'starting' | 'recording' | 'stopped' | 'error';
export type WebSpeechSessionOptions = {
    language: string;
    onStart?: () => void;
    onInterim: (text: string) => void;
    onFinal: (text: string) => void;
    onError: (error: Error) => void;
    onEnd: (text: string) => void;
};
export declare function isWebSpeechAvailable(): boolean;
export declare class WebSpeechSession {
    private readonly recognition;
    private readonly options;
    private active;
    private stopping;
    private finalText;
    private lastHeard;
    private ended;
    private silent;
    constructor(options: WebSpeechSessionOptions);
    start(): void;
    stop(): void;
    abort(): void;
    private handleResult;
    private handleError;
    private handleEnd;
    private fail;
    private endOnce;
}
export declare function appendSpeech(current: string, next: string): string;
