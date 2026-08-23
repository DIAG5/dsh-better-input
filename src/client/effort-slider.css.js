/**
 * CSS string for the effort slider and model selector.
 * Injected at runtime by the component via a <style> tag.
 *
 * @module dsh-better-input/client/effort-slider.css
 */

export const CSS = `
/* ── Slider root ─────────────────────────────────────────────────── */

.be-effort-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
  color: var(--dsw-alias-label-secondary);
  user-select: none;
  box-sizing: border-box;
}

.be-effort-hints {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: var(--dsw-alias-label-secondary, #aeb2c4);
}

.be-effort-hint-fast {
  text-align: left;
}

.be-effort-hint-smart {
  text-align: right;
}

.be-effort-group.is-busy .be-effort-select {
  opacity: .55;
  pointer-events: none;
}

.be-effort-slider {
  --be-progress: 0.5;
  position: relative;
  width: 100%;
  height: 30px;
  flex: 1 1 auto;
  border-radius: 999px;
  isolation: isolate;
  transition: filter 180ms ease;
}

.be-effort-track {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  background: linear-gradient(100deg, #03040a 0%, #071126 22%, #101d4c 45%, #302262 70%, #5d35a0 100%);
  box-shadow:
    inset 0 1px 0 rgba(189, 199, 255, .15),
    inset 0 -1px 0 rgba(0, 0, 0, .55),
    0 3px 10px rgba(12, 17, 55, .34);
}

.be-effort-track::before {
  content: "";
  position: absolute;
  z-index: 0;
  inset: 0 auto 0 0;
  width: calc(14px + var(--be-progress) * (100% - 28px));
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(62,108,255,.18) 0%, rgba(116,82,255,.34) 62%, rgba(168,103,255,.32) 100%);
  pointer-events: none;
}

.be-effort-track::after {
  content: "";
  position: absolute;
  z-index: 1;
  inset: 0;
  background:
    radial-gradient(circle at 18% 45%, rgba(82, 130, 255, .12), transparent 24%),
    linear-gradient(90deg, rgba(0, 0, 0, .28), transparent 42%, rgba(168, 113, 255, .12));
  pointer-events: none;
}

/* ── Canvas radiation layer ──────────────────────────────────────── */

.be-effort-fx {
  position: absolute;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

.be-effort-canvas {
  position: absolute;
  z-index: 2;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  image-rendering: pixelated;
  mix-blend-mode: screen;
  transition: filter 140ms ease;
}

/* ── Flare (glow cone at the knob position) ──────────────────────── */

.be-effort-flare {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: calc(14px + var(--be-progress) * (100% - 28px));
  width: 78px;
  height: 46px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 100% 50%, rgba(255,255,255,.96) 0 4%, rgba(188,189,255,.8) 11%, rgba(106,87,255,.5) 28%, rgba(105,31,255,.2) 49%, transparent 74%);
  filter: blur(2px) saturate(1.25);
  mix-blend-mode: screen;
  transform: translate(-100%, -50%);
  transition: left 70ms linear, filter 140ms ease;
  pointer-events: none;
}

.be-effort-flare::before,
.be-effort-flare::after {
  content: "";
  position: absolute;
  inset: 50% auto auto 100%;
  border-radius: 999px;
  transform: translate(-50%, -50%);
}

.be-effort-flare::before {
  width: 52px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(100,160,255,.42), #f1ecff, rgba(193,82,255,.65), transparent);
  box-shadow: 0 0 7px #9b7cff, 0 0 13px rgba(72,132,255,.64);
}

.be-effort-flare::after {
  width: 1px;
  height: 20px;
  background: linear-gradient(180deg, transparent, rgba(196,190,255,.84), transparent);
  box-shadow: 0 0 7px #9c7cff;
}

/* ── Knob ─────────────────────────────────────────────────────────── */

.be-effort-knob {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: calc(14px + var(--be-progress) * (100% - 28px));
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255,255,255,.94);
  border-radius: 50%;
  background: #fff;
  box-shadow:
    0 0 0 2px rgba(92,105,255,.12),
    0 0 14px rgba(121,82,255,.48),
    0 2px 7px rgba(0,0,0,.3);
  transform: translate(-50%, -50%);
  transition: left 190ms cubic-bezier(.22,1,.36,1), transform 160ms ease, box-shadow 180ms ease;
  pointer-events: none;
}

/* ── Hidden range input (interaction surface) ─────────────────────── */

.be-effort-input {
  position: absolute;
  z-index: 5;
  inset: -5px 0;
  width: 100%;
  height: calc(100% + 10px);
  margin: 0;
  opacity: 0;
  cursor: grab;
  touch-action: none;
}

.be-effort-input:active { cursor: grabbing; }

.be-effort-input:focus-visible + .be-effort-knob {
  outline: 2px solid var(--dsw-static-blue-400);
  outline-offset: 2px;
}

/* ── Dragging state ───────────────────────────────────────────────── */

.be-effort-group.is-dragging .be-effort-canvas {
  filter: saturate(1.45) brightness(1.28) contrast(1.06);
}

.be-effort-group.is-dragging .be-effort-flare {
  filter: blur(1.5px) saturate(1.6) brightness(1.42);
  transition: none;
}

.be-effort-group.is-dragging .be-effort-knob {
  transform: translate(-50%, -50%) scale(1.07);
  transition: none;
  box-shadow:
    0 0 0 3px rgba(113,115,255,.25),
    0 0 20px rgba(74,145,255,.86),
    0 0 31px rgba(171,53,255,.66),
    0 3px 8px rgba(0,0,0,.32);
}

/* ── Max level (top) glow ─────────────────────────────────────────── */

.be-effort-slider[data-top] .be-effort-track {
  animation: be-effort-dark-breathe 1.9s ease-in-out infinite;
}

.be-effort-slider[data-top] .be-effort-knob {
  box-shadow:
    0 0 0 3px rgba(119,99,255,.18),
    0 0 22px rgba(135,78,255,.76),
    0 0 34px rgba(53,121,255,.34),
    0 3px 8px rgba(0,0,0,.3);
}

/* ── Error / busy states ──────────────────────────────────────────── */

.be-effort-group.is-error .be-effort-slider {
  outline: 1px solid var(--dsw-alias-state-error-secondary);
  outline-offset: 2px;
}

.be-effort-group.is-busy { opacity: .72; }

/* ── Screen reader only ───────────────────────────────────────────── */

.be-effort-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ── Model root wrapper (positions the menu relative to the trigger) ─── */

.be-model-root {
  position: relative;
  display: inline-flex;
  min-width: 0;
}

/* ── Model trigger button (in composer toolbar) ───────────────────── */

.be-model-trigger {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  max-width: 230px;
  height: 28px;
  padding: 0 8px 0 10px;
  border: 0;
  border-radius: 9px;
  color: var(--dsw-alias-label-primary, #15171b);
  background: transparent;
  font: inherit;
  cursor: pointer;
  transition: background 140ms ease;
}

.be-model-trigger:hover,
.be-model-trigger[aria-expanded="true"] {
  background: var(--dsw-alias-fill-tertiary, rgba(120,125,140,.1));
}

.be-model-trigger:disabled { cursor: not-allowed; opacity: .5; }

.be-model-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  line-height: 1;
}

.be-model-effort {
  flex: 0 0 auto;
  color: var(--dsw-static-deepseek-500, #4d70ff);
  font-size: 12px;
  line-height: 1;
}

.be-model-chevron {
  flex: 0 0 auto;
  width: 7px;
  height: 7px;
  margin: -3px 1px 0 3px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  opacity: .55;
  transform: rotate(45deg);
  transition: transform 150ms ease, margin 150ms ease;
}

.be-model-trigger[aria-expanded="true"] .be-model-chevron {
  margin-top: 3px;
  transform: rotate(225deg);
}

/* ── Popup menu ───────────────────────────────────────────────────── */

.be-model-menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 1200;
  width: min(312px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid var(--dsw-alias-stroke-secondary, rgba(121,126,145,.2));
  border-radius: 16px;
  color: var(--dsw-alias-label-primary, #15171b);
  background: var(--dsw-alias-bg-elevated, #fff);
  box-shadow: 0 14px 42px rgba(18, 24, 42, .18), 0 3px 10px rgba(18, 24, 42, .08);
  animation: be-menu-in 150ms cubic-bezier(.22,1,.36,1);
}

.be-advanced {
  padding: 14px;
}

.be-menu-separator {
  height: 1px;
  background: var(--dsw-alias-stroke-secondary, rgba(121,126,145,.16));
}

/* ── Model list rows ──────────────────────────────────────────────── */

.be-model-row,
.be-model-option,
.be-model-back {
  width: 100%;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.be-model-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 8px;
  min-height: 45px;
  padding: 0 14px;
  text-align: left;
}

.be-model-row:hover,
.be-model-option:hover,
.be-model-back:hover { background: var(--dsw-alias-fill-tertiary, rgba(120,125,140,.09)); }

.be-model-row-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
.be-model-row-effort { color: var(--dsw-static-deepseek-500, #4d70ff); font-size: 12px; }
.be-row-chevron { font-size: 20px; line-height: 1; opacity: .42; }

.be-model-pane { max-height: min(390px, 60vh); overflow-y: auto; padding: 7px; }

.be-model-back {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 8px;
  border-radius: 8px;
  text-align: left;
  color: var(--dsw-alias-label-secondary, #686c75);
  font-size: 12px;
}

.be-model-group-title {
  padding: 10px 9px 5px;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 11px;
}

.be-model-option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 20px;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 7px 9px;
  border-radius: 9px;
  text-align: left;
}

.be-model-option-name {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.be-model-option-desc {
  display: block;
  margin-top: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 10px;
}

.be-model-check {
  color: var(--dsw-static-deepseek-500, #4d70ff);
  font-size: 15px;
  text-align: center;
}

.be-model-status {
  padding: 14px;
  color: var(--dsw-alias-label-tertiary, #9296a0);
  font-size: 12px;
  text-align: center;
}

.be-model-error {
  margin: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--dsw-alias-state-error-primary, #c83e4d);
  background: var(--dsw-alias-state-error-tertiary, rgba(220,55,70,.08));
  font-size: 11px;
}

/* ── Dark theme overrides ──────────────────────────────────────────── */

body[data-ds-dark-theme] .be-model-menu {
  border-color: rgba(136, 145, 180, .2);
  color: var(--dsw-alias-label-primary, #f2f4f8);
  background: var(--dsw-alias-bg-elevated, #202126);
  box-shadow: 0 18px 46px rgba(0,0,0,.48), 0 3px 12px rgba(0,0,0,.32);
}

body[data-ds-dark-theme] .be-model-trigger {
  color: var(--dsw-alias-label-primary, #f2f4f8);
}

/* ── Animations ────────────────────────────────────────────────────── */

@keyframes be-menu-in {
  from { opacity: 0; transform: translateY(5px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes be-effort-dark-breathe {
  0%, 100% { box-shadow: inset 0 1px 0 rgba(196,204,255,.16), 0 3px 10px rgba(18,25,72,.4), 0 0 0 rgba(0,0,0,0); }
  50% { box-shadow: inset 0 1px 0 rgba(220,214,255,.24), 0 0 21px rgba(111,66,255,.5), 0 0 36px rgba(88,55,255,.24); }
}

`