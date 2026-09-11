import { useEffect, useState } from 'preact/hooks'
import { Eye, EyeOff } from 'lucide-preact'
import { modelsForProvider, PROVIDER_OPTIONS, type ProviderId } from '../config/providers'
import { saveProviderConfig } from '../db/store'
import type { ProviderConfig } from '../db/types'
import { useTranslation } from '../i18n/context'
import { providerConfig, settingsOpen } from '../state/appState'
import { Modal } from './Modal'

export function SettingsModal() {
  const { t } = useTranslation()
  const open = settingsOpen.value
  const current = providerConfig.value
  const [mode, setMode] = useState<'free' | 'byok'>(current.mode)
  const [provider, setProvider] = useState<ProviderId>(
    current.provider === 'default' ? 'groq' : (current.provider as ProviderId),
  )
  const [model, setModel] = useState(current.model || modelsForProvider('groq')[0])
  const [apiKey, setApiKey] = useState(current.apiKey)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    if (!open) return
    const c = providerConfig.value
    setMode(c.mode)
    setProvider(c.provider === 'default' ? 'groq' : (c.provider as ProviderId))
    setModel(c.model || modelsForProvider(c.provider === 'default' ? 'groq' : c.provider as ProviderId)[0])
    setApiKey(c.apiKey)
    setShowKey(false)
  }, [open])

  if (!open) return null

  const models = modelsForProvider(provider)

  async function handleSave() {
    const config: ProviderConfig = mode === 'free'
      ? { mode: 'free', provider: 'default', model: '', apiKey: '' }
      : { mode: 'byok', provider, model, apiKey }
    providerConfig.value = config
    await saveProviderConfig(config)
    settingsOpen.value = false
  }

  return (
    <Modal open title={t('settingsTitle')} onClose={() => { settingsOpen.value = false }}>
      <div class="space-y-4">
        <label class="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mode"
            checked={mode === 'free'}
            onChange={() => setMode('free')}
          />
          {t('modeFree')}
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mode"
            checked={mode === 'byok'}
            onChange={() => setMode('byok')}
          />
          {t('modeByok')}
        </label>
        {mode === 'byok' && (
          <>
            <div>
              <label class="label">{t('provider')}</label>
              <select
                class="input-field mt-1"
                value={provider}
                onChange={(e) => {
                  const next = (e.target as HTMLSelectElement).value as ProviderId
                  setProvider(next)
                  setModel(modelsForProvider(next)[0])
                }}
              >
                {PROVIDER_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>{t(p.labelKey)}</option>
                ))}
              </select>
            </div>
            <div>
              <label class="label">{t('model')}</label>
              <select
                class="input-field mt-1"
                value={model}
                onChange={(e) => setModel((e.target as HTMLSelectElement).value)}
              >
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label class="label">{t('apiKey')}</label>
              <div class="relative mt-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  class="input-field pr-10"
                  value={apiKey}
                  onInput={(e) => setApiKey((e.target as HTMLInputElement).value)}
                />
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 icon-btn"
                  onClick={() => setShowKey(!showKey)}
                  aria-label={showKey ? t('hideKey') : t('showKey')}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <p class="text-xs text-[var(--text-secondary)]">{t('keyPrivacy')}</p>
          </>
        )}
        <button type="button" class="btn-primary w-full" onClick={handleSave}>
          {t('save')}
        </button>
      </div>
    </Modal>
  )
}
