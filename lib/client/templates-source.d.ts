import type { InputTriggerSource } from '@deepseek-ai/dsh-client-ui-input-trigger/client';
import type { TemplatesController } from './templates-controller.js';
/** Unique source name on the `/` trigger (the menu group title). */
export declare const TEMPLATES_SOURCE_NAME = "better-input-templates";
/**
 * The input-trigger source that inserts stored prompt templates as literal
 * text on the `/` trigger.
 *
 * - `warm()` prefetches the template list when the input box mounts, so the
 *   first `/` keystroke already shows entries.
 * - `candidates()` filters by name / description / tag substring.
 * - `onPick()` returns `{ text: content }` — the trigger token span is
 *   replaced by the template body, so `/name` never persists in the draft
 *   and no lexicon/codec registration is needed.
 */
export declare function createTemplatesSource(controller: TemplatesController): InputTriggerSource;
