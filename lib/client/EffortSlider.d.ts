/**
 * Reasoning-effort slider with Canvas radiation animation and CSS glow.
 *
 * Adapted from dsh-reasoning-effort — the chibi-runner and adaptation
 * guidance parts are removed. The slider adapts to whatever effort levels
 * the current model exposes via `reasoning.efforts`.
 *
 * ── Perf / flicker contract ────────────────────────────────────────
 * Dragging NEVER re-renders React on every pointer move. Move events write
 * directly to the slider's `--be-progress` CSS variable (which drives the
 * track fill, flare and knob) and to the `radiationRef` read by the canvas
 * rAF loop. React state only changes on mount / external directory change /
 * released commit / manual picker — so the surrounding menu does not
 * flicker while scrubbing.
 *
 * The canvas animates continuously (even when idle) — it only speeds up
 * while dragging.
 *
 * ── Alignment contract ────────────────────────────────────────────
 * Every moving part maps a unitless progress p ∈ [0,1] to:
 *
 *     x(px) = 14 + p · (width − 28)
 *
 * so the knob never sits "in the middle" of the radiation field.
 *
 * @module dsh-better-input/client/effort-slider
 */
import type { EffortLevel } from './model-directory.js';
/** ── Component ────────────────────────────────────────────────────── */
export interface EffortSliderProps {
    /** Ordered effort levels exposed by the current model. */
    readonly levels: readonly EffortLevel[];
    /** Committed effort index (controlled by the parent). */
    readonly index: number;
    /** Whether a select call or directory loading is in progress. */
    readonly busy: boolean;
    readonly error: string | null;
    /** Called with the projected discrete index on release / keyboard. */
    readonly onSelect: (index: number) => void;
}
export declare function EffortSlider({ levels, index, busy, error, onSelect }: EffortSliderProps): import("react").JSX.Element | null;
