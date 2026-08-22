import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots';
import { type VoiceInputSession } from './voice-session.js';
/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>;
export type RecognitionBarProps = {
    readonly voiceSession: VoiceInputSession;
    readonly t: Translate;
};
/**
 * The recognition status bar above the composer. Shows live state and a stop
 * button while recording; the bar renders nothing when idle.
 */
export declare function VoiceRecognitionBar({ voiceSession, t }: RecognitionBarProps): import("react").JSX.Element | null;
export {};
