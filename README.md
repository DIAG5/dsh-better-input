# dsh-better-input

Better input experience for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH).

Planned features:

- ✅ **Voice input** — speak into the composer, transcript streams into your draft in real time
- ✅ **AI polishing** — clean the transcript with the LLM (fillers, homophone fixes, punctuation)
- ✅ **Settings page** — recognition language, recording limit, polish model and prompt
- 🔜 PDF to model-friendly format
- 🔜 Image input

## Requirements

- DSH `0.1.0-rc.6` or newer
- Node.js `^22.19.0 || >=24.0.0`
- A Chromium-based browser (Chrome / Edge) for the built-in speech recognition

## Install

```sh
# via the dsh CLI (recommended)
dsh plugin --profile web add dsh-better-input

# without the CLI
npx -y @deepseek-ai/dsh plugin --profile web add dsh-better-input

# from a local clone (development)
dsh plugin --profile web add "$PWD"
```

Or add it to your preset's `cordis.yml` / patch manually:

```yaml
- insert:
    - id: dsh-better-input
      name: dsh-better-input
```

## Usage

### Voice input

1. Open a conversation in the web UI.
2. Click the microphone button on the right side of the composer input row.
3. Speak — the transcript streams into your draft in real time.
4. Click the button again (or press **Stop** in the recognition bar) to finish.
5. Review, edit, and send as usual.

> Voice recognition runs entirely in your browser via the Web Speech API — no
> API key, no server round-trip. Unsupported browsers show a disabled button.

### AI polishing

Open **Settings → BetterInput** and enable **AI polishing**, then pick a model
route (any model already configured in dsh's own model settings — no extra API
key needed).

When enabled, the committed transcript is polished by the Host LLM before it
stays in your draft. The built-in prompt removes fillers, fixes ASR homophone
errors (根木鹿 → 根目录, 脱肯 → Token), restores punctuation, and formats
spoken enumerations as lists. If you edit the draft while polishing runs, the
polished result does **not** overwrite your edits; on failure the original
transcript is kept.

You can also paste a custom polish prompt in the settings page; the output
contract guard (plain text, never an answer) is always appended.

### Settings

| Setting | Meaning |
| --- | --- |
| Recognition language | Empty follows the browser language (e.g. `zh-CN`, `en-US`) |
| Recording limit | Max seconds per recording (1–600) |
| AI polishing | Enable/disable Host LLM polishing |
| Polish model | The dsh model route used for polishing |
| Custom polish prompt | Optional replacement of the built-in prompt |

## Development

```sh
npm install
npm run check     # typecheck
npm run build     # build lib/ (host ESM + browser client bundle)
```

Client-only UI changes: rebuild (or `npm run dev:watch`) and refresh the web UI.
Host changes: restart `dsh web`, then refresh.

## Architecture

- `src/index.ts` — Host plugin entry, mounts the polish service
- `src/polish/service.ts` — `BetterInputPolishService` (Typert remote): settings, dsh route discovery, LLM polishing via `ctx.llm`
- `src/client/` — browser half: microphone button (`conversation.input.right`), recognition bar (`conversation.input.dock`), settings page (`settings.section`)
- `src/typert.ts` / `src/remote.ts` — Typert wire contract and Client remote types

## Roadmap

- PDF conversion
- Image input
- More ASR backends (local Whisper, cloud)

## License

MIT
