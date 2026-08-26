# Changelog

Versioned release notes for this repository, maintained from here on. This is the English mirror; Chinese is authoritative — see [CHANGELOG.md](CHANGELOG.md).

## [0.1.6] - 2026-08-26

### Fixed

- **File-size limit no longer rejects image-heavy documents by mistake**: the Host previously applied a faulty conversion (`200_000 × 8` ≈ 1.6 MB) as the input cap, so any document larger than 1.6 MB but with very little text (e.g. an image-heavy PDF / Word) was refused with "file too large to convert". This is now an independent input guard, `MAX_INPUT_BYTES` (200 MB), that only blocks files large enough to risk blowing up parse memory — byte size is no longer confused with character count.

### Changed

- **Removed the character cap on conversion output**: converted Markdown is now emitted in full, no more 200,000-character truncation (`MAX_CONVERTED_CHARACTERS` deleted). Long documents, big tables and long histories are sent into the conversation intact.
- **Upload limit adjusted**: the front-end upload cap was raised from 25 MB to 200 MB, matching the Host input guard.

## [0.1.5] - 2026-08-24

### Added

- **Choose file / file-to-Markdown**: a new "Choose file" button at the top right of the composer (collapsed by default, click to expand). Convert PDF / DOCX / XLSX / PPTX / HTML / EPUB / CSV / JSON / XML and more into clean, structured Markdown, then insert it as an `@<filename>` reference chip; on send the converted text is expanded into the message. Results can be re-edited in the dock.
- **Plain-text files send directly, no conversion**: for text formats DSH already reads natively — `.txt / .md / .py / .js / .ts / .json / .yaml / .xml / .ini / .toml / .env` — files can be sent directly without conversion, covering the "bring in a file outside the workspace" case.
- **`@` candidate lists every added file**: typing `@` shows all added files; plain-text and converted documents can be inserted right away, while unconverted binary documents are flagged "convert first".

### Changed

- **Toolbar UI**: the file feature is no longer always visible — it's now a small button at the top right of the composer that expands/collapses the conversion panel (with a non-linear animation).
- **Conversion layer**: added `src/converter/`, a pure-TypeScript file-to-Markdown layer (mammoth / turndown / papaparse / SheetJS / pdfjs / jszip / fast-xml-parser), bundled on the Host only — no added browser bundle size.
- **Skip images**: images inside Word / HTML / EPUB are no longer dumped as base64 binary — they are skipped.

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
