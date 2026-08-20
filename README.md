<h1 align="center">🎤 dsh-better-input</h1>

<p align="center"><b>给 DeepSeek Harness 的智能体换一副更顺手的「输入」。</b></p>

<p align="center">
  开源输入体验增强插件 · BetterInput for your DeepSeek Harness agent
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

> 💡 **它解决什么？** 与智能体对话，输入不该只有键盘打字。语音说出来、图片贴进来、PDF 甩进来、提示词一键优化——**把你能想到的一切「输入」，全部变成与智能体顺畅交谈的方式**。这才是 BetterInput 的意义：不只是语音，是更好的输入。

---

## ✨ 目前已实现

<table>
<tr><th align="center" width="120">模块</th><th align="left">说明</th></tr>
<tr>
<td align="center">🎙️<br/><b>语音输入</b></td>
<td>点击麦克风，边说边转写，文字<strong>实时流式</strong>进入输入框。浏览器原生识别，<strong>无需 API Key</strong>。</td>
</tr>
<tr>
<td align="center">🤖<br/><b>AI 润色</b></td>
<td>识别后自动清理：去口头禅、修同音错字（根木鹿→根目录、脱肯→Token）、补标点、把口语列举转成编号列表。<strong>复用 dsh 已配置的模型，无需额外 Key</strong>。</td>
</tr>
<tr>
<td align="center">🐘<br/><b>防覆盖保护</b></td>
<td>润色进行中你手动改了草稿，结果<strong>不会覆盖</strong>你的编辑；失败保留原文。</td>
</tr>
<tr>
<td align="center">⏱️<br/><b>录音自动停止</b></td>
<td>可自定义单次录音上限（1–600 秒），不占麦克风。</td>
</tr>
<tr>
<td align="center">⚙️<br/><b>可视化设置页</b></td>
<td>识别语言、录音时长、润色开关、润色模型、自定义提示词，全部在设置里配置；内置提示词可一键展开查看。</td>
</tr>
</table>

## 🗺️ 下一步（输入增强的方向）

BetterInput 的目标是成为一套完整的**输入体验增强套件**。语音只是开始，接下来围绕"让喂给智能体的每一个输入都更顺"逐步展开：

### 文字 & 提示词
- [ ] ✨ **提示词优化** — 输入框旁点一个图标，AI 帮你润色/优化写好的提示词，让提问更能命中
- [ ] 📝 **提示词模板库** — 一键插入常用模板（写代码 / 总结 / 翻译 / 角色扮演…）
- [ ] 🧹 **文本清洗** — 粘贴乱码 / 带行号 / 时间戳的文本，自动整理成干净正文
- [ ] 🔤 **即时翻译** — 写中文一键转英文给 AI（或反之）
- [ ] 📋 **智能粘贴** — 粘贴自动识别是代码 / 表格 / URL / 引用，智能包裹成合适格式

### 媒体 & 文件
- [ ] 🖼️ **图片输入** — 粘贴 / 拖拽图片，直接解决多模态输入
- [ ] 🧾 **PDF 转结构化** — PDF → AI 友好的易读格式（Markdown / 纯文本）
- [ ] 🎬 **音视频转写** — 粘贴本地音视频文件 → 转成文字（语音输入的进阶）

### 效率 & 协作
- [ ] ⏱️ **草稿恢复** — 上次没发完的草稿自动保存，随时恢复
- [ ] 🧮 **变量填充** — 输入框里用 `{{日期}}`、`{{当前目录}}` 等变量自动替换
- [ ] 📎 **快捷输入流** — 日报 / 周报等固定模板一键发送

> 以上按主题规划，会持续迭代。**有想法欢迎提 [Issue](https://github.com/DIAG5/dsh-better-input/issues) / PR**，一起把它做成更好的输入套件。

## 🚀 安装

前置：[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`>= 0.1.0-rc.6`）+ Node.js `^22.19.0 || >=24.0.0` + Chrome/Edge 浏览器。

**从 GitHub 仓库安装（推荐）：**

```sh
dsh plugin --profile web add github:DIAG5/dsh-better-input
```

还没装 `dsh` CLI？用 npx：

```sh
npx -y @deepseek-ai/dsh plugin --profile web add github:DIAG5/dsh-better-input
```

**从源码安装（开发）：**

```sh
git clone https://github.com/DIAG5/dsh-better-input.git
cd dsh-better-input
npm install
npm run build
dsh plugin --profile web add "$PWD"
```

安装后刷新 Web UI，输入框右侧会出现**麦克风图标** 🎤。也支持写进 preset 的 `cordis.yml`：

```yaml
- insert:
    - id: dsh-better-input
      name: dsh-better-input
```

## 📖 使用

### 1. 语音输入

1. 打开任意对话，点击输入框右侧的**麦克风按钮**
2. 开始说话，识别文字**实时流入**输入框
3. 再点按钮（或识别条上的**停止**）结束
4. 检查、修改、发送

> 识别完全在浏览器本地完成（Web Speech API），无需 API Key、无服务器往返。Firefox/Safari 不支持时按钮自动禁用。

### 2. AI 润色

设置 → **BetterInput** → 打开 **AI 润色** → 选择一个 dsh 里已配置的模型。

内置提示词会：去口头禅、修 ASR 同音错字、补标点、把口语列举转成编号列表（如「第一…第二…」→ `1.` `2.`）。留空用内置提示词，点「查看内置提示词」可展开原文；或粘贴自定义提示词（总会追加输出契约保护，保证只返回正文、不答非所问）。

### 3. 设置

| 设置项 | 说明 |
| --- | --- |
| 识别语言 | 留空自动跟随浏览器语言（如 `zh-CN`、`en-US`） |
| 单次录音上限 | 1–600 秒，默认 120，到点自动停止 |
| AI 润色 | 开/关 |
| 润色模型 | 选择 dsh 已配置的模型路由 |
| 自定义润色提示词 | 可选，替换内置提示词 |

## 🧩 兼容性

- DeepSeek Harness `>= 0.1.0-rc.6`
- Node.js `^22.19.0 || >=24.0.0`
- Chromium 内核浏览器（Chrome / Edge）

## 🛠️ 开发

```sh
npm install
npm run check    # 类型检查
npm run build    # 构建 lib/（Host ESM + 浏览器 bundle）
```

改 Client 端：`npm run dev:watch` 后刷新 UI；改 Host 端：重启 dsh web。

## 🏗️ 架构

- `src/index.ts` — Host 插件入口，挂载润色服务
- `src/polish/service.ts` — `BetterInputPolishService`（Typert remote）：设置、dsh 模型路由发现、LLM 润色（复用 `ctx.llm`）
- `src/client/` — 浏览器端：麦克风按钮（`conversation.input.right`）、识别条（`conversation.input.dock`）、设置页（`settings.section`）
- `src/typert.ts` / `src/remote.ts` — Client↔Host 类型化通信契约

## 📚 设计参考

本项目在架构与交互上**参考了 DSH 社区优秀的开源插件**：

- [dsh-ears](https://github.com/WizisCool/dsh-ears) — 语音输入 + 润色 + 设置页的架构范式（麦克风按钮、识别条、Typert remote、settings 槽位模式均借鉴其设计）
- [lhh010/dsh-paste-input](https://github.com/lhh010/dsh-paste-input) — DSH WebUI 输入增强的成熟做法
- [DeepSeek Harness 官方文档](https://github.com/deepseek-ai/deepseek-harness) — 插件开发 / 发布规范与 Typert / settings / llm 服务接口

本仓库 `_research/` 目录（含上述项目的克隆）仅用于本地开发参考，**已排除在 git 追踪之外**，不会随发布分发。

## 📄 License

[MIT](./LICENSE)

---

## ⭐ 支持

这个插件正在从「语音」走向「完整的输入增强套件」——觉得它值得期待？

- 点个 **Star ⭐**（你的收藏就是持续迭代的动力）
- 提交 [Issue](https://github.com/DIAG5/dsh-better-input/issues) / [PR](https://github.com/DIAG5/dsh-better-input/pulls)
- 分享给同样用 DSH 的朋友

感谢你的支持 ❤️
