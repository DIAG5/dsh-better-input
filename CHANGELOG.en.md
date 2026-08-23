# Changelog

Versioned release notes for this repository, maintained from here on. This is the English mirror; Chinese is authoritative — see [CHANGELOG.md](CHANGELOG.md).

## [0.1.4] - 2026-08-23

### Added

- **Prompt optimization supports conversation context**: during optimization you can reference the most recent N turns of the current conversation as context (settable in Settings via "Context turns"; 0 disables it; default is 3), so the rewrite stays in tune with the ongoing session.

### Changed

- **Removed the composer reasoning-effort slider**: during development we actually built a Codex-style slider — a custom `EffortSlider` / `ModelSelector` replacing DSH's built-in `conversation.input.model`, with drag, snap-on-release and maxed-out glow effects, plus a toggle in Settings. But turning out to be awkward in practice, **the "add a toggle in Settings" interaction** — features that modify DSH's built-in plugins and could in principle be split into standalone plugins are better enabled/disabled by install/uninstall than a toggle. So we removed the slider and restored DSH's original model picker; install the reference repo [@HanaAyane/dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort) directly if you want that experience.
- **Prompt optimization is always on**: the settings toggle was removed and the feature stays enabled; the detailed configuration (optimize model, thinking effort, prompt, context turns) remains available.
- **README adds a note "On settings toggles"**: for features that modify DSH's built-in plugins and could in principle be split into standalone plugins, enable/disable them by installing/uninstalling — BetterInput no longer offers kill-switches for core features, and anything that can be split out already has been (or is covered by a third-party plugin).

### Docs

- **Changelog tracking starts with this version**: Chinese is authoritative; the English mirror is maintained in the same repo.

## [0.1.3] and earlier

A changelog was not kept before; the following is a summary of the major milestones reconstructed from Git history:

- **Voice input + AI polishing**: browser speech recognition transcripts, then reuse models already configured in dsh to polish the text (fillers, homophone fixes, punctuation), with settings for recognition language, recording limit, polish model, polish thinking effort and custom polish prompt.
- **One-click prompt optimization**: optimize the prompt in the input box with an LLM, shipped together with thinking-effort control; settings for optimize model, optimize thinking effort and custom optimize prompt. (Thinking-effort control was introduced here, later evolving into the slider interaction in this version before being removed.)
- **Follow the DSH language switch**: switch between Chinese/English along with the dsh UI via the locale runtime.
- **Check for updates**: the "About & Updates" section in Settings can check for new versions and shows update commands both for a globally installed dsh CLI and for the npx fallback; it also displays version, license and repository info.
- **Compatibility with DSH 0.1.0-rc.8**: unified dependency version ranges; confirmed image input is natively supported by DSH and removed the old image-plugin description.
- **Docs and release assets**: bilingual README (project banner, design references, input-enhancement roadmap) and npm version/downloads badges.

(This is a summary for 0.1.3 and earlier; see Git history for the individual changes.)
