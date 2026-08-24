import type { ConversionItem } from './conversion-types.js'

type Listener = () => void

/**
 * Client-side store of converted documents waiting to be sent.
 *
 * Keyed by the reference id carried on each composer chip. Conversion results
 * are registered here after a successful convert; the input-trigger source
 * reads a conversion's Markdown by ref when DSH serializes the chip on submit.
 * Kept intentionally tiny — one mutable Map plus a subscribe-notify surface so
 * the dock can re-render on edits.
 */
export class ConversionStore {
  private readonly items = new Map<string, ConversionItem>()
  private readonly listeners = new Set<Listener>()
  private expanded = false

  /** Register or replace one conversion. */
  set(item: ConversionItem): void {
    this.items.set(item.ref, item)
    this.notify()
  }

  /** Read one conversion by reference id. */
  get(ref: string): ConversionItem | undefined {
    return this.items.get(ref)
  }

  /** All conversions, in registration order. */
  values(): readonly ConversionItem[] {
    return Array.from(this.items.values())
  }

  /** Remove one conversion (e.g. when its chip is removed or adopted). */
  delete(ref: string): void {
    if (this.items.delete(ref)) this.notify()
  }

  /** Replace the Markdown of one conversion in place. */
  updateMarkdown(ref: string, markdown: string): boolean {
    const item = this.items.get(ref)
    if (item === undefined) return false
    item.markdown = markdown
    this.notify()
    return true
  }

  /** Subscribe to mutations; returns an unsubscribe. */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Exchange the current expanded flag for the next and notify (toggle helper). */
  setExpanded(value: boolean): void {
    if (this.expanded === value) return
    this.expanded = value
    this.notify()
  }

  /** Whether the conversion panel is currently expanded. */
  isExpanded(): boolean {
    return this.expanded
  }

  private notify(): void {
    for (const listener of this.listeners) listener()
  }
}