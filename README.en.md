<h1 align="center">🎤 dsh-better-input</h1>

<p align="center"><b>A better way to feed your DeepSeek Harness agent.</b></p>

<p align="center">
  Open-source input-experience enhancement plugin for <a href="https://github.com/deepseek-ai/deepseek-harness">DeepSeek Harness</a>
</p>

<p align="center">
  <a href="./README.en.md">English</a> · <a href="./README.md">简体中文</a>
</p>

<p align="center">
  <a href="https://shields.io"><img src="https://img.shields.io/badge/dsh-%3E%3D%20rc.6-blue?style=flat-square" alt="DSH"></a>
  <img src="https://img.shields.io/badge/platform-Chrome%20%7C%20Edge-1a73e8?style=flat-square" alt="Platform">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT"></a>
  <a href="https://github.com/DIAG5/dsh-better-input/stargazers"><img src="https://img.shields.io/github/stars/DIAG5/dsh-better-input?style=flat-square" alt="Stars"></a>
</p>

> 💡 **What problem does it solve?** Talking to an agent shouldn't mean only typing on a keyboard. Say it, paste an image, drop a PDF, one-click optimize your prompt — **turn every way you can input into a smoother way to converse with your agent**. That's what BetterInput means: not just voice, a better input.

---

## ✨ Implemented today

<table>
<tr><th align="center" width="120">Module</th><th align="left">Description</th></tr>
<tr>
<td align="center">🎙️<br/><b>Voice input</b></td>
<td>Click the mic and speak; transcript <strong>streams</strong> into the draft in real time. Browser-native recognition, <strong>no API key</strong>.</td>
</tr>
<tr>
<td align="center">🤖<br/><b>AI polishing</b></td>
<td>Auto-cleanse after recognition: drop fillers, fix homophone errors (根木鹿→根目录, 脱肯→Token), restore punctuation, turn spoken enumerations into lists. <strong>Reuses your configured dsh models</strong> — no extra key.</td>
</tr>
<tr>
<td align="center">🐘<br/><b>Edit-safe guard</b></td>
<td>If you edit the draft while polishing runs, the result <strong>won't</strong> overwrite your edits; on failure the original is kept.</td>
</tr>
<tr>
<td align="center">⏱️<br/><b>Auto-stop recording</b></td>
<td>Configurable per-session recording limit (1–600 s), never holds the mic forever.</td>
</tr>
<tr>
<td align="center">⚙️<br/><b>Visual settings page</b></td>
<td>Recognition language, recording limit, polish toggle/model, custom prompt — all configured in settings; the built-in prompt is one click away.</td>
</tr>
</table>

## 🗺️ Next (directions for better input)

BetterInput aims to grow into a complete **input-experience enhancement suite**. Voice is just the start; everything below revolves around making every input you feed an agent smoother:

### Text & prompts
- [ ] ✨ **Prompt optimization** — a one-click icon beside the input to have the AI polish / improve the prompt you wrote
- [ ] 📝 **Prompt template library** — one-click insert of common templates (coding / summarize / translate / role-play…)
- [ ] 🧹 **Text cleaning** — paste messy / line-numbered / timestamped text and get clean copy
- [ ] 🔤 **Instant translation** — one click to turn Chinese into English (or vice versa)
- [ ] 📋 **Smart paste** — detect code / table / URL / quote on paste and wrap it appropriately

### Media & files
- [ ] 🖼️ **Image input** — paste / drag an image to feed multimodal models
- [ ] 🧾 **PDF → structured** — PDF into an AI-friendly readable format (Markdown / plain text)
- [ ] 🎬 **Audio/video transcription** — paste a local media file and get text (an upgrade to voice input)

### Productivity & collaboration
- [ ] ⏱️ **Draft recovery** — auto-save and restore an unfinished draft
- [ ] 🧮 **Variable fill** — `{{date}}`, `{{cwd}}` and other tokens replaced automatically in the input
- [ ] 📎 **Quick input flows** — one-click send of fixed templates (daily / weekly reports)

> Planned around the theme; iterating continuously. **Ideas welcome — file an [Issue](https://github.com/DIAG5/dsh-better-input/issues) or open a PR.**

## 🚀 Install

Prereqs: [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`>= 0.1.0-rc.6`) + Node.js `^22.19.0 || >=24.0.0` + Chrome/Edge.

**From the GitHub repo (recommended):**

```sh
dsh plugin --profile web add github:DIAG5/dsh-better-input
```

No `dsh` CLI? Use npx:

```sh
npx -y @deepseek-ai/dsh plugin --profile web add github:DIAG5/dsh-better-input
```

**From source (development):**

```sh
git clone https://github.com/DIAG5/dsh-better-input.git
cd dsh-better-input
npm install
npm run build
dsh plugin --profile web add "$PWD"
```

After installing, refresh the Web UI — a **microphone icon** 🎤 appears on the right of the composer. Or add it to a preset's `cordis.yml`:

```yaml
- insert:
    - id: dsh-better-input
      name: dsh-better-input
```

## 📖 Usage

### 1. Voice input

1. Open any conversation and click the **microphone button** on the right of the input row.
2. Start speaking — recognized text **streams into** the input in real time.
3. Click again (or press **Stop** on the recognition bar) to finish.
4. Review, edit, and send.

> Recognition runs fully in your browser via the Web Speech API — no API key, no server round-trip. Auto-disabled in unsupported browsers (Firefox/Safari).

### 2. AI polishing

Settings → **BetterInput** → enable **AI polishing** → pick a model already configured in dsh.

The built-in prompt removes fillers, fixes homophone errors, restores punctuation, and formats spoken enumerations into numbered lists. Leave blank to use the built-in prompt (expand via **Show the built-in prompt**), or paste a custom prompt (the output-contract guard is always appended, so it returns clean text rather than answering).

### 3. Settings

| Setting | Meaning |
| --- | --- |
| Recognition language | Empty follows the browser language (e.g. `zh-CN`, `en-US`) |
| Recording limit | 1–600 seconds, default 120, auto-stop |
| AI polishing | On/off |
| Polish model | A dsh model route |
| Custom polish prompt | Optional replacement of the built-in prompt |

## 🧩 Compatibility

- DeepSeek Harness `>= 0.1.0-rc.6`
- Node.js `^22.19.0 || >=24.0.0`
- Chromium-based browsers (Chrome / Edge)

## 🛠️ Development

```sh
npm install
npm run check    # typecheck
npm run build    # build lib/ (host ESM + browser bundle)
```

Client-only UI: `npm run dev:watch`, then refresh the UI. Host changes: restart dsh web.

## 🏗️ Architecture

- `src/index.ts` — Host plugin entry, mounts the polish service
- `src/polish/service.ts` — `BetterInputPolishService` (Typert remote): settings, dsh route discovery, LLM polishing via `ctx.llm`
- `src/client/` — browser half: microphone button (`conversation.input.right`), recognition bar (`conversation.input.dock`), settings page (`settings.section`)
- `src/typert.ts` / `src/remote.ts` — Client↔Host typed contract

## 📚 Design references

This project **adopts architecture and interaction patterns from great open-source DSH plugins**:

- [dsh-ears](https://github.com/WizisCool/dsh-ears) — the architecture template for voice input + polishing + settings (mic button, recognition bar, Typert remote, settings slot patterns)
- [lhh010/dsh-paste-input](https://github.com/lhh010/dsh-paste-input) — mature DSH WebUI input-enhancement practices
- [DeepSeek Harness official docs](https://github.com/deepseek-ai/deepseek-harness) — plugin development / publishing spec and the Typert / settings / llm service interfaces

The `_research/` directory in this repo (containing clones of the projects above) is for local development reference only — **excluded from git tracking**, never shipped with the release.

## 📄 License

[MIT](./LICENSE)

---

## ⭐ Support

This plugin is growing from "voice" toward a **complete input-enhancement suite** — think it's worth watching?

- Give it a **Star ⭐** (your stargazes fuel continued iteration)
- File an [Issue](https://github.com/DIAG5/dsh-better-input/issues) / open a [PR](https://github.com/DIAG5/dsh-better-input/pulls)
- Share it with fellow DSH users

Thanks for your support ❤️

