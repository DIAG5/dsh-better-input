# Changelog

Versioned release notes for this repository, maintained from here on. This is the English mirror; Chinese is authoritative — see [CHANGELOG.md](CHANGELOG.md).

## [0.1.9] - 2026-08-31

### Fixed

- **Voice start failure no longer sticks at "recording"**: when `recognition.start()` threw synchronously (e.g. microphone permission denied), the error state was set first but then unconditionally overwritten by "recording", leaving the button stuck active with a session that had in fact already ended. A synchronous failure now keeps the error state and settles normally.
- **Duplicate filenames no longer leak internal entries**: adding a file whose name already existed wrote a new conversion-panel store entry before the dedupe check, leaving an orphan entry with no UI reference on every duplicate. The dedupe check now runs first; the store is written only when the file is accepted.
- **Uppercase plain-text extensions no longer misreport "unsupported file type"**: files like `README.MD`, `NOTES.TXT` or `script.PY` previously failed to match the lowercase extension table and were misjudged as non-convertible. Extensions are now lowercased before lookup.
- **HTML conversion no longer leaks a literal " head " into the output**: the `</head>` cleanup regex substituted the capture group as replacement text, turning every `</head>` into a visible " head ". It is now replaced with whitespace.
- **Huge CSV conversion no longer crashes**: table width was computed via `Math.max(...spread)`, which overflows the call stack on six-figure row counts (RangeError). Width is now accumulated in a loop; when data rows are wider than the header, the header is padded with column names so the Markdown table stays well-formed.
- **Excel truncation now warns**: sheets beyond 5,000 rows were silently dropped. The conversion result now carries a warning: "sheet X exceeds 5,000 rows, keeping the first 5,000".
- **"No conversion needed, send directly" notice no longer shows as a red error**: the notice previously reused the error toast; it now uses the neutral info toast (consistent with the unconfigured-OCR prompt).

### Changed

- **ZIP nested-conversion entry hoisted out of the loop**: the dynamic `import('to-markdown.js')` now resolves once before the loop instead of once per entry. It remains a function-level lazy import, so the module-level cycle avoidance is untouched.

## [0.1.8] - 2026-08-29

### Fixed

- **Full dark-theme adaptation**: the plugin previously used self-invented `--dsh-color-*` variables (undefined in DSH), leaving the confirm dialog, error toasts, and the file panel white-on-white under the dark theme. Everything now uses DSH's official theme tokens (`--dsw-alias-*`), so the whole plugin UI follows light/dark automatically. Thanks to [@virggle](https://github.com/virggle) for the contribution (#2 / #3).
- **Settings dropdowns unreadable in dark theme**: a native `<select>` popup cannot be transparent and falls back to a white background, which combined with light label text in dark mode made options nearly invisible (e.g. "Reasoning Effort"). All dropdowns, inputs, and textareas in Settings now use the background token and render correctly in both themes.
- **Ctrl+A inside the optimize compare box selects only that block**: pressing Ctrl/Cmd+A within the original/optimized panes now selects just that pane's text instead of the whole page.
- **Drag-select release no longer closes the dialog**: finishing a text selection by releasing the mouse over the overlay no longer closes the dialog nor loses the selection (the same guard applies to the error toast).
- **Error text and recording dot now use theme tokens**: three previously hardcoded reds (#e5484d) — the settings error hints, the update notice, and the voice-recording dot — now follow the theme as well.

## [0.1.7] - 2026-08-27

### Fixed

- **Fix startup failure on some Node versions**: `lib/` is emitted as ESM, and `pdf.ts`'s top-level `import { getDocument } from "pdfjs-dist/legacy/build/pdf.js"` relies on Node's static analysis (cjs-module-lexer) to detect named exports from the CommonJS bundle. That detection is inconsistent across Node versions, so some environments crash on plugin load with `Named export 'getDocument' not found`. It now uses a function-level dynamic `await import()`, matching the existing pattern in `ocr.ts`, and no longer depends on named-export detection of the CJS artifact — stable on every Node version. Thanks to [@kennyxiongxy](https://github.com/kennyxiongxy) for the contribution.

## [0.1.6] - 2026-08-26

### Added

- **OCR vision recognition (scanned PDF / PPT)**: after adding a PDF or PPT and clicking "Start conversion", you're asked whether to use OCR. When chosen, PDF pages are rendered to images (or PPT `ppt/media/` embedded images are extracted) and sent one at a time to the "OCR vision model" you configure separately in Settings, producing Markdown — ideal for scanned documents, image-only PDFs, and PPTs whose slides are pictures without a text layer.
- **OCR vision model setting**: a new "OCR vision model" dropdown in Settings picks the vision model used to read scanned pages / embedded images. It is **independent of the polish model** and must be selected separately; without one, OCR is unavailable.
- **Soft prompt when no model is configured**: without an OCR model, clicking "Use OCR" shows a neutral info toast guiding you to Settings instead of a red error.
- **OCR modality guard**: before converting, the selected model's declared input modalities are checked; if it explicitly does not support image input, you're told upfront "this model does not support image input" instead of getting a confusing empty result.
- **Settings section headings**: the Settings page now groups "Voice Recognition" and "Prompt Polishing" under their own section titles.

### Fixed

- **File-size limit no longer rejects image-heavy documents by mistake**: the Host previously applied a faulty conversion (`200_000 × 8` ≈ 1.6 MB) as the input cap, so any document larger than 1.6 MB but with very little text (e.g. an image-heavy PDF / Word) was refused with "file too large to convert". This is now an independent input guard, `MAX_INPUT_BYTES` (200 MB), that only blocks files large enough to risk blowing up parse memory — byte size is no longer confused with character count.
- **pdfjs Node render warning**: fixed the "Cannot polyfill DOMMatrix/Path2D" warning that fell back to `node-canvas` during PDF rendering — the equivalents are now supplied by `@napi-rs/canvas`, and pdfjs loads only after the globals are in place.

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
