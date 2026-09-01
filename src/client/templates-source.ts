import type {
  ClientSessionContext,
  InputTriggerCandidate,
  InputTriggerPick,
  InputTriggerSource
} from '@deepseek-ai/dsh-client-ui-input-trigger/client'
import type { TemplatesController } from './templates-controller.js'

/** Unique source name on the `/` trigger (the menu group title). */
export const TEMPLATES_SOURCE_NAME = 'better-input-templates'

const MAX_CANDIDATES = 50

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
export function createTemplatesSource(controller: TemplatesController): InputTriggerSource {
  const source: InputTriggerSource = {
    trigger: '/',
    name: TEMPLATES_SOURCE_NAME,
    order: 300,
    showGroupTitle: true,

    async candidates(_session, req): Promise<readonly InputTriggerCandidate[]> {
      const query = req.query.trim().toLowerCase()
      const templates = controller.getSnapshot().templates
      const matched = query === ''
        ? templates
        : templates.filter((template) =>
          template.name.toLowerCase().includes(query) ||
          (template.description !== '' && template.description.toLowerCase().includes(query)) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      return matched.slice(0, MAX_CANDIDATES).map((template) => ({
        name: template.name,
        ...(template.description === '' ? {} : { description: template.description }),
        ...(template.tags.length === 0 ? {} : { hint: template.tags.join(' / ') }),
        value: template.id
      }))
    },

    onPick(pick: InputTriggerPick) {
      const id = pick.candidate.value ?? ''
      const template = controller.byId(id)
      if (template === undefined) {
        return undefined
      }
      return { text: template.content }
    },

    warm(_session: ClientSessionContext): void {
      controller.ensureLoaded()
    }
  }
  return source
}
