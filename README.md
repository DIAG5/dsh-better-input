<h1 align="center">🎤 dsh-better-input</h1>

<p align="center"><b>给 DeepSeek Harness 换一副更顺手的输入法。</b></p>

<p align="center">
  <a href="https://github.com/deepseek-ai/deepseek-harness">DeepSeek Harness</a> 的开源输入增强插件 · 语音输入 + AI 润色
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
说出 → 转写 → AI 润色 → 可编辑草稿 → 发送
```

> 💡 **它解决什么？** 打字慢、懒得敲长句？对着输入框说话，文字实时流出；口误、口头禅、同音错字，AI 一键润色成工整正文。**不用额外 API Key**，润色直接复用你在 dsh 里已配置的模型。

---

## ✨ 功能特性

- [x] 🎙️ **语音输入** — 点击麦克风，边说边转写，文字实时流式进入输入框（无需 API Key，浏览器原生识别）
- [x] 🤖 **AI 润色** — 识别后自动清理：去口头禅、修同音错字（根木鹿→根目录、脱肯→Token）、加标点、口头列举转列表
- [x] 🐘 **智能防覆盖** — 润色进行中你手动改了草稿，润色**不会覆盖**你的编辑；失败保留原文
- [x] ⏱️ **录音自动停止** — 可自定义单次录音上限，不占麦克风
- [x] ⚙️ **内置设置页** — 识别语言、录音时长、润色开关、润色模型、自定义提示词，全部可视化配置
- [x] 🔎 **内置提示词可查看** — 设置页一键展开内置润色提示词，方便参考/改编
- [ ] 📄 **PDF 转易读格式**（规划中）
- [ ] 🖼️ **图片输入**（规划中）

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

内置提示词会：去口头禅、修 ASR 同音错字、补标点、把口语列举转成编号列表（如「第一…第二…」→ `1. ` `2. `）。留空用内置提示词，点「查看内置提示词」可展开原文参考；或粘贴自定义提示词（总会追加输出契约保护，保证只返回正文不答非所问）。

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

## 🗺️ Roadmap

- [ ] PDF → 模型友好的易读格式
- [ ] 图片输入
- [ ] 更多识别后端（本地 Whisper、云端 ASR）
- [ ] 一键切换润色风格（简洁 / 详细 / 正式）

## 🛠️ 开发

```sh
npm install
npm run check    # 类型检查
npm run build    # 构建 lib/（Host ESM + 浏览器 bundle）
```

改 Client 端：`npm run dev:watch` 后刷新 UI；改 Host 端：重启 dsh web。

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

觉得这个插件好用？欢迎：

- 点个 **Star ⭐**（你的收藏就是我的动力）
- 提交 [Issue](https://github.com/DIAG5/dsh-better-input/issues) / [PR](https://github.com/DIAG5/dsh-better-input/pulls)
- 分享给同样用 DSH 的朋友

感谢你的支持 ❤️
