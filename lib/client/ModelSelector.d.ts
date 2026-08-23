/**
 * Model selector + effort slider for the composer toolbar.
 *
 * Replaces the built-in `conversation.input.model` single slot with a
 * custom popup menu that shows provider groups, model entries, and an
 * effort slider when the selected model exposes `reasoning.efforts`.
 *
 * ── Selective re-render contract ────────────────────────────────────
 * The root ModelSelector subscribes to `status/current.model` only, so
 * effort-level changes never re-render the trigger or view switch.
 * Each menu section below is a separate memoised child component with
 * its own store subscription + a selector that returns only the slice it
 * cares about, so:
 *
 *   - changing REASONING EFFORT re-renders  EffortSelectRow & SliderRow
 *   - changing MODEL / GROUP      re-renders  All slices (expected)
 *
 * This matches the requirement: "only refresh the bottom model-display
 * + effort slider; don't refresh the model-selection form up top."
 *
 * Props composition:
 * - `locked` — from InputControlOwnerProps (composer bar's disable state)
 * - `sessionId` — from SessionStandardProps (framework standard kit)
 * - `directory` — from the slot's inject factory (resolves the per-session model directory)
 *
 * @module dsh-better-input/client/model-selector
 */
import type { ModelDirectory } from './model-directory.js';
import type { SettingsController } from './settings-controller.js';
/** ── Props ────────────────────────────────────────────────────────── */
export interface ModelSelectorProps {
    readonly locked: boolean;
    readonly sessionId: string;
    readonly directory: ModelDirectory;
    readonly settingsController: SettingsController;
    /** Fallback UI provided by the next lower-priority slot entry (DSH built-in model picker). */
    readonly children?: React.ReactNode;
}
export declare function ModelSelector({ locked, sessionId: _sessionId, directory, settingsController, children }: ModelSelectorProps): import("react").JSX.Element;
