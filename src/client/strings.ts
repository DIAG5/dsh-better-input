/**
 * Bilingual UI strings for dsh-better-input (zh/en). Registered as one
 * namespace into the DSH locale runtime; every slot component declares that
 * namespace and reads copy through the framework-injected `t` seat, so the
 * UI follows the DSH settings language switch automatically.
 */
export type BetterInputStrings = {
  voiceStart: string
  voiceStop: string
  voiceBusy: string
  voiceUnavailable: string
  listening: string
  transcribing: string
  polishing: string
  voiceFailed: string
  polishNotConfigured: string
  polishFailedKeepOriginal: string
  settingsTitle: string
  settingsDescription: string
  loading: string
  saveFailed: string
  languageLabel: string
  languageHint: string
  languagePlaceholder: string
  recordingLimitLabel: string
  recordingLimitHint: string
  polishLabel: string
  polishHint: string
  on: string
  off: string
  polishModelLabel: string
  polishModelHint: string
  polishModelNone: string
  polishEffortLabel: string
  polishEffortHint: string
  polishPromptLabel: string
  polishPromptHint: string
  polishPromptPlaceholder: string
  showDefaultPrompt: string
  hideDefaultPrompt: string
  defaultPromptLabel: string
  effortDefaultLabel: string
  effortLoadingLabel: string
  routesStatus: string
  routesUnavailable: string
  optimizeButton: string
  optimizeBusy: string
  optimizeFailed: string
  optimizeEmpty: string
  optimizePanelTitle: string
  optimizeOriginalLabel: string
  optimizeOptimizedLabel: string
  optimizeAdopt: string
  optimizeCancel: string
  optimizeNotConfigured: string
  optimizeSectionLabel: string
  optimizeModelLabel: string
  optimizeModelHint: string
  optimizeEffortLabel: string
  optimizeEffortHint: string
  optimizePromptLabel: string
  optimizePromptHint: string
  optimizePromptPlaceholder: string
  contextTurnsLabel: string
  contextTurnsHint: string
  aboutTitle: string
  aboutVersionLabel: string
  aboutRepositoryLabel: string
  aboutChangelogLabel: string
  aboutLicenseLabel: string
  checkUpdateButton: string
  checkingUpdate: string
  updateUpToDate: string
  updateAvailable: string
  updateUnpublished: string
  updateCheckFailed: string
  updateCommandLabel: string
  updateCommandNpxLabel: string
  updateCommandPick: string
  convertAttach: string
  convertAddFile: string
  convertToggle: string
  convertPlainReady: string
  convertStart: string
  convertEdit: string
  convertSave: string
  convertRemove: string
  convertBusy: string
  convertFailed: string
  convertUnsupported: string
  convertEmptyFile: string
  convertTooLarge: string
  convertPreviewTitle: string
  convertPreviewFileLabel: string
  convertPreviewFormatLabel: string
  convertPreviewWarning: string
  convertOverwriteLabel: string
  convertCancel: string
  convertNoFile: string
  convertFileTooLarge: string
}

export const zh: BetterInputStrings = {
  voiceStart: '语音输入',
  voiceStop: '停止语音输入',
  voiceBusy: '正在处理…',
  voiceUnavailable: '此浏览器不支持语音识别',
  listening: '正在聆听…',
  transcribing: '正在转写…',
  polishing: '正在润色…',
  voiceFailed: '语音输入失败',
  polishNotConfigured: '未配置润色模型，请在设置页选择',
  polishFailedKeepOriginal: '润色失败，已保留原文',
  settingsTitle: 'BetterInput 设置',
  settingsDescription: '配置语音识别与 AI 润色。润色复用你在 dsh 设置里已配置的模型，无需额外 API key。',
  loading: '加载中…',
  saveFailed: '保存失败，请重试',
  languageLabel: '识别语言',
  languageHint: '留空时跟随浏览器语言。',
  languagePlaceholder: '例如 zh-CN 或 en-US',
  recordingLimitLabel: '单次录音上限（秒）',
  recordingLimitHint: '1–600 秒。',
  polishLabel: 'AI 润色',
  polishHint: '识别完成后用大模型清理转写文本（去口头禅、修正同音错字、加标点）。',
  on: '开',
  off: '关',
  polishModelLabel: '润色模型',
  polishModelHint: '选择 dsh 中已配置的模型路由。',
  polishModelNone: '（未选择）',
  polishEffortLabel: '润色思考强度',
  polishEffortHint: '控制大模型的推理深度。默认即适配器最低档，适合大多数场景。',
  polishPromptLabel: '自定义润色提示词',
  polishPromptHint: '留空使用内置提示词。自定义提示词总是追加输出契约保护。',
  polishPromptPlaceholder: '可选：粘贴自定义提示词…',
  showDefaultPrompt: '查看内置提示词',
  hideDefaultPrompt: '收起内置提示词',
  defaultPromptLabel: '内置提示词',
  effortDefaultLabel: '默认（关闭思考）',
  effortLoadingLabel: '加载思考强度选项…',
  routesStatus: '可用模型路由',
  routesUnavailable: '不可用',
  optimizeButton: '优化提示词',
  optimizeBusy: '优化中…',
  optimizeFailed: '优化失败，请重试',
  optimizeEmpty: '输入框为空，无需优化',
  optimizePanelTitle: '提示词优化结果',
  optimizeOriginalLabel: '原文',
  optimizeOptimizedLabel: '优化后',
  optimizeAdopt: '采纳',
  optimizeCancel: '取消',
  optimizeNotConfigured: '未配置优化模型，请在设置页开启',
  optimizeSectionLabel: '提示词优化',
  optimizeModelLabel: '优化模型',
  optimizeModelHint: '选择 dsh 中已配置的模型路由。',
  optimizeEffortLabel: '优化思考强度',
  optimizeEffortHint: '控制大模型的推理深度。默认即适配器最低档，适合大多数场景。',
  optimizePromptLabel: '自定义优化提示词',
  optimizePromptHint: '留空使用内置提示词。自定义提示词总是追加输出契约保护。',
  optimizePromptPlaceholder: '可选：粘贴自定义提示词…',
  contextTurnsLabel: '上下文引用轮数',
  contextTurnsHint: '优化时引用最近 N 轮对话作为上下文，0 为禁用。默认 3 轮。',
  aboutTitle: '关于与更新',
  aboutVersionLabel: '当前版本',
  aboutRepositoryLabel: '项目地址',
  aboutChangelogLabel: '更新日志',
  aboutLicenseLabel: '许可证',
  checkUpdateButton: '检查更新',
  checkingUpdate: '检查中…',
  updateUpToDate: '当前已是最新版本。',
  updateAvailable: '发现新版本',
  updateUnpublished: '该版本未在 npm 上公开发布。',
  updateCheckFailed: '检查更新失败',
  updateCommandLabel: '已全局安装 dsh CLI，执行',
  updateCommandNpxLabel: '未全局安装，改用 npx 执行',
  updateCommandPick: '按你的安装方式二选一即可',
  convertAttach: '添加文件',
  convertAddFile: '添加文件',
  convertToggle: '添加文件',
  convertPlainReady: '该文件 DSH 原生支持，无需转换，可直接发送',
  convertStart: '开始转换',
  convertEdit: '编辑',
  convertSave: '保存',
  convertRemove: '移除',
  convertBusy: '转换中…',
  convertFailed: '转换失败，请重试',
  convertUnsupported: '不支持的文件类型',
  convertEmptyFile: '文件内容为空',
  convertTooLarge: '文件过大，已超过转换上限',
  convertPreviewTitle: '文件转换结果',
  convertPreviewFileLabel: '文件',
  convertPreviewFormatLabel: '格式',
  convertPreviewWarning: '提示',
  convertOverwriteLabel: '覆盖输入框',
  convertCancel: '取消',
  convertNoFile: '请先添加文件',
  convertFileTooLarge: '该文件超过转换大小上限，无法转换'
}

export const en: BetterInputStrings = {
  voiceStart: 'Voice input',
  voiceStop: 'Stop voice input',
  voiceBusy: 'Processing…',
  voiceUnavailable: 'Speech recognition is not supported in this browser',
  listening: 'Listening…',
  transcribing: 'Transcribing…',
  polishing: 'Polishing…',
  voiceFailed: 'Voice input failed',
  polishNotConfigured: 'No polish model configured, please choose one in Settings',
  polishFailedKeepOriginal: 'Polishing failed, original kept',
  settingsTitle: 'BetterInput Settings',
  settingsDescription: 'Configure voice recognition and AI polishing. Polishing reuses the models already configured in dsh — no extra API key needed.',
  loading: 'Loading…',
  saveFailed: 'Failed to save, please retry',
  languageLabel: 'Recognition language',
  languageHint: 'Empty follows the browser language.',
  languagePlaceholder: 'e.g. zh-CN or en-US',
  recordingLimitLabel: 'Recording limit (seconds)',
  recordingLimitHint: '1–600 seconds.',
  polishLabel: 'AI polishing',
  polishHint: 'Clean the transcript with an LLM after recognition (fillers, homophone fixes, punctuation).',
  on: 'On',
  off: 'Off',
  polishModelLabel: 'Polish model',
  polishModelHint: 'Pick a model route already configured in dsh.',
  polishModelNone: '(none)',
  polishEffortLabel: 'Polishing thinking effort',
  polishEffortHint: 'Controls the model inference depth. Default uses the adapter baseline (lightest tier).',
  polishPromptLabel: 'Custom polish prompt',
  polishPromptHint: 'Empty uses the built-in prompt. A custom prompt always keeps the output-contract guard.',
  polishPromptPlaceholder: 'Optional: paste a custom prompt…',
  showDefaultPrompt: 'Show the built-in prompt',
  hideDefaultPrompt: 'Hide the built-in prompt',
  defaultPromptLabel: 'Built-in prompt',
  effortDefaultLabel: 'Default (thinking off)',
  effortLoadingLabel: 'Loading reasoning effort options…',
  routesStatus: 'Available model routes',
  routesUnavailable: 'unavailable',
  optimizeButton: 'Optimize prompt',
  optimizeBusy: 'Optimizing…',
  optimizeFailed: 'Optimization failed, please retry',
  optimizeEmpty: 'Input is empty, nothing to optimize',
  optimizePanelTitle: 'Prompt optimization result',
  optimizeOriginalLabel: 'Original',
  optimizeOptimizedLabel: 'Optimized',
  optimizeAdopt: 'Adopt',
  optimizeCancel: 'Cancel',
  optimizeNotConfigured: 'No optimize model configured, enable it in Settings',
  optimizeSectionLabel: 'Prompt optimization',
  optimizeModelLabel: 'Optimize model',
  optimizeModelHint: 'Pick a model route already configured in dsh.',
  optimizeEffortLabel: 'Optimize thinking effort',
  optimizeEffortHint: 'Controls the model inference depth. Default uses the adapter baseline (lightest tier).',
  optimizePromptLabel: 'Custom optimize prompt',
  optimizePromptHint: 'Empty uses the built-in prompt. A custom prompt always keeps the output-contract guard.',
  optimizePromptPlaceholder: 'Optional: paste a custom prompt…',
  contextTurnsLabel: 'Context turns',
  contextTurnsHint: 'Include recent N turns as context for optimization. 0 = disabled. Default 3.',
  aboutTitle: 'About & Updates',
  aboutVersionLabel: 'Installed version',
  aboutRepositoryLabel: 'Repository',
  aboutChangelogLabel: 'Changelog',
  aboutLicenseLabel: 'License',
  checkUpdateButton: 'Check for updates',
  checkingUpdate: 'Checking…',
  updateUpToDate: 'You are up to date.',
  updateAvailable: 'A new version is available',
  updateUnpublished: 'This version is not published on npm.',
  updateCheckFailed: 'Update check failed',
  updateCommandLabel: 'With a global dsh CLI, run',
  updateCommandNpxLabel: 'Without a global dsh CLI, run via npx',
  updateCommandPick: 'Use either one depending on how you installed DSH',
  convertAttach: 'Add file',
  convertAddFile: 'Add file',
  convertToggle: 'Add file',
  convertPlainReady: 'DSH natively supports this file — no conversion needed, send it directly',
  convertStart: 'Start conversion',
  convertEdit: 'Edit',
  convertSave: 'Save',
  convertRemove: 'Remove',
  convertBusy: 'Converting…',
  convertFailed: 'Conversion failed, please retry',
  convertUnsupported: 'Unsupported file type',
  convertEmptyFile: 'File is empty',
  convertTooLarge: 'File too large, exceeds the conversion limit',
  convertPreviewTitle: 'File conversion result',
  convertPreviewFileLabel: 'File',
  convertPreviewFormatLabel: 'Format',
  convertPreviewWarning: 'Notice',
  convertOverwriteLabel: 'Overwrite the input box',
  convertCancel: 'Cancel',
  convertNoFile: 'Please add a file first',
  convertFileTooLarge: 'This file exceeds the conversion size limit'
}

/** Namespace owning every BetterInput surface string. Registered into the DSH
 * locale runtime; slots declaring this namespace receive the typed `t`. */
export const BETTER_INPUT_NS = 'better-input'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  /** BetterInput dictionary keys (one shared key set, zh/en bilingual). */
  interface LocaleNamespaceMap {
    'better-input': keyof BetterInputStrings
  }
}
