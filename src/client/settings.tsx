import { useEffect, useRef, useState } from 'react'
import type { BetterInputSettings, BetterInputSettingsPatch, ReasoningEffortInfo } from '../config.js'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import type { SettingsController, UpdateSnapshot } from './settings-controller.js'
import { useAboutSnapshot, useEffortsSnapshot, useSettingsSnapshot, useRoutesSnapshot, useUpdateSnapshot } from './settings-controller.js'

/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>

function ReasoningEffortSelect(props: {
  settingsController: SettingsController
  provider: string
  model: string
  storedEffort: string
  onChange: (effortId: string) => void
  t: Translate
}) {
  const { settingsController, provider, model, storedEffort, onChange, t } = props
  const efforts = useEffortsSnapshot(settingsController)

  // Kick off the lazy fetch whenever the selected model changes.
  useEffect(() => {
    if (provider === '' || model === '') return
    void settingsController.ensureEffortsFor(provider, model)
  }, [settingsController, provider, model])

  if (provider === '' || model === '') return null
  const key = `${provider}\u0000${model}`
  const entry = efforts[key]

  // Not yet requested / loading → show a disabled placeholder so the user
  // knows the field exists but is warming up.
  if (entry === undefined || entry.status === 'loading') {
    return (
      <select value="" disabled={true} style={inputStyle}>
        <option value="">{t('effortLoadingLabel')}</option>
      </select>
    )
  }
  if (entry.status === 'error' || entry.efforts.length === 0) {
    // Nothing to show; silently hide like the "no efforts" case so the UI
    // doesn't constantly surface adapter metadata misses for regular models.
    return null
  }
  // The default option means "let the Host decide" — it prefers the model's
  // `off` tier, so we no longer surface the adapter's defaultEffort here.
  const items: readonly ReasoningEffortInfo[] = entry.efforts
  return (
    <select
      value={storedEffort}
      onChange={(event) => onChange(event.target.value)}
      style={inputStyle}
    >
      <option value="">{t('effortDefaultLabel')}</option>
      {items.map((effort) => (
        <option key={effort.id} value={effort.id} title={effort.description}>
          {effort.name}
        </option>
      ))}
    </select>
  )
}

export type SettingsSectionProps = {
  readonly close: () => void
  readonly t: Translate
  readonly settingsController: SettingsController
}

type FieldState = {
  text: string
  invalid: boolean
}

/**
 * The BetterInput settings page. Renders the recognition and polishing
 * configuration; every field edits a local draft and saves on blur/change.
 */
export function BetterInputSettingsSection({ close, settingsController, t }: SettingsSectionProps) {
  const settings = useSettingsSnapshot(settingsController)
  const routes = useRoutesSnapshot(settingsController)
  const about = useAboutSnapshot(settingsController)
  const update = useUpdateSnapshot(settingsController)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [saveFailed, setSaveFailed] = useState(false)
  const [showDefaultPrompt, setShowDefaultPrompt] = useState(false)
  const [showDefaultOptimizePrompt, setShowDefaultOptimizePrompt] = useState(false)
  const draftsRef = useRef(drafts)
  draftsRef.current = drafts

  useEffect(() => {
    void settingsController.refreshSettings()
    void settingsController.refreshRoutes()
    void settingsController.refreshAbout()
  }, [settingsController])

  if (settings.status === 'loading' || routes.status === 'loading') {
    return <SectionFrame title={t('settingsTitle')}>{t('loading')}</SectionFrame>
  }

  const field = (name: string, current: string): FieldState => ({
    text: drafts[name] ?? current,
    invalid: false
  })

  const setField = (name: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [name]: value }))
  }

  const save = async (patch: BetterInputSettingsPatch) => {
    setSaveFailed(false)
    const ok = await settingsController.update(patch)
    if (ok) {
      setDrafts((prev) => {
        const next = { ...prev }
        for (const key of Object.keys(patch)) delete next[key]
        return next
      })
    } else {
      setSaveFailed(true)
    }
  }

  const s = settings.view.settings
  const languageField = field('language', s.language)
  const secondsField = field('maxRecordingSeconds', String(s.maxRecordingSeconds))
  const polishPromptField = field('polishPrompt', s.polishPrompt)
  const optimizePromptField = field('optimizePrompt', s.optimizePrompt)
  const contextTurnsField = field('contextTurns', String(s.contextTurns))
  const ocrProviderField = field('ocrProvider', s.ocrProvider)
  const ocrModelField = field('ocrModel', s.ocrModel)

  return (
    <SectionFrame title={t('settingsTitle')}>
      <p style={hintStyle}>{t('settingsDescription')}</p>

      {saveFailed ? <p style={errorStyle}>{t('saveFailed')}</p> : null}

      <h3 style={sectionTitleStyle}>{t('voiceSectionLabel')}</h3>

      <Field label={t('languageLabel')} hint={t('languageHint')}>
        <input
          type="text"
          value={languageField.text}
          placeholder={t('languagePlaceholder')}
          onChange={(event) => setField('language', event.target.value)}
          onBlur={() => void save({ language: languageField.text.trim() })}
          style={inputStyle}
        />
      </Field>

      <Field label={t('recordingLimitLabel')} hint={t('recordingLimitHint')}>
        <input
          type="number"
          min={1}
          max={600}
          value={secondsField.text}
          onChange={(event) => setField('maxRecordingSeconds', event.target.value)}
          onBlur={() => {
            const parsed = Number(secondsField.text)
            if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > 600) return
            void save({ maxRecordingSeconds: parsed })
          }}
          style={inputStyle}
        />
      </Field>

      <h3 style={sectionTitleStyle}>{t('polishSectionLabel')}</h3>

      <Field label={t('polishLabel')} hint={t('polishHint')}>
        <label style={switchStyle}>
          <input
            type="checkbox"
            checked={s.polishingEnabled}
            onChange={(event) => void save({ polishingEnabled: event.target.checked })}
          />
          <span>{s.polishingEnabled ? t('on') : t('off')}</span>
        </label>
      </Field>

      {s.polishingEnabled ? (
        <>
          <Field label={t('polishModelLabel')} hint={t('polishModelHint')}>
            <select
              value={drafts.polishProvider !== undefined || drafts.polishModel !== undefined
                ? `${drafts.polishProvider ?? s.polishProvider}\u0000${drafts.polishModel ?? s.polishModel}`
                : `${s.polishProvider}\u0000${s.polishModel}`}
              onChange={(event) => {
                const [provider, model] = event.target.value.split('\u0000')
                void save({ polishProvider: provider ?? '', polishModel: model ?? '' })
              }}
              style={inputStyle}
              disabled={routes.status !== 'ready' || routes.routes.length === 0}
            >
              <option value={'\u0000'}>{t('polishModelNone')}</option>
              {routes.status === 'ready' && routes.routes.map((route) => (
                <option key={`${route.provider}\u0000${route.model}`} value={`${route.provider}\u0000${route.model}`}>
                  {route.providerName} / {route.modelName}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('polishEffortLabel')} hint={t('polishEffortHint')}>
            <ReasoningEffortSelect
              settingsController={settingsController}
              provider={s.polishProvider}
              model={s.polishModel}
              storedEffort={s.polishReasoningEffort}
              onChange={(effortId) => void save({ polishReasoningEffort: effortId })}
              t={t}
            />
          </Field>

          <Field label={t('polishPromptLabel')} hint={t('polishPromptHint')}>
            <textarea
              value={polishPromptField.text}
              rows={5}
              placeholder={t('polishPromptPlaceholder')}
              onChange={(event) => setField('polishPrompt', event.target.value)}
              onBlur={() => void save({ polishPrompt: polishPromptField.text })}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }}
            />
            {settings.view.defaultPolishPrompt !== '' ? (
              <div>
                <button
                  type="button"
                  onClick={() => setShowDefaultPrompt((prev) => !prev)}
                  style={toggleLinkStyle}
                >
                  {showDefaultPrompt ? t('hideDefaultPrompt') : t('showDefaultPrompt')}
                </button>
                {showDefaultPrompt ? (
                  <pre
                    style={{
                      margin: '6px 0 0',
                      padding: 8,
                      maxHeight: 220,
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontSize: 11,
                      lineHeight: 1.5,
                      background: 'var(--dsw-alias-bg-layer-1, rgba(0,0,0,0.03))',
                      border: '1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.3))',
                      borderRadius: 6,
                      fontFamily: 'monospace'
                    }}
                  >
                    {settings.view.defaultPolishPrompt}
                  </pre>
                ) : null}
              </div>
            ) : null}
          </Field>
        </>
      ) : null}

      <h3 style={{ margin: '16px 0 0', fontSize: 14 }}>{t('optimizeSectionLabel')}</h3>

      <Field label={t('optimizeModelLabel')} hint={t('optimizeModelHint')}>
            <select
              value={drafts.optimizeProvider !== undefined || drafts.optimizeModel !== undefined
                ? `${drafts.optimizeProvider ?? s.optimizeProvider}\u0000${drafts.optimizeModel ?? s.optimizeModel}`
                : `${s.optimizeProvider}\u0000${s.optimizeModel}`}
              onChange={(event) => {
                const [provider, model] = event.target.value.split('\u0000')
                void save({ optimizeProvider: provider ?? '', optimizeModel: model ?? '' })
              }}
              style={inputStyle}
              disabled={routes.status !== 'ready' || routes.routes.length === 0}
            >
              <option value={'\u0000'}>{t('polishModelNone')}</option>
              {routes.status === 'ready' && routes.routes.map((route) => (
                <option key={`${route.provider}\u0000${route.model}`} value={`${route.provider}\u0000${route.model}`}>
                  {route.providerName} / {route.modelName}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('optimizeEffortLabel')} hint={t('optimizeEffortHint')}>
            <ReasoningEffortSelect
              settingsController={settingsController}
              provider={s.optimizeProvider}
              model={s.optimizeModel}
              storedEffort={s.optimizeReasoningEffort}
              onChange={(effortId) => void save({ optimizeReasoningEffort: effortId })}
              t={t}
            />
          </Field>

          <Field label={t('optimizePromptLabel')} hint={t('optimizePromptHint')}>
            <textarea
              value={optimizePromptField.text}
              rows={5}
              placeholder={t('optimizePromptPlaceholder')}
              onChange={(event) => setField('optimizePrompt', event.target.value)}
              onBlur={() => void save({ optimizePrompt: optimizePromptField.text })}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }}
            />
            {settings.view.defaultOptimizePrompt !== '' ? (
              <div>
                <button
                  type="button"
                  onClick={() => setShowDefaultOptimizePrompt((prev) => !prev)}
                  style={toggleLinkStyle}
                >
                  {showDefaultOptimizePrompt ? t('hideDefaultPrompt') : t('showDefaultPrompt')}
                </button>
                {showDefaultOptimizePrompt ? (
                  <pre
                    style={{
                      margin: '6px 0 0',
                      padding: 8,
                      maxHeight: 220,
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontSize: 11,
                      lineHeight: 1.5,
                      background: 'var(--dsw-alias-bg-layer-1, rgba(0,0,0,0.03))',
                      border: '1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.3))',
                      borderRadius: 6,
                      fontFamily: 'monospace'
                    }}
                  >
                    {settings.view.defaultOptimizePrompt}
                  </pre>
                ) : null}
              </div>
            ) : null}
          </Field>

          <Field label={t('contextTurnsLabel')} hint={t('contextTurnsHint')}>
            <input
              type="number"
              min={0}
              max={20}
              value={contextTurnsField.text}
              onChange={(event) => setField('contextTurns', event.target.value)}
              onBlur={() => {
                const parsed = Number(contextTurnsField.text)
                if (!Number.isSafeInteger(parsed) || parsed < 0 || parsed > 20) return
                void save({ contextTurns: parsed })
              }}
              style={inputStyle}
            />
          </Field>

          <Field label={t('ocrModelLabel')} hint={t('ocrModelHint')}>
            <select
              value={ocrProviderField.text !== undefined || ocrModelField.text !== undefined
                ? `${ocrProviderField.text !== undefined ? ocrProviderField.text : s.ocrProvider}\u0000${ocrModelField.text !== undefined ? ocrModelField.text : s.ocrModel}`
                : `${s.ocrProvider}\u0000${s.ocrModel}`}
              onChange={(event) => {
                const [provider, model] = event.target.value.split('\u0000')
                void save({ ocrProvider: provider ?? '', ocrModel: model ?? '' })
              }}
              style={inputStyle}
              disabled={routes.status !== 'ready' || routes.routes.length === 0}
            >
              <option value={'\u0000'}>{t('polishModelNone')}</option>
              {routes.status === 'ready' && routes.routes.map((route) => (
                <option key={`${route.provider}\u0000${route.model}`} value={`${route.provider}\u0000${route.model}`}>
                  {route.providerName} / {route.modelName}
                </option>
              ))}
            </select>
          </Field>

      <p style={hintStyle}>
        {t('routesStatus')}: {routes.status === 'ready' ? `${routes.routes.length}` : routes.detail || t('routesUnavailable')}
      </p>

      <hr style={dividerStyle} />

      <AboutUpdateSection
        aboutStatus={about.status}
        version={about.about.version}
        repository={about.about.repository}
        license={about.about.license}
        update={update}
        t={t}
        onCheckUpdate={() => void settingsController.checkForUpdate()}
      />
    </SectionFrame>
  )
}

function AboutUpdateSection(props: {
  aboutStatus: string
  version: string
  repository: string
  license: string
  update: UpdateSnapshot
  t: Translate
  onCheckUpdate: () => void
}) {
  const { aboutStatus, version, repository, license, update, t, onCheckUpdate } = props
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h3 style={{ margin: 0, fontSize: 14 }}>{t('aboutTitle')}</h3>
      {aboutStatus === 'ready' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13, opacity: 0.85 }}>
          <span>{t('aboutVersionLabel')}: {version || '—'}</span>
          <span>{t('aboutLicenseLabel')}: {license || '—'}</span>
          {repository !== '' ? (
            <a
              href={repository}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--dsw-alias-state-business-primary, #4f8cff)' }}
            >
              {t('aboutRepositoryLabel')}: {repository}
            </a>
          ) : null}
          {repository !== '' ? (
            <a
              href={`${repository.replace(/\/+$/, '')}/blob/main/CHANGELOG.md`}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--dsw-alias-state-business-primary, #4f8cff)' }}
            >
              {t('aboutChangelogLabel')}
            </a>
          ) : null}
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button
          type="button"
          onClick={onCheckUpdate}
          disabled={update.status === 'loading'}
          style={{
            width: 'fit-content',
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.4))',
            background: 'var(--dsh-color-surface, transparent)',
            color: 'var(--dsw-alias-label-primary, inherit)',
            fontSize: 13,
            cursor: update.status === 'loading' ? 'default' : 'pointer'
          }}
        >
          {update.status === 'loading' ? t('checkingUpdate') : t('checkUpdateButton')}
        </button>
        {update.status === 'ready' && update.update !== null ? (
          (() => {
            const status = update.update.status
            if (status === 'up-to-date') {
              return <p style={hintStyle}>{t('updateUpToDate')}</p>
            }
            if (status === 'unpublished') {
              return <p style={hintStyle}>{t('updateUnpublished')}</p>
            }
            if (status === 'update-available') {
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p style={{ ...hintStyle, color: '#e5484d' }}>
                    {t('updateAvailable')}: {update.update.installed} → {update.update.latest}
                  </p>
                  <span style={hintStyle}>{t('updateCommandLabel')}:</span>
                  <code style={codeStyle}>{update.update.updateCommand}</code>
                  <span style={hintStyle}>{t('updateCommandNpxLabel')}:</span>
                  <code style={codeStyle}>{update.update.updateCommandNpx}</code>
                  <span style={hintStyle}>{t('updateCommandPick')}:</span>
                </div>
              )
            }
            return <p style={errorStyle}>{t('updateCheckFailed')}</p>
          })()
        ) : null}
        {update.status === 'error' ? (
          <p style={errorStyle}>{t('updateCheckFailed')}: {update.detail}</p>
        ) : null}
      </div>
    </div>
  )
}

function SectionFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 16 }}>{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
      {children}
      <span style={hintStyle}>{hint}</span>
    </label>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.4))',
  background: 'var(--dsh-color-surface, transparent)',
  color: 'var(--dsw-alias-label-primary, inherit)',
  fontSize: 13
}

const hintStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  opacity: 0.7
}

const errorStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: '#e5484d'
}

const switchStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 13
}

const toggleLinkStyle: React.CSSProperties = {
  marginTop: 6,
  padding: 0,
  border: 'none',
  background: 'none',
  color: 'var(--dsw-alias-state-business-primary, #4f8cff)',
  fontSize: 12,
  cursor: 'pointer',
  textDecoration: 'underline'
}

const dividerStyle: React.CSSProperties = {
  margin: '8px 0',
  border: 'none',
  borderTop: '1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.3))'
}

const sectionTitleStyle: React.CSSProperties = {
  margin: '16px 0 0',
  fontSize: 14
}

const codeStyle: React.CSSProperties = {
  padding: '6px 8px',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  fontSize: 12,
  fontFamily: 'monospace',
  background: 'var(--dsw-alias-bg-layer-1, rgba(0,0,0,0.03))',
  border: '1px solid var(--dsw-alias-border-l2, rgba(128,128,128,0.3))',
  borderRadius: 6
}