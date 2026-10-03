# 更新日志

本仓库的版本记录从这里开始，持续维护。中文内容以本文件为准，英文镜像见 [CHANGELOG.en.md](CHANGELOG.en.md)。

## [0.2.4] - 未发布

### 改动

- **跟进 dsh 0.2.0，整体迁移到 0.2.0-rc.2 轨**：最低 dsh 要求上调至 `>= 0.2.0-rc.2`——peer 范围收紧为 `>= 0.2.0-rc.2 <0.3.0-0`（不再声明兼容 0.1.x 轨），dev 依赖的 12 个类型包（`dsh-client-ui-conversation` / `dsh-client-ui-chat` / `dsh-client-ui-slots` / `dsh-client-ui-input-trigger` / `dsh-client-ui-settings` / `dsh-client-store` / `dsh-client-locale` / `dsh-api-remotes` / `dsh-llm` / `dsh-settings` / `dsh-typert-protocol` / `dsh-attachment`）统一升级到 `0.2.0-rc.2`；同时把 `@deepseek-ai/cordis` 提到 `~4.0.4`、`@deepseek-ai/schemastery` 提到 `~3.18.4`，与 0.2.0 各子包声明的 peer 要求对齐，避免安装期 ERESOLVE。
- **修复宿主启动失败：适配 Typert 协议的 codec 破坏性变更**：0.2.0 的 `typert-loader` 要求 strict codec 提供 `create()` 工厂，不再接受静态 `schema` 字段。旧格式下宿主启动会报 `result codec has no create() factory`，使插件条目无法激活（`1 entry did not activate`）。现把 `typert.ts`（宿主面 manifest）与 `remote.ts`（客户端面 contribution）中全部 27 处 codec——含各方法的 result 与 parameter——由 `schema: <Schema>` 改为 `create: () => <Schema>`，以消除该启动报错。
- **适配 settings API 重构**：0.2.0 移除了 `SettingsScope` 具名导出与 `SettingsForms.register()`，插件 config 改由 Loader 依据插件自身的 `Config` schema 建条目、并据此自动生成设置页。现新增 `static Config`，读写改走 `ctx.settings.describe()` / `ctx.settings.update()`；因插件自带 `settings.section` 设置界面，调用 `ctx.settings.configure({ auto: false })` 关闭原生自动页，避免出现重复的设置入口。客户端设置界面走 Typert RPC 的读写路径不变。

## [0.2.3] - 未发布

### 改动

- **跟进 dsh 0.1.5-rc.1 并保持向后兼容**：peer 依赖保持 `>= 0.1.2-rc.1 <0.2.0-0`（该范围天然同时覆盖 0.1.2 与 0.1.5 两轨），dev 依赖的类型包（`dsh-client-ui-conversation` / `dsh-client-ui-chat` / `dsh-client-ui-slots` / `dsh-client-ui-input-trigger` / `dsh-client-ui-settings` / `dsh-client-store` / `dsh-client-locale` / `dsh-api-remotes` / `dsh-llm` / `dsh-settings` / `dsh-typert-protocol` / `dsh-attachment`）统一升级到 `0.1.5-rc.1`。已在官方 0.1.5-rc.1 下实测：核心槽位（`conversation.input.dock` / `conversation.input.right` / `settings.section`）契约未变，与旧版无冲突；0.1.5 新增的通用文件上传为 Composer 私有能力、未暴露给插件，故文件转 Markdown / OCR 入口维持现状。

## [0.2.2] - 未发布

### 改动

- **彻底跟进 dsh 0.1.2-rc.1，移除已废弃的 `@deepseek-ai/dsh-client-runtime` 依赖**：该聚合包在 0.1.2 已被官方移除，此前的 0.2.1 修复仍停留在旧 runtime 轨。现整体迁移到 0.1.2 轨——`ClientContext` 改用官方统一的 cordis `Context` 别名；服务端相关 5 包（`dsh-api-remotes` / `dsh-llm` / `dsh-settings` / `dsh-typert-protocol` / `dsh-attachment`）升级到 `0.1.2-rc.1` 轨；新增 `@deepseek-ai/dsh-client-ui-chat` 依赖以读取消息历史。
- **提示词优化取会话上下文改用 `useChat` + `chat.legacy.nodes`**：消息历史数据源统一为 Chat 目标的 `legacy.nodes`。因 0.1.2 拆分后 `ConversationNode` 类型依赖的第三方类型包（`dsh-commands` / `dsh-llm-retry` / `dsh-tool-todo`）不随插件安装、在 `skipLibCheck` 下会整体塌陷成 `any`，现改用本地最小结构类型 `ConversationNodeView` 读消息文本，不依赖相关包的类型解析。
- **移除已被删除的 `settingsNamespace()` 调用**：0.1.2 中 `SettingsNamespace` 由函数变为 branded 类型，`settings.register` 直接接收 namespace 字面量，`validate` 选项签名保持兼容。
- **为宿主注入的 `slots` 服务补齐编译期类型**：0.1.2 移除了携带 `ctx.slots` augmentation 的 runtime 包，且该服务类型不再随任何插件依赖包发布。遵循官方生态约定（插件自声明最小 ClientContext，参见 dsh-routing-suite），新增 `slots.d.ts` ambient 声明——`register` 复用 `@deepseek-ai/dsh-client-ui-slots` 的 `SlotCore` 强类型契约，并补宿主独有的 `inject(name, contribute)` 装配面。

## [0.2.1] - 2026-09-07

### 修复

- **兼容 dsh 0.1.2-rc.1 的 UI 注入重构**：该版本对 `conversation.input.right` 槽位做了破坏性调整，不再向条目标签注入 owner 的 `input` / `session` 属性，导致麦克风与提示词优化两个按钮渲染失败、从输入框消失。现改用框架标准 `useInput` / `useSession` hook 读取草稿与对话快照，不再依赖被移除的 owner 属性。
- **修复点击「提示词优化」报 `session.nodes is not iterable`**：dsh 0.1.2 重构图快照结构，顶层 `nodes` 字段运行时已不是数组，有序消息数组迁移到 `chat.legacy.nodes`。上下文提取改为防御式读取：优先取数组，取不到时回退到 `chat.legacy.nodes`，不再对对象做迭代而崩溃。

### 改动

- **依赖与构建修复**：固定 `@deepseek-ai/dsh-attachment` 到兼容轨 `0.1.1-rc.2`（此前自由解析会拉到不兼容的 0.0.x 轨，连带 `dsh-brand` / `dsh-invariants` 版本冲突导致 `npm install` 报 ERESOLVE）；补装 `@deepseek-ai/dsh-client-ui-settings` 与 `@deepseek-ai/dsh-client-store` 两个类型包（提供 `settings.section` 槽位增强与 `SnapshotSelectorHook` 类型），消除构建期类型错误。

## [0.2.0] - 2026-09-02

### 新增

- **提示词模板库**：把常用提示词（写代码 / 总结 / 翻译 / 角色扮演…）存成模板，随用随插。设置 → BetterInput → 「提示词模板」中新建 / 编辑 / 删除，每个模板含名称、描述（可选）、正文与标签（可选，逗号分隔，用于搜索）；列表按最近更新排序。数据全部保存在宿主本地 `~/.dsh/better-input/templates.json`，不经服务器、不上传；写入走「临时文件 + 原子重命名」，文件意外损坏时自动隔离为 `*.corrupt-<时间戳>` 并重建，不影响使用。
- **输入框键入 `/` 唤起模板**：键入 `/` 即弹出模板候选，继续输入按名称 / 描述 / 标签实时过滤（最多列出 50 条）；选中后模板正文直接替换 `/` 词段插入输入框，可继续修改再发送。输入框挂载时即预热模板列表，首次键入 `/` 就有候选。
- **模板限额**：最多 200 个模板；名称 ≤ 60 字、描述 ≤ 200 字、正文 ≤ 8000 字、标签 ≤ 8 个（单个 ≤ 20 字，保存时自动去空白、去重、忽略大小写）。

## [0.1.9] - 2026-08-31

### 修复

- **语音启动失败不再卡在「录音中」**：此前麦克风权限被拒等场景下，`recognition.start()` 同步抛错会先把状态置为错误，但外层紧接着无条件覆盖成「录音中」，按钮卡在高亮态、点停止无效（会话其实早已结束）。现在同步失败后保留错误态并正常回落。
- **重名文件不再产生多余的内部条目**：添加与已有文件同名的文件时，此前会先写入转换面板的 store 再查重，留下一条没有任何界面引用的孤儿条目（每重名一次泄漏一条）。现在先查重，通过后才写入。
- **大写扩展名的纯文本文件不再误报「不支持的文件类型」**：`README.MD`、`NOTES.TXT`、`script.PY` 等此前命中不了小写的扩展名表，走到格式探测后被误判为不可转换。现在扩展名统一转小写后再识别。
- **HTML 转换不再混入字面词 " head "**：此前清理 `</head>` 的正则误把捕获组当替换文本，每个 `</head>` 都变成可见的 " head " 混进正文。现在直接以空白替换。
- **超大 CSV 转换不再崩溃**：表格宽度此前用 `Math.max(...spread)` 计算，十万行级的文件会因展开超出调用栈直接 RangeError。现改为循环累进；同时数据行比表头宽时表头会自动补齐列名，Markdown 表格不再畸形。
- **Excel 超 5000 行截断时给出提示**：此前单个工作表超过 5000 行会静默丢弃后续行。现在转换结果的警告里会注明「工作表 X 超过 5000 行，仅保留前 5000 行」。
- **「无需转换可直接发送」提示不再显示为红色报错**：该提示此前误用了错误 toast，现改用中性信息提示（与 OCR 未配置的提示一致）。

### 改动

- **ZIP 转换的嵌套转换入口提升到循环外**：动态 `import('to-markdown.js')` 从循环内移到循环前一次解析，仍是函数内懒加载、不影响规避模块级循环依赖的设计，减少重复 await 开销。

## [0.1.8] - 2026-08-29

### 修复

- **深色主题全面适配**：此前插件使用自造的 `--dsh-color-*` 变量（在 DSH 中并不存在），确认弹窗、错误提示、文件面板等在深色主题下呈白底白字。现全部替换为 DSH 官方主题令牌（`--dsw-alias-*`），插件全部 UI 跟随深浅色自动切换。感谢 [@virggle](https://github.com/virggle) 的贡献（#2 / #3）。
- **深色主题下设置页下拉展开看不清**：原生下拉的弹出列表不支持透明背景，会回退为白底，与深色主题下的浅色文字叠加后几乎不可读（如「优化思考强度」）。现设置页全部下拉、输入框、文本域统一改用背景令牌，深浅两色下均正常。
- **Ctrl+A 在优化对比框内只选当前文本块**：在原文/优化后对比框内按 Ctrl/Cmd+A，现在只全选所在文本块，而非整个页面。
- **框选文本松手不再误关对话框**：此前在对比框内拖选文字、鼠标在对话框外松开会误关弹窗并丢失选区，现忽略该次点击并保留选区（错误提示的点击关闭同样处理）。
- **错误提示与录音指示点颜色改用主题令牌**：设置页错误提示、更新提示、语音录音红点共 3 处硬编码红色（#e5484d）现同样跟随主题。

## [0.1.7] - 2026-08-27

### 修复

- **修复插件在部分 Node 版本下启动失败**：`lib/` 以 ESM 输出，`pdf.ts` 顶层 `import { getDocument } from "pdfjs-dist/legacy/build/pdf.js"` 对 CommonJS bundle 的命名导出依赖 Node 的静态分析（cjs-module-lexer），不同 Node 版本下识别结果不一致，部分环境在加载插件时即报 `Named export 'getDocument' not found` 导致 `dsh web` 启动崩溃。现改为函数内动态 `await import()`，与 `ocr.ts` 的既有做法保持一致，不再依赖对 CJS 产物的命名导出识别，任何 Node 版本下都稳定。感谢 [@kennyxiongxy](https://github.com/kennyxiongxy) 的贡献。

## [0.1.6] - 2026-08-26

### 新增

- **OCR 视觉识别（扫描 PDF / PPT）**：添加 PDF 或 PPT 后点「开始转换」，会询问"是否使用 OCR"。选择后把 PDF 逐页渲染成图片、或抽取 PPT 内嵌图片，交给你在设置页单独配置的「OCR 视觉模型」逐张转为 Markdown——适合扫描件、图片型 PDF、仅有内嵌图的 PPT 等没有文本层的文档。
- **OCR 视觉模型设置项**：设置页新增「OCR 视觉模型」下拉，用于选择识别扫描页 / 内嵌图片的视觉模型。该模型**独立于润色模型**，需单独选择，未选择时无法使用 OCR。
- **未配置模型时柔提示**：未配置 OCR 模型时点「使用 OCR」，只会弹出中性提示引导去设置页，不会显示红色报错。
- **OCR 模态探测**：转换前检查所选模型是否**明确声明不支持图片输入**，是则提前提示"该模型不支持图片输入"，避免无效调用与困惑的空白结果。
- **设置页分节小标题**：设置页为「语音识别」「提示词润色」两块各增加分区小标题。

### 修复

- **文件大小限制不再误伤「图多字少」的文件**：此前 Host 端用一个错误的换算（`200_000 × 8` ≈ 1.6MB）当输入上限，导致比 1.6MB 大但文字其实很少的文档（如图片很多的 PDF / Word）被直接判定「文件过大，无法转换」。现已改为独立的输入护栏 `MAX_INPUT_BYTES`（200MB），只拦截会撑爆解析内存的极端文件，不再把「字节大小」误当成「字符多少」来卡。
- **pdfjs Node 端渲染警告**：修复 PDF 渲染时因缺少 `DOMMatrix` / `Path2D` 全局而回退到 node-canvas 引发的 "Cannot polyfill" 警告——现改用 `@napi-rs/canvas` 提供的实现，并让 pdfjs 在全局就绪后再加载。

### 改动

- **移除转换结果的字符数截断**：转换后的 Markdown 现在是多少就完整输出多少，不再有 20 万字符截断（`MAX_CONVERTED_CHARACTERS` 已删除）。长文档、大表格、长史谱都能完整送进对话。
- **前端上传上限调整**：上传上限从 25MB 放宽到 200MB，与 Host 端输入护栏一致。

## [0.1.5] - 2026-08-24

### 新增

- **选择文件 / 文件转 Markdown**：输入框右上角新增「选择文件」按钮（默认收起，点击展开）。支持把 PDF / DOCX / XLSX / PPTX / HTML / EPUB / CSV / JSON / XML 等各类文件转成结构清晰的 Markdown，再以 `@<文件名>` 引用芯片的方式插入输入框，发送时自动把转换结果展开成正文。转换结果可在 dock 中二次编辑。
- **纯文本文件免转换直接发送**：对于 `.txt / .md / .py / .js / .ts / .json / .yaml / .xml / .ini / .toml / .env` 等 DSH 原生即可读取的文本文件，无需转换即可直接发送——满足只想引入非工作区文件的场景。
- **`@` 候选列出所有已选文件**：输入 `@` 时可看到所有已添加的文件；纯文本与已转换的文档可直接选入，未转换的二进制文档会提示「请先转换」。

### 改动

- **工具栏 UI**：文件功能不再常驻显示，改为输入框右上角一个小按钮，点击展开/收起转换面板（带非线性动画）。
- **转换层**：新增 `src/converter/` 纯 TypeScript 文件转 Markdown 层（mammoth / turndown / papaparse / SheetJS / pdfjs / jszip / fast-xml-parser），仅在 Host 端打包，不增加浏览器包体积。
- **图片跳过**：Word / HTML / EPUB 内的图片不再输出成 base64 二进制，而是直接跳过。

## [0.1.4] - 2026-08-23

### 新增

- **提示词优化支持上下文引用**：优化时可引用最近 N 轮对话作为语境（设置页「上下文引用轮数」，0 为关闭，默认 3 轮），让优化更贴合当前会话。

### 改动

- **移除对话栏思考强度滑块**：本插件在开发过程中曾成功实现 Codex 风格的思考强度滑块——自定义 `EffortSlider` / `ModelSelector` 替换 DSH 原版的 `conversation.input.model`，支持拖动、释放吸附、满档发光特效等交互，并在设置页配了一个开关。但实测下来，**「在设置页加开关」这个交互很别扭**：对于这类改动 DSH 核心自带插件、理论上可以剥离成独立插件的功能，用安装/卸载来启停才是顺手的方式，而不是在 BetterInput 里多一个 toggle。经过思考，本插件最终**移除该滑块**，恢复使用 DSH 原版模型选择器；想要这种交互体验，可直接安装参考仓库 [@HanaAyane/dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort)。
- **提示词优化改为常驻开启**：设置页移除「提示词优化」开关，该功能始终保持开启；优化模型、思考强度、提示词、上下文轮数等详细配置项仍保留，供用户按需调整。
- **README 新增「关于设置里的开关」理念说明**：对于改动 DSH 核心自带插件、原则上可剥离为独立插件的功能，通过安装/卸载来启用与停用，BetterInput 不再为核心功能提供关闭渠道，凡能剥离的都已剥离（或兼容他人开发的插件）。

### 文档

- **从本版本起维护更新日志**：中文权威，英文镜像同仓库维护。

## [0.1.3] 及更早

此前未建立更新日志，以下为依据 Git 提交记录梳理的主要进展摘要：

- **语音输入 + AI 润色**：浏览器语音识别转录，复用 dsh 中已配置的模型对转写文本做 AI 润色（去口头禅、修正同音错字、加标点），并提供识别语言、单次录音上限、润色模型、润色思考强度、自定义润色提示词等设置。
- **提示词一键优化**：用大模型优化输入框里的提示词，并随附思考强度控制；提供优化模型、优化思考强度、自定义优化提示词等设置。（「思考强度控制」也由此引入，后演化为本版本的滑块交互并被移除。）
- **跟随 DSH 语言切换**：通过 locale runtime 跟随 dsh 界面在中文/英文间切换。
- **检查更新**：设置页「关于与更新」区可检查新版本，并按「全局已安装 dsh CLI」或「未全局安装改用 npx」两种方式给出更新命令；同时展示版本、许可证、仓库地址等信息。
- **兼容 DSH 0.1.0-rc.8**：统一依赖版本范围；确认图片输入已由 DSH 原生支持，移除旧图片插件描述。
- **文档与发布物料**：中英双语 README（项目 banner、设计参考、输入增强路线等）、npm version/downloads 徽章等。

（以上为 0.1.3 及更早的摘要，逐条改动请参见 Git 提交记录。）
