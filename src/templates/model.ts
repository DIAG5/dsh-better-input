/**
 * Prompt template data model shared by the host store and the Typert layer.
 * A template is a plain text snippet the user stores once and later inserts
 * from the input box via the `/` trigger source.
 */

export type BetterInputTemplate = {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly content: string
  readonly tags: readonly string[]
  readonly createdAt: number
  readonly updatedAt: number
}

export type TemplateInput = {
  readonly id?: string
  readonly name: string
  readonly description?: string
  readonly content: string
  readonly tags?: readonly string[]
}

export const MAX_TEMPLATE_COUNT = 200
export const MAX_TEMPLATE_NAME_LENGTH = 60
export const MAX_TEMPLATE_DESCRIPTION_LENGTH = 200
export const MAX_TEMPLATE_CONTENT_LENGTH = 8000
export const MAX_TEMPLATE_TAGS = 8
export const MAX_TEMPLATE_TAG_LENGTH = 20

/** Trim, drop empties, dedupe case-insensitively, cap count and length. */
export function normalizeTags(tags: readonly string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const raw of tags) {
    const tag = raw.trim()
    if (tag === '') {
      continue
    }
    const key = tag.toLowerCase()
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    result.push(tag.slice(0, MAX_TEMPLATE_TAG_LENGTH))
    if (result.length >= MAX_TEMPLATE_TAGS) {
      break
    }
  }
  return result
}

export function validateTemplateInput(input: TemplateInput): void {
  const name = input.name.trim()
  if (name === '') {
    throw new Error('dsh-better-input template name must not be empty')
  }
  if (name.length > MAX_TEMPLATE_NAME_LENGTH) {
    throw new Error(`dsh-better-input template name must not exceed ${MAX_TEMPLATE_NAME_LENGTH} characters`)
  }
  if (input.content.trim() === '') {
    throw new Error('dsh-better-input template content must not be empty')
  }
  if (input.content.length > MAX_TEMPLATE_CONTENT_LENGTH) {
    throw new Error(`dsh-better-input template content must not exceed ${MAX_TEMPLATE_CONTENT_LENGTH} characters`)
  }
  if (input.description !== undefined && input.description.length > MAX_TEMPLATE_DESCRIPTION_LENGTH) {
    throw new Error(`dsh-better-input template description must not exceed ${MAX_TEMPLATE_DESCRIPTION_LENGTH} characters`)
  }
}
