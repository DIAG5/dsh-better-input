<h1 align="center">🎤 dsh-better-input</h1>

<p align="center"><b>A better input experience for DeepSeek Harness.</b></p>

<p align="center">
  Open-source input enhancement plugin for <a href="https://github.com/deepseek-ai/deepseek-harness">DeepSeek Harness</a> · voice input + AI polishing
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

```text
Speak → Transcribe → AI polish → Editable draft → Send
```

> 💡 **What problem does it solve?** Typing slow or too lazy for long sentences? Talk into the composer and watch the text stream in; stutters, filler words and ASR homophone errors are cleaned up by AI into neat copy. **No extra API key needed** — polishing reuses the models you've already configured in dsh.

---

## ✨ Features

- [x] 🎙️ **Voice input** — click the mic and speak; the transcript streams into your draft in real time (browser-native recognition, no API key, no server round-trip)
- [x] 🤖 **AI polishing** — auto-cleanse after recognition: drop fillers, fix homophone errors (根木鹿→根目录, 脱肯→Token), restore punctuation, and turn spoken enumerations into lists
- [x] 🐘 **Edit-safe override guard** — if you edit the draft while polishing runs, the result **won't** overwrite your edits; on failure the original is kept
- [x] ⏱️ **Auto-stop recording** — configurable per-session recording limit, never holds the mic forever
- [x] ⚙️ **Built-in settings page** — recognition language, recording limit, polish toggle, polish model, custom prompt — all visual
- [x] 🔎 **Viewable built-in prompt** — expand the default polish prompt in settings for reference/adaptation
- [ ] 📄 **PDF → model-friendly format** (planned)
- [ ] 🖼️ **Image input** (planned)

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

> Recognition happens fully in your browser via the Web Speech API — no API key, no server round-trip. It's auto-disabled in unsupported browsers (Firefox/Safari).

### 2. AI polishing

Settings → **BetterInput** → enable **AI polishing** → pick a model already configured in dsh.

The built-in prompt removes fillers, fixes ASR homophone errors, restores punctuation, and formats spoken enumerations ("first… second…") into numbered lists (`1. ` `2. `). Leave blank to use the built-in prompt (expanded via **Show the built-in prompt**), or paste a custom prompt (the output-contract guard is always appended, so it returns clean text rather than answering).

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

## 🗺️ Roadmap

- [ ] PDF → model-friendly readable format
- [ ] Image input
- [ ] More ASR backends (local Whisper, cloud)
- [ ] One-click polish styles (concise / detailed / formal)

## 🛠️ Development

```sh
npm install
npm run check    # typecheck
npm run build    # build lib/ (host ESM + browser bundle)
```

Client-only UI: `npm run dev:watch`, then refresh the UI. Host changes: restart dsh web.

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

Enjoying this plugin? Feel free to:

- Give it a **Star ⭐** (your stargazes fuel development)
- File an [Issue](https://github.com/DIAG5/dsh-better-input/issues) / open a [PR](https://github.com/DIAG5/dsh-better-input/pulls)
- Share it with fellow DSH users

Thanks for your support ❤️
