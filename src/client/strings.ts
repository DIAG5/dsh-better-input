/**
 * UI strings for dsh-better-input. First version picks the language once at
 * module load from the browser locale; a full locale-service integration can
 * replace this later without touching components.
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
  optimizeLabel: string
  optimizeHint: string
  optimizeModelLabel: string
  optimizeModelHint: string
  optimizeEffortLabel: string
  optimizeEffortHint: string
  optimizePromptLabel: string
  optimizePromptHint: string
  optimizePromptPlaceholder: string
}

const zh: BetterInputStrings = {
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
  optimizeLabel: '提示词优化',
  optimizeHint: '在输入框旁添加 ✨ 按钮，用大模型优化你写好的提示词，让提问更精准。优化后需手动确认才替换。',
  optimizeModelLabel: '优化模型',
  optimizeModelHint: '选择 dsh 中已配置的模型路由。',
  optimizeEffortLabel: '优化思考强度',
  optimizeEffortHint: '控制大模型的推理深度。默认即适配器最低档，适合大多数场景。',
  optimizePromptLabel: '自定义优化提示词',
  optimizePromptHint: '留空使用内置提示词。自定义提示词总是追加输出契约保护。',
  optimizePromptPlaceholder: '可选：粘贴自定义提示词…'
}

const en: BetterInputStrings = {
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
  optimizeLabel: 'Prompt optimization',
  optimizeHint: 'Add a ✨ button beside the input box that optimizes your prompt with an LLM for clearer, more specific questions. Requires manual confirmation before replacing.',
  optimizeModelLabel: 'Optimize model',
  optimizeModelHint: 'Pick a model route already configured in dsh.',
  optimizeEffortLabel: 'Optimize thinking effort',
  optimizeEffortHint: 'Controls the model inference depth. Default uses the adapter baseline (lightest tier).',
  optimizePromptLabel: 'Custom optimize prompt',
  optimizePromptHint: 'Empty uses the built-in prompt. A custom prompt always keeps the output-contract guard.',
  optimizePromptPlaceholder: 'Optional: paste a custom prompt…'
}

export function stringsForBrowser(): BetterInputStrings {
  const lang = typeof navigator === 'undefined' ? '' : (navigator.language ?? '')
  return lang.toLowerCase().startsWith('zh') ? zh : en
}
