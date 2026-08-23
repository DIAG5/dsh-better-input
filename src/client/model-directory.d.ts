/**
 * Minimal type stubs for the `@deepseek-ai/dsh-client-ui-model-selection` package,
 * which provides the `modelDirectories` service. The actual package is bundled
 * into the DSH web client at runtime; these stubs let us compile against its
 * injected service face without pulling it as a full dependency.
 *
 * @module dsh-better-input/client/model-directory
 */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'

/** One selectable reasoning effort exactly as the owning adapter advertised it. */
export interface EffortLevel {
  readonly id: string
  readonly name: string
  readonly description?: string
}

/** Adapter-owned reasoning metadata for one model entry. */
export interface ReasoningInfo {
  readonly efforts: readonly EffortLevel[]
  readonly defaultEffort?: string
}

/** One model as the directory exposes it. */
export interface ModelEntry {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly reasoning?: ReasoningInfo
}

/** One provider group in the directory. */
export interface ModelGroup {
  readonly id: string
  readonly name: string
  readonly models: readonly ModelEntry[]
}

/** Serializable model selection (provider + model + optional effort). */
export interface ModelSelection {
  readonly provider: string
  readonly model: string
  readonly reasoningEffort?: string
}

/** Live state of one model directory (one per session scope). */
export interface ModelDirectoryState {
  readonly current: ModelSelection | null
  readonly groups: readonly ModelGroup[]
  readonly status: 'idle' | 'loading' | 'selecting' | 'ready' | 'error'
  readonly error: string | null
}

/** The model-directory service injected into slot components. */
export interface ModelDirectory {
  readonly store: SnapshotStore<ModelDirectoryState>
  load(): Promise<void>
  select(selection: ModelSelection): Promise<boolean>
}

/** The `modelDirectories` service injected by the Cordis runtime. */
export interface ModelDirectoriesService {
  /** Resolve the directory for a given session. */
  directoryFor(sessionId: string): ModelDirectory
}

/** Augment the Cordis context so `ctx.modelDirectories` is typed. */
declare module '@deepseek-ai/cordis' {
  interface Context {
    modelDirectories: ModelDirectoriesService
  }
}