/**
 * Client-side store for the prompt template library. Mirrors the settings
 * controller: an external-store class consumed via useSyncExternalStore,
 * one sticky initial fetch (also kicked off by the `/` trigger warm hook),
 * and optimistic list updates after save/remove so the menu and the settings
 * section stay in sync without refetching.
 */

import { useSyncExternalStore } from 'react'
import type { TemplateInputWire, TemplateWire } from '../remote-contract.js'
import type { BetterInputRemote } from '../remote.js'

export type TemplatesSnapshot = {
  readonly status: 'loading' | 'ready' | 'error'
  readonly templates: readonly TemplateWire[]
  readonly detail: string
}

/** Form state: tags stay a raw comma-separated string until save. */
export type TemplateDraft = {
  readonly id?: string
  readonly name: string
  readonly description: string
  readonly tags: string
  readonly content: string
}

type Listener = () => void

const EMPTY_SNAPSHOT: TemplatesSnapshot = { status: 'loading', templates: [], detail: '' }

function sortByRecency(templates: readonly TemplateWire[]): TemplateWire[] {
  return [...templates].sort((left, right) => right.updatedAt - left.updatedAt)
}

/** Split on ASCII and full-width commas, trim, drop empties. */
function parseTags(raw: string): string[] {
  return raw
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '')
}

export class TemplatesController {
  private snapshot: TemplatesSnapshot = EMPTY_SNAPSHOT
  private readonly listeners = new Set<Listener>()
  private disposed = false
  private loadPromise: Promise<void> | undefined

  constructor(private readonly remote: BetterInputRemote) {}

  readonly getSnapshot = (): TemplatesSnapshot => this.snapshot

  readonly subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  readonly byId = (id: string): TemplateWire | undefined =>
    this.snapshot.templates.find((template) => template.id === id)

  /** Kick off the one-time initial fetch; safe to call repeatedly. */
  readonly ensureLoaded = (): void => {
    if (this.loadPromise !== undefined || this.disposed) {
      return
    }
    this.loadPromise = this.refresh()
  }

  async refresh(): Promise<void> {
    try {
      const result = await this.remote.templatesList()
      if (this.disposed) return
      if (result.ok) {
        this.snapshot = { status: 'ready', templates: sortByRecency(result.value.templates), detail: '' }
      } else {
        this.snapshot = { status: 'error', templates: [], detail: result.error.message }
      }
    } catch (error) {
      if (this.disposed) return
      this.snapshot = { status: 'error', templates: [], detail: error instanceof Error ? error.message : String(error) }
    }
    this.emit()
  }

  /** Create or update one template; resolves false when the call failed. */
  async save(draft: TemplateDraft): Promise<boolean> {
    const tags = parseTags(draft.tags)
    const input: TemplateInputWire = {
      name: draft.name,
      content: draft.content,
      ...(draft.id === undefined ? {} : { id: draft.id }),
      ...(draft.description === '' ? {} : { description: draft.description }),
      ...(tags.length === 0 ? {} : { tags })
    }
    try {
      const result = await this.remote.templatesSave(input)
      if (this.disposed || !result.ok) {
        return false
      }
      const saved = result.value.template
      const rest = this.snapshot.templates.filter((template) => template.id !== saved.id)
      this.snapshot = { ...this.snapshot, status: 'ready', templates: sortByRecency([...rest, saved]) }
      this.emit()
      return true
    } catch {
      return false
    }
  }

  /** Remove one template; resolves false when the call failed. */
  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.remote.templatesRemove(id)
      if (this.disposed || !result.ok || !result.value.removed) {
        return false
      }
      this.snapshot = { ...this.snapshot, templates: this.snapshot.templates.filter((template) => template.id !== id) }
      this.emit()
      return true
    } catch {
      return false
    }
  }

  dispose(): void {
    this.disposed = true
    this.listeners.clear()
  }

  private emit(): void {
    for (const listener of this.listeners) listener()
  }
}

export function useTemplatesSnapshot(controller: TemplatesController): TemplatesSnapshot {
  return useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot)
}
