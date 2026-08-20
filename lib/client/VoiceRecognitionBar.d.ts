import { type VoiceInputSession } from './voice-session.js';
export type RecognitionBarProps = {
    readonly voiceSession: VoiceInputSession;
};
/**
 * The recognition status bar above the composer. Shows live state and a stop
 * button while recording; the bar renders nothing when idle.
 */
export declare function VoiceRecognitionBar({ voiceSession }: RecognitionBarProps): import("react").JSX.Element | null;
