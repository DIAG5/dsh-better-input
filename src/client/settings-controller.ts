import { useSyncExternalStore } from 'react'
import { DEFAULT_SETTINGS, type BetterInputSettings, type BetterInputSettingsPatch, type BetterInputSettingsView, type PolishRoute, type ReasoningEffortInfo } from '../config.js'
import type { AboutInfoWire, UpdateCheckResultWire } from '../remote-contract.js'
import type { BetterInputRemote } from '../remote.js'

export type SettingsStatus = 'loading' | 'ready' | 'error'

export type SettingsSnapshot = {
  readonly status: SettingsStatus
  readonly view: BetterInputSettingsView
  readonly detail: string
}

export type RoutesSnapshot = {
  readonly status: 'loading' | 'ready' | 'error'
  readonly routes: readonly PolishRoute[]
  readonly detail: string
}

/** Keyed by `${provider}\u0000${model}` — undefined effort = loading requested,
 *  null effort = load failed, object = resolved efforts. */
export type EffortsSnapshot = Readonly<Record<string, EffortsEntry>>
export type EffortsEntry = {
  readonly status: 'loading' | 'ready' | 'error'
  readonly efforts: readonly ReasoningEffortInfo[]
  readonly defaultEffort?: string
  readonly detail: string
}

export type AboutSnapshot = {
  readonly status: 'loading' | 'ready' | 'error'
  readonly about: AboutInfoWire
  readonly detail: string
}

export type UpdateSnapshot = {
  readonly status: 'idle' | 'loading' | 'ready' | 'error'
  readonly update: UpdateCheckResultWire | null
  readonly detail: string
}

const EMPTY_ABOUT: AboutInfoWire = {
  repository: '',
  repositorySlug: '',
  version: '',
  license: '',
  updateCommand: '',
  updateCommandNpx: ''
}

const EMPTY_VIEW: BetterInputSettingsView = {
  available: false,
  writable: false,
  settings: { ...DEFAULT_SETTINGS },
  overridden: [],
  defaultPolishPrompt: '',
  defaultOptimizePrompt: ''
}

type Listener = () => void

/**
 * Settings read/write controller for the settings page and the microphone
 * flow. Owns the remote calls and a simple external store so both the page
 * and the voice button observe the same values. Also caches per-model
 * reasoning-effort metadata loaded lazily through resolveModelEfforts so
 * opening the effort dropdown never double-fetches across renders.
 */
export class SettingsController {
  private settingsSnapshot: SettingsSnapshot = { status: 'loading', view: EMPTY_VIEW, detail: '' }
  private routesSnapshot: RoutesSnapshot = { status: 'loading', routes: [], detail: '' }
  private effortsSnapshot: EffortsSnapshot = {}
  private aboutSnapshot: AboutSnapshot = { status: 'loading', about: EMPTY_ABOUT, detail: '' }
  private updateSnapshot: UpdateSnapshot = { status: 'idle', update: null, detail: '' }
  private readonly listeners = new Set<Listener>()
  private disposed = false

  constructor(private readonly remote: BetterInputRemote) {}

  readonly getSettingsSnapshot = (): SettingsSnapshot => this.settingsSnapshot

  readonly getRoutesSnapshot = (): RoutesSnapshot => this.routesSnapshot

  readonly getEffortsSnapshot = (): EffortsSnapshot => this.effortsSnapshot

  readonly getAboutSnapshot = (): AboutSnapshot => this.aboutSnapshot

  readonly getUpdateSnapshot = (): UpdateSnapshot => this.updateSnapshot

  readonly subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  async refreshSettings(): Promise<void> {
    const result = await this.remote.getSettings()
    if (this.disposed) return
    if (!result.ok) {
      this.settingsSnapshot = { status: 'error', view: EMPTY_VIEW, detail: result.error.message }
    } else {
      this.settingsSnapshot = { status: 'ready', view: result.value, detail: '' }
      // Best-effort "first launch" default model pick: if the profile store
      // still carries the empty-string defaults (no model ever chosen in
      // BetterInput), wait a tick for routes and auto-pick the first one
      // available in the dsh registry as the default for polish + optimize.
      // This roughly matches "use the user's primary configured model"
      // because dsh's listRoutes() keeps user-favorite providers first.
      void this.autoPopulateDefaultRoutesIfNeeded(result.value.settings)
    }
    this.emit()
  }

  async refreshRoutes(): Promise<void> {
    const result = await this.remote.listRoutes()
    if (this.disposed) return
    if (!result.ok) {
      this.routesSnapshot = { status: 'error', routes: [], detail: result.error.message }
    } else {
      this.routesSnapshot = { status: 'ready', routes: result.value, detail: '' }
      // Settings may have arrived before routes; re-check autopopulate now.
      if (this.settingsSnapshot.status === 'ready') {
        void this.autoPopulateDefaultRoutesIfNeeded(this.settingsSnapshot.view.settings)
      }
    }
    this.emit()
  }

  private readonly autoPopulateDefaultRoutesIfNeeded = async (settings: BetterInputSettings): Promise<void> => {
    const polishEmpty = settings.polishProvider === '' || settings.polishModel === ''
    const optimizeEmpty = settings.optimizeProvider === '' || settings.optimizeModel === ''
    if (!polishEmpty && !optimizeEmpty) return

    const routes = this.routesSnapshot.status === 'ready' && this.routesSnapshot.routes.length > 0
      ? this.routesSnapshot.routes
      : await (async (): Promise<readonly PolishRoute[]> => {
        if (this.disposed) return []
        const rs = await this.remote.listRoutes()
        if (this.disposed || !rs.ok) return []
        this.routesSnapshot = { status: 'ready', routes: rs.value, detail: '' }
        this.emit()
        return rs.value
      })()

    const first = routes[0]
    if (first === undefined) return

    const patch: BetterInputSettingsPatch = {}
    if (polishEmpty) {
      patch.polishProvider = first.provider
      patch.polishModel = first.model
    }
    if (optimizeEmpty) {
      patch.optimizeProvider = first.provider
      patch.optimizeModel = first.model
    }
    await this.update(patch)
  }

  async update(patch: BetterInputSettingsPatch): Promise<boolean> {
    const result = await this.remote.updateSettings(patch)
    if (this.disposed) return false
    if (!result.ok) return false
    this.settingsSnapshot = { status: 'ready', view: result.value, detail: '' }
    this.emit()
    return true
  }

  /**
   * Lazily fetch reasoning efforts for a route. Results are cached in the
   * controller so changing the effort dropdown back and forth doesn't
   * re-trigger remote calls. Returns a snapshot entry immediately — the
   * caller subscribes via `useEffortsSnapshot` to re-render when the data
   * lands.
   */
  async ensureEffortsFor(provider: string, model: string): Promise<void> {
    if (provider === '' || model === '' || this.disposed) return
    const key = `${provider}\u0000${model}`
    const existing = this.effortsSnapshot[key]
    // Never refetch; keep whatever previous result (success / error / loading) we had.
    if (existing !== undefined) return
    this.effortsSnapshot = {
      ...this.effortsSnapshot,
      [key]: { status: 'loading', efforts: [], detail: '' }
    }
    this.emit()
    try {
      const result = await this.remote.resolveModelEfforts(provider, model)
      if (this.disposed) return
      if (result.ok) {
        this.effortsSnapshot = {
          ...this.effortsSnapshot,
          [key]: { status: 'ready', efforts: result.value.efforts, defaultEffort: result.value.defaultEffort, detail: '' }
        }
      } else {
        this.effortsSnapshot = {
          ...this.effortsSnapshot,
          [key]: { status: 'error', efforts: [], detail: result.error.message }
        }
      }
    } catch (error) {
      if (this.disposed) return
      this.effortsSnapshot = {
        ...this.effortsSnapshot,
        [key]: { status: 'error', efforts: [], detail: error instanceof Error ? error.message : String(error) }
      }
    }
    this.emit()
  }

  async refreshAbout(): Promise<void> {
    const result = await this.remote.getAbout()
    if (this.disposed) return
    if (!result.ok) {
      this.aboutSnapshot = { status: 'error', about: EMPTY_ABOUT, detail: result.error.message }
    } else {
      this.aboutSnapshot = { status: 'ready', about: result.value, detail: '' }
    }
    this.emit()
  }

  async checkForUpdate(): Promise<void> {
    if (this.disposed) return
    if (this.updateSnapshot.status === 'loading') return
    this.updateSnapshot = { status: 'loading', update: null, detail: '' }
    this.emit()
    try {
      const result = await this.remote.checkForUpdate()
      if (this.disposed) return
      if (result.ok) {
        this.updateSnapshot = { status: 'ready', update: result.value, detail: '' }
      } else {
        this.updateSnapshot = { status: 'error', update: null, detail: result.error.message }
      }
    } catch (error) {
      if (this.disposed) return
      this.updateSnapshot = { status: 'error', update: null, detail: error instanceof Error ? error.message : String(error) }
    }
    this.emit()
  }

  dispose(): void {
    this.disposed = true
    this.listeners.clear()
  }

  private emit(): void {
    for (const listener of this.listeners) listener()
  }
}

export function useSettingsSnapshot(controller: SettingsController): SettingsSnapshot {
  return useSyncExternalStore(controller.subscribe, controller.getSettingsSnapshot, controller.getSettingsSnapshot)
}

export function useRoutesSnapshot(controller: SettingsController): RoutesSnapshot {
  return useSyncExternalStore(controller.subscribe, controller.getRoutesSnapshot, controller.getRoutesSnapshot)
}

export function useEffortsSnapshot(controller: SettingsController): EffortsSnapshot {
  return useSyncExternalStore(controller.subscribe, controller.getEffortsSnapshot, controller.getEffortsSnapshot)
}

export function useAboutSnapshot(controller: SettingsController): AboutSnapshot {
  return useSyncExternalStore(controller.subscribe, controller.getAboutSnapshot, controller.getAboutSnapshot)
}

export function useUpdateSnapshot(controller: SettingsController): UpdateSnapshot {
  return useSyncExternalStore(controller.subscribe, controller.getUpdateSnapshot, controller.getUpdateSnapshot)
}
