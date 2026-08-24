import type {
  ClientSessionContext,
  InputTriggerCandidate,
  InputTriggerSource,
} from '@deepseek-ai/dsh-client-ui-input-trigger/client'
import type { ConversionStore } from './conversion-store.js'

/** Unique source name on the `@` trigger (the menu group title). */
export const CONVERSION_SOURCE_NAME = 'better-input-conversion'

/**
 * The input-trigger source that exposes picked documents as inline
 * `@<label>` reference chips.
 *
 * - `candidates()` lists every file the dock has added, marking whether it is
 *   ready to send as-is (pure text) or needs conversion first.
 * - `onPick()` returns a {@link ReferenceInsert} only for sendable items;
 *   non-sendable documents (unconverted binary) are a no-op so nothing is
 *   inserted.
 * - `lexicon()` feeds the chip decorator with only the sendable names.
 * - `codec.serialize(ref)` returns the (possibly user-edited) text that is
 *   injected into the message on send; it never serializes an unusable item.
 *
 * The source is context-free — it only reads the store — and is registered
 * once on the client root context.
 */
export function createConversionSource(store: ConversionStore): InputTriggerSource {
  const source: InputTriggerSource = {
    trigger: '@',
    name: CONVERSION_SOURCE_NAME,
    order: 200, // keep it below the built-in @file / @folder sources
    showGroupTitle: true,

    async candidates(): Promise<InputTriggerCandidate[]> {
      return store.values().map((item) => ({
        name: item.name,
        description: item.sendable
          ? '可直接发送'
          : '未转换的文档，请先转换',
        value: item.ref,
      }))
    },

    onPick(pick) {
      const ref = pick.candidate.value ?? ''
      const item = store.get(ref)
      if (item === undefined || !item.sendable) return undefined // nothing to insert
      return {
        insert: {
          source: CONVERSION_SOURCE_NAME,
          ref,
          label: item.name,
          appearance: 'file',
          clipboardText: `@${item.name} `,
        },
      }
    },

    lexicon(): string[] {
      return store
        .values()
        .filter((item) => item.sendable)
        .map((item) => item.name)
    },

    subscribeLexicon(_session: ClientSessionContext, listener: () => void) {
      return store.subscribe(listener)
    },

    codec: {
      clipboardText(ref: string): string {
        return `@${store.get(ref)?.name ?? ref} `
      },
      async serialize(ref: string): Promise<string> {
        const item = store.get(ref)
        if (item === undefined) throw new Error(`文件不存在：${ref}`)
        if (!item.sendable) throw new Error(`该文件尚未转换，无法发送：${item.name}`)
        return item.markdown
      },
    },
  }
  return source
}