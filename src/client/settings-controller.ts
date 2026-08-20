import { useSyncExternalStore } from 'react'
import { DEFAULT_SETTINGS, type BetterInputSettings, type BetterInputSettingsPatch, type BetterInputSettingsView, type PolishRoute } from '../config.js'
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

const EMPTY_VIEW: BetterInputSettingsView = {
  available: false,
  writable: false,
  settings: { ...DEFAULT_SETTINGS },
  overridden: [],
  defaultPolishPrompt: ''
}

type Listener = () => void

/**
 * Settings read/write controller for the settings page and the microphone
 * flow. Owns the remote calls and a simple external store so both the page
 * and the voice button observe the same values.
 */
export class SettingsController {
  private settingsSnapshot: SettingsSnapshot = { status: 'loading', view: EMPTY_VIEW, detail: '' }
  private routesSnapshot: RoutesSnapshot = { status: 'loading', routes: [], detail: '' }
  private readonly listeners = new Set<Listener>()
  private disposed = false

  constructor(private readonly remote: BetterInputRemote) {}

  readonly getSettingsSnapshot = (): SettingsSnapshot => this.settingsSnapshot

  readonly getRoutesSnapshot = (): RoutesSnapshot => this.routesSnapshot

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
    }
    this.emit()
  }

  async update(patch: BetterInputSettingsPatch): Promise<boolean> {
    const result = await this.remote.updateSettings(patch)
    if (this.disposed) return false
    if (!result.ok) return false
    this.settingsSnapshot = { status: 'ready', view: result.value, detail: '' }
    this.emit()
    return true
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
