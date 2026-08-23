/**
 * Reasoning-effort slider with Canvas radiation animation and CSS glow.
 *
 * Adapted from dsh-reasoning-effort — the chibi-runner and adaptation
 * guidance parts are removed. The slider adapts to whatever effort levels
 * the current model exposes via `reasoning.efforts`.
 *
 * ── Perf / flicker contract ────────────────────────────────────────
 * Dragging NEVER re-renders React on every pointer move. Move events write
 * directly to the slider's `--be-progress` CSS variable (which drives the
 * track fill, flare and knob) and to the `radiationRef` read by the canvas
 * rAF loop. React state only changes on mount / external directory change /
 * released commit / manual picker — so the surrounding menu does not
 * flicker while scrubbing.
 *
 * The canvas animates continuously (even when idle) — it only speeds up
 * while dragging.
 *
 * ── Alignment contract ────────────────────────────────────────────
 * Every moving part maps a unitless progress p ∈ [0,1] to:
 *
 *     x(px) = 14 + p · (width − 28)
 *
 * so the knob never sits "in the middle" of the radiation field.
 *
 * @module dsh-better-input/client/effort-slider
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import type { EffortLevel } from './model-directory.js'

/** Progress stored in a ref for the rAF loop and DOM writes. */
interface RadiationState {
  /** Unitless progress in [0, 1]. */
  progress: number
  dragging: boolean
}

const PADDING_PX = 14

/** Convert a unitless progress [0,1] to an origin pixel inside the slider. */
function progressToOrigin(p: number, width: number): number {
  const clamped = Math.max(0, Math.min(1, p))
  return PADDING_PX + clamped * Math.max(1, width - PADDING_PX * 2)
}

/** Canvas radiation rendering — adapted from dsh-reasoning-effort drawRadiation. */
function drawRadiation(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  state: RadiationState,
): void {
  const origin = progressToOrigin(state.progress, width)
  const cell = 4
  const speed = state.dragging ? 2.8 : 1
  context.clearRect(0, 0, width, height)
  if (origin <= cell) return
  context.save()
  context.beginPath()
  context.rect(0, 0, origin, height)
  context.clip()
  for (let x = 0; x < origin; x += cell) {
    const delta = x + cell * 0.5 - origin
    const distance = Math.abs(delta)
    const phaseA = distance / 10 - time * 0.0074 * speed
    const phaseB = distance / 23 - time * 0.0041 * speed + 1.7
    const phaseC = distance / 40 - time * 0.0022 * speed + 3.4
    const sinA = Math.max(0, Math.sin(phaseA))
    const sinB = Math.max(0, Math.sin(phaseB))
    const sinC = Math.max(0, Math.sin(phaseC))
    const waveA = Math.pow(sinA, 2.6)
    const waveB = Math.pow(sinB, 3.2)
    const waveC = Math.pow(sinC, 4)
    const crest = Math.pow(sinA, 15) + Math.pow(sinB, 18) * 0.78
    const wave = Math.min(1, waveA * 0.76 + waveB * 0.58 + waveC * 0.32)
    const trail = 0.38 + 0.62 * Math.exp(-distance / Math.max(55, width * 0.72))
    const pillar = Math.pow(Math.max(0, Math.sin(x / 20 + time * 0.0016)), 3) * 0.27
    const columnEnergy = trail * (wave * 1.04 + pillar + crest * 0.32)
    if (columnEnergy > 0.012) {
      const nearness = Math.max(0, 1 - distance / Math.max(1, width * 0.78))
      const red = Math.round(42 + 124 * nearness + 75 * wave)
      const green = Math.round(56 + 58 * nearness + 44 * crest)
      const blue = Math.round(175 + 72 * nearness + 8 * wave)
      const alpha = Math.min(0.88, columnEnergy * 0.72)
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`
      context.fillRect(x, 0, cell - 1, height)
    }
    for (let y = 0; y < height; y += cell) {
      const deltaY = y + cell * 0.5 - height * 0.5
      const radial = Math.hypot(delta / 38, deltaY / 11)
      const halo = Math.exp(-radial * 0.96) * 1.08
      const verticalShape = 0.58 + 0.42 * Math.cos((deltaY / height) * Math.PI)
      const grain = 0.72 + 0.28 * Math.sin(x * 0.73 + y * 1.31 + time * 0.006)
      const alpha = Math.min(0.96, (columnEnergy * 0.88 + halo + crest * 0.19) * verticalShape * grain)
      if (alpha < 0.035) continue
      const hot = Math.max(0, 1 - radial / 2.4)
      const red = Math.round(54 + 148 * hot + 42 * wave + 35 * crest)
      const green = Math.round(68 + 78 * hot + 46 * crest)
      const blue = Math.round(186 + 64 * hot)
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`
      context.fillRect(x, y, cell - 1, cell - 1)
    }
  }
  for (let i = 0; i < 14; i += 1) {
    const travel = (time * (state.dragging ? 0.16 : 0.065) * (0.78 + (i % 5) * 0.09) + i * 23) % Math.max(30, origin + 64)
    const particleX = origin - travel
    if (particleX < -24 || particleX > width + 16) continue
    const particleY = 3 + ((i * 13 + Math.sin(time * 0.003 + i) * 5) % Math.max(7, height - 6))
    const length = 4 + (i % 4) * 4 + (state.dragging ? 6 : 0)
    const alpha = 0.28 + (i % 5) * 0.1
    const streak = context.createLinearGradient(particleX, 0, particleX + length, 0)
    streak.addColorStop(0, 'rgba(72,118,255,0)')
    streak.addColorStop(0.68, `rgba(112,135,255,${alpha})`)
    streak.addColorStop(1, `rgba(236,222,255,${Math.min(1, alpha + 0.26)})`)
    context.fillStyle = streak
    context.fillRect(particleX, particleY, length, i % 3 === 0 ? 2 : 1)
  }
  const glow = context.createRadialGradient(origin, height / 2, 0, origin, height / 2, 24)
  glow.addColorStop(0, 'rgba(255,255,255,.82)')
  glow.addColorStop(0.14, 'rgba(183,190,255,.54)')
  glow.addColorStop(0.44, 'rgba(103,74,255,.28)')
  glow.addColorStop(1, 'rgba(86,31,210,0)')
  context.fillStyle = glow
  context.fillRect(origin - 26, 0, 52, height)
  context.restore()
}

/** ── Helpers ──────────────────────────────────────────────────────── */

function clampIndex(value: number, count: number): number {
  return Math.max(0, Math.min(count - 1, Math.round(value)))
}

/** Unitless progress [0,1] from a discrete effort index. */
function indexToProgress(index: number, count: number): number {
  if (count <= 1) return 0.5
  return Math.max(0, Math.min(1, index / (count - 1)))
}

/** Clamp a pointer-relative x ratio into the padded progress range. */
function clampProgress(x: number): number {
  return Math.max(0, Math.min(1, x))
}

/** Direct-DOM write that moves knob/flare/fill without a React re-render. */
function applyProgress(el: HTMLElement | null, p: number): void {
  if (!el) return
  el.style.setProperty('--be-progress', String(clampProgress(p)))
}

/** ── Component ────────────────────────────────────────────────────── */

export interface EffortSliderProps {
  /** Ordered effort levels exposed by the current model. */
  readonly levels: readonly EffortLevel[]
  /** Committed effort index (controlled by the parent). */
  readonly index: number
  /** Whether a select call or directory loading is in progress. */
  readonly busy: boolean
  readonly error: string | null
  /** Called with the projected discrete index on release / keyboard. */
  readonly onSelect: (index: number) => void
}

export function EffortSlider({ levels, index, busy, error, onSelect }: EffortSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const activePointerIdRef = useRef<number | null>(null)
  const radiationRef = useRef<RadiationState>({ progress: 0.5, dragging: false })
  const available = levels.length >= 2
  const currentLevel = levels[index]
  const isTop = available && index === levels.length - 1
  const label = `Effort: ${currentLevel?.name ?? ''} (${index + 1} of ${levels.length})`

  /* Position the knob at the committed level's interval spot on MOUNT.
     The parent remounts this component (via a `key` bound to the model id)
     whenever the MODEL changes, so model switches land on the right level,
     while in-model effort changes keep the knob exactly where the pointer
     left it (no snap, no effect-driven realignment). */
  useEffect(() => {
    if (available) {
      applyProgress(sliderRef.current, indexToProgress(index, levels.length))
      radiationRef.current.progress = indexToProgress(index, levels.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Keep radiation.dragging in sync so the canvas speeds up while scrubbing. */
  useEffect(() => {
    radiationRef.current.dragging = dragging
  }, [dragging])

  /* Canvas animation loop — runs continuously; speeds up while dragging. */
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) return
    const context = canvas.getContext('2d')
    if (context === null) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 1
    let height = 1
    let frame = 0
    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas.parentElement ?? canvas)
    const draw = () => {
      frame += 1
      drawRadiation(context, width, height, reducedMotion.matches ? 0 : frame, radiationRef.current)
    }
    let raf = 0
    const loop = () => {
      if (!reducedMotion.matches) draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  /* ── Handlers ────────────────────────────────────────────────── */

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!available || busy) return
    event.preventDefault()
    activePointerIdRef.current = event.pointerId
    ;(event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId)
    radiationRef.current.dragging = true
    setDragging(true)
    const slider = sliderRef.current
    if (slider) {
      const rect = slider.getBoundingClientRect()
      const x = clampProgress((event.clientX - rect.left) / rect.width)
      radiationRef.current.progress = x
      applyProgress(slider, x)
    }
  }, [available, busy])

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      const step = event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : 0
      if (step === 0) return
      event.preventDefault()
      const next = clampIndex(index + step, levels.length)
      if (next !== index) onSelect(next)
    },
    [index, levels.length, onSelect],
  )

  /* ── Global pointer tracking (drag without React re-render) ── */
  useEffect(() => {
    const slider = sliderRef.current
    if (!available) return

    const handleGlobalMove = (event: PointerEvent) => {
      if (event.pointerId !== activePointerIdRef.current) return
      event.preventDefault()
      if (!slider) return
      const rect = slider.getBoundingClientRect()
      if (rect.width === 0) return
      const x = clampProgress((event.clientX - rect.left) / rect.width)
      // Direct-DOM write: no React state, no menu flicker.
      radiationRef.current.progress = x
      applyProgress(slider, x)
    }

    const finishDrag = (event: PointerEvent, cancel: boolean) => {
      if (event.pointerId !== activePointerIdRef.current) return
      if (slider?.hasPointerCapture(event.pointerId)) {
        try { slider.releasePointerCapture(event.pointerId) } catch {}
      }
      activePointerIdRef.current = null
      radiationRef.current.dragging = false
      setDragging(false)
      if (cancel) {
        // Roll back to the committed position.
        const p = indexToProgress(index, levels.length)
        applyProgress(slider, p)
        radiationRef.current.progress = p
        return
      }
      // Project the final continuous position into the discrete level and
      // let the parent decide. The knob deliberately STAYS at the pointer's
      // final spot — we do NOT snap it back to the discrete position.
      const idx = clampIndex(radiationRef.current.progress * (levels.length - 1), levels.length)
      onSelect(idx)
    }

    const handleGlobalEnd = (e: PointerEvent) => finishDrag(e, false)
    const handleGlobalCancel = (e: PointerEvent) => finishDrag(e, true)

    document.addEventListener('pointermove', handleGlobalMove)
    document.addEventListener('pointerup', handleGlobalEnd)
    document.addEventListener('pointercancel', handleGlobalCancel)
    return () => {
      document.removeEventListener('pointermove', handleGlobalMove)
      document.removeEventListener('pointerup', handleGlobalEnd)
      document.removeEventListener('pointercancel', handleGlobalCancel)
    }
  }, [available, levels, index, onSelect])

  if (!available) return null

  return (
    <div
      className={`be-effort-group${dragging ? ' is-dragging' : ''}${busy ? ' is-busy' : ''}${error ? ' is-error' : ''}`}
      role="group"
      aria-label={label}
    >
      <div
        ref={sliderRef}
        className="be-effort-slider"
        data-top={isTop ? '' : undefined}
        onPointerDown={handlePointerDown}
      >
        {/* Track */}
        <div className="be-effort-track" />

        {/* FX layer for Canvas radiation */}
        <div className="be-effort-fx">
          <canvas className="be-effort-canvas" ref={canvasRef} aria-hidden="true" />
        </div>

        {/* Flare glow */}
        <div className="be-effort-flare" aria-hidden="true" />

        {/* Knob */}
        <div className="be-effort-knob" aria-hidden="true" />

        {/* Hidden range input (a11y + keyboard only; pointer is owned by slider div) */}
        <input
          ref={inputRef}
          className="be-effort-input"
          type="range"
          min={0}
          max={Math.max(0, levels.length - 1)}
          step={1}
          value={index}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={levels.length - 1}
          aria-valuenow={index}
          aria-valuetext={currentLevel?.name ?? ''}
          disabled={busy}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Endpoint hints — like Cursor's Faster / Smarter. */}
      <div className="be-effort-hints">
        <span className="be-effort-hint-fast">Faster</span>
        <span className="be-effort-hint-smart">Smarter</span>
      </div>

      <span className="be-effort-sr" aria-live="polite">{label}</span>
    </div>
  )
}