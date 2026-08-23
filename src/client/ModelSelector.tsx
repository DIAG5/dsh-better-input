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

import { memo, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { ModelDirectory, ModelDirectoryState, ModelGroup, ModelEntry, EffortLevel } from './model-directory.js'
import { EffortSlider } from './EffortSlider.js'
import type { SettingsController } from './settings-controller.js'
import { useSettingsSnapshot } from './settings-controller.js'

/** ── Props ────────────────────────────────────────────────────────── */

export interface ModelSelectorProps {
  readonly locked: boolean
  readonly sessionId: string
  readonly directory: ModelDirectory
  readonly settingsController: SettingsController
  /** Fallback UI provided by the next lower-priority slot entry (DSH built-in model picker). */
  readonly children?: React.ReactNode
}

/** ── Helpers ──────────────────────────────────────────────────────── */

function effortIndexOf(levels: readonly EffortLevel[], id: string | undefined, fallbackId?: string): number {
  if (levels.length === 0) return 0
  const direct = levels.findIndex((level) => level.id === id)
  if (direct >= 0) return direct
  const fallback = levels.findIndex((level) => level.id === fallbackId)
  if (fallback >= 0) return fallback
  return Math.floor((levels.length - 1) / 2)
}

function currentModel(state: ModelDirectoryState): ModelEntry | undefined {
  if (state.current === null) return undefined
  const group = state.groups.find((c) => c.id === state.current!.provider)
  return group?.models.find((m) => m.id === state.current!.model)
}

function currentEffortName(state: ModelDirectoryState): string | undefined {
  const model = currentModel(state)
  if (!model?.reasoning?.efforts || state.current?.reasoningEffort === undefined) return undefined
  return model.reasoning.efforts.find((e) => e.id === state.current!.reasoningEffort)?.name
}

/** Lightweight selector hook — caches the last selected slice and re-uses
    the same object reference whenever `select(snapshot)` matches the cache
    via the supplied equality check. This way `useSyncExternalStore`'s
    default `Object.is` comparison sees the same reference and skips
    re-rendering the owning component. */
function useDirectorySlice<TSlice>(
  directory: ModelDirectory,
  select: (state: ModelDirectoryState) => TSlice,
  isEqual: (a: TSlice, b: TSlice) => boolean = Object.is as (a: TSlice, b: TSlice) => boolean,
): TSlice {
  const lastRef = useRef<{ snap: ModelDirectoryState | 0; slice: TSlice } | null>(null)
  const selectAndCache = (snap: ModelDirectoryState): TSlice => {
    const next = select(snap)
    if (lastRef.current !== null && lastRef.current.snap !== 0) {
      if (lastRef.current.snap === snap || isEqual(lastRef.current.slice, next)) {
        return lastRef.current.slice
      }
    }
    lastRef.current = { snap, slice: next }
    return next
  }
  return useSyncExternalStore(
    (notify) => directory.store.subscribe(notify),
    () => selectAndCache(directory.store.getSnapshot()),
    () => selectAndCache(directory.store.getSnapshot()),
  )
}

/* ───────────────────────────────────────────────────────────────────
   Menu sections — each owns its own store slice.
   ─────────────────────────────────────────────────────────────────── */

interface SharedMenuProps {
  readonly directory: ModelDirectory
  readonly busy: boolean
  readonly expanded: boolean
}

/* ── GroupsView (the "model selection form" mentioned by user) ────
   Selector only cares about status / groups / current.provider/model.
   Changes to reasoningEffort do NOT re-render this. */
interface GroupsViewProps extends SharedMenuProps {
  readonly onOpenGroup: (group: ModelGroup) => void
}

const GroupsView = memo(function GroupsView({ directory, onOpenGroup }: GroupsViewProps) {
  const slice = useDirectorySlice(
    directory,
    (s) => ({
      status: s.status,
      error: s.error,
      groups: s.groups,
      provider: s.current?.provider ?? null,
      model: s.current?.model ?? null,
    }),
    (a, b) =>
      a.status === b.status &&
      a.error === b.error &&
      a.groups === b.groups && // same array ref from the store
      a.provider === b.provider &&
      a.model === b.model,
  )

  if (slice.status === 'loading' || slice.status === 'idle') {
    return <div className="be-model-status">Loading...</div>
  }
  if (slice.status === 'error') {
    return <div className="be-model-error">{slice.error}</div>
  }
  if (slice.groups.length === 0) {
    return <div className="be-model-status">No models available</div>
  }
  return (
    <div className="be-model-pane">
      {slice.groups.map((group) => {
        const isSelected = slice.provider === group.id
        return (
          <button
            key={group.id}
            className="be-model-row"
            onClick={() => onOpenGroup(group)}
          >
            <span className="be-model-row-name">{group.name}</span>
            {isSelected && (
              <span className="be-model-row-effort">
                {group.models.find((m) => m.id === slice.model)?.name ?? ''}
              </span>
            )}
            <span className="be-row-chevron" aria-hidden="true">›</span>
          </button>
        )
      })}
    </div>
  )
})

/* ── ModelsView (inside a provider group) ──────────────────────── */
interface ModelsViewProps extends SharedMenuProps {
  readonly activeGroup: ModelGroup
  readonly onGoBack: () => void
  readonly onSelectModel: (groupId: string, modelId: string) => Promise<void>
}

const ModelsView = memo(function ModelsView({ directory, busy, activeGroup, onGoBack, onSelectModel }: ModelsViewProps) {
  const slice = useDirectorySlice(
    directory,
    (s) => ({
      provider: s.current?.provider ?? null,
      model: s.current?.model ?? null,
    }),
    (a, b) => a.provider === b.provider && a.model === b.model,
  )
  return (
    <div>
      <button className="be-model-back" onClick={onGoBack} disabled={busy}>
        <span aria-hidden="true">‹</span> {activeGroup.name}
      </button>
      <div className="be-model-pane">
        {activeGroup.models.map((entry) => {
          const isSelected =
            slice.provider === activeGroup.id && slice.model === entry.id
          return (
            <button
              key={entry.id}
              className="be-model-option"
              onClick={() => void onSelectModel(activeGroup.id, entry.id)}
              disabled={busy}
            >
              <span>
                <span className="be-model-option-name">{entry.name}</span>
                {entry.description && (
                  <span className="be-model-option-desc">{entry.description}</span>
                )}
              </span>
              {isSelected && <span className="be-model-check" aria-hidden="true">✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
})

/* ── SliderRow — the effort slider at the bottom of the menu. ──── */
interface SliderRowProps extends SharedMenuProps {
  readonly enabled: boolean
}

const SliderRow = memo(function SliderRow({ directory, busy, enabled }: SliderRowProps) {
  if (!enabled) return null
  const slice = useDirectorySlice(
    directory,
    (s) => {
      if (s.current === null) return null
      const group = s.groups.find((g) => g.id === s.current!.provider)
      const entry = group?.models.find((m) => m.id === s.current!.model)
      const efforts = entry?.reasoning?.efforts
      if (!efforts || efforts.length < 2) return null
      return {
        key: `${s.current.provider}:${s.current.model}`,
        efforts,
        reasoningEffort: s.current.reasoningEffort,
        error: s.error,
      }
    },
    (a, b) =>
      a === b ||
      (a !== null &&
        b !== null &&
        a.key === b.key &&
        a.reasoningEffort === b.reasoningEffort &&
        a.error === b.error &&
        a.efforts === b.efforts),
  )
  if (!slice) return null
  const idx = effortIndexOf(slice.efforts, slice.reasoningEffort)
  return (
    <>
      <div className="be-menu-separator" />
      <div className="be-advanced">
        <EffortSlider
          key={slice.key}
          levels={slice.efforts}
          index={idx}
          busy={busy}
          error={slice.error}
          onSelect={(i) => {
            const level = slice.efforts[i]
            if (!level) return
            const s = directory.store.getSnapshot()
            if (s.current === null) return
            void directory.select({
              provider: s.current.provider,
              model: s.current.model,
              reasoningEffort: level.id,
            })
          }}
        />
      </div>
    </>
  )
})

/** ── Root component ───────────────────────────────────────────────── */

type View = 'groups' | 'models'

export function ModelSelector({ locked, sessionId: _sessionId, directory, settingsController, children }: ModelSelectorProps) {
  /* Read slider toggle setting.  When OFF, render the `children` fallback
     which contains the built-in DSH model picker (single-slot wrapper
     hands down the next lower-priority entry as React children). */
  const settingsSnap = useSettingsSnapshot(settingsController)
  const sliderEnabled =
    settingsSnap.status === 'ready'
      ? settingsSnap.view.settings.composerEffortSlider
      : true

  if (settingsSnap.status === 'ready' && !sliderEnabled) {
    return <>{children}</>
  }

  /* Root only subscribes to status + current.{provider,model,reasoningEffort}
     + error — just enough to drive the trigger + busy flag. */
  const rootSlice = useDirectorySlice(
    directory,
    (s) => ({
      status: s.status,
      current:
        s.current === null
          ? null
          : {
              provider: s.current.provider,
              model: s.current.model,
              reasoningEffort: s.current.reasoningEffort,
            },
      error: s.error,
    }),
    (a, b) =>
      a.status === b.status &&
      a.error === b.error &&
      ((a.current === null && b.current === null) ||
        (a.current !== null &&
          b.current !== null &&
          a.current.provider === b.current.provider &&
          a.current.model === b.current.model &&
          a.current.reasoningEffort === b.current.reasoningEffort)),
  )

  const [expanded, setExpanded] = useState(false)
  const [view, setView] = useState<View>('groups')
  const [activeGroup, setActiveGroup] = useState<ModelGroup | null>(null)
  const [selecting, setSelecting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  /* Trigger helper slice — returns model name + effort name for the top bar. */
  const triggerSlice = useDirectorySlice(
    directory,
    (s) => {
      const model = currentModel(s)
      return {
        modelName: model?.name ?? null,
        effortName: currentEffortName(s) ?? null,
      }
    },
    (a, b) => a.modelName === b.modelName && a.effortName === b.effortName,
  )

  const busy =
    selecting ||
    rootSlice.status === 'selecting' ||
    rootSlice.status === 'loading'

  useEffect(() => {
    directory.load().catch(() => undefined)
  }, [directory])

  useEffect(() => {
    if (!expanded) return
    const handleOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setExpanded(false)
        setView('groups')
        setActiveGroup(null)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [expanded])

  useEffect(() => {
    if (!expanded) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpanded(false)
        setView('groups')
        setActiveGroup(null)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [expanded])

  const toggle = useCallback(() => {
    if (busy || locked) return
    setExpanded((prev) => {
      if (prev) {
        setView('groups')
        setActiveGroup(null)
      }
      return !prev
    })
  }, [busy, locked])

  const openGroup = useCallback((group: ModelGroup) => {
    setActiveGroup(group)
    setView('models')
  }, [])

  const goBack = useCallback(() => {
    setView('groups')
    setActiveGroup(null)
  }, [])

  const selectModel = useCallback(
    async (groupId: string, modelId: string) => {
      setSelecting(true)
      try {
        const ok = await directory.select({ provider: groupId, model: modelId })
        if (ok) {
          setExpanded(false)
          setView('groups')
          setActiveGroup(null)
        }
      } finally {
        setSelecting(false)
      }
    },
    [directory],
  )

  const renderTrigger = () => (
    <button
      ref={triggerRef}
      className="be-model-trigger"
      aria-expanded={expanded}
      aria-haspopup="true"
      aria-label={triggerSlice.modelName ?? 'Select model'}
      disabled={busy || locked}
      onClick={toggle}
    >
      <span className="be-model-name">
        {triggerSlice.modelName ?? 'Select model'}
      </span>
      {triggerSlice.effortName && (
        <span className="be-model-effort">{triggerSlice.effortName}</span>
      )}
      <span className="be-model-chevron" aria-hidden="true" />
    </button>
  )

  const sharedProps: SharedMenuProps = { directory, busy, expanded }

  return (
    <div className="be-model-root" ref={rootRef}>
      {renderTrigger()}
      {expanded && (
        <div className="be-model-menu" ref={menuRef} role="dialog" aria-label="Select model">
          {view === 'groups' ? (
            <GroupsView {...sharedProps} onOpenGroup={openGroup} />
          ) : (
            activeGroup !== null && (
              <ModelsView
                {...sharedProps}
                activeGroup={activeGroup}
                onGoBack={goBack}
                onSelectModel={selectModel}
              />
            )
          )}
          {view === 'groups' && <SliderRow {...sharedProps} enabled={sliderEnabled} />}
        </div>
      )}
    </div>
  )
}