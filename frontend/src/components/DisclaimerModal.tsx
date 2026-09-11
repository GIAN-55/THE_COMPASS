import { loadPreferences, savePreferences } from '../db/store'
import { useTranslation } from '../i18n/context'
import { disclaimerOpen } from '../state/appState'
import { Modal } from './Modal'

export function DisclaimerModal() {
  const { t } = useTranslation()
  const open = disclaimerOpen.value
  if (!open) return null

  async function handleAccept() {
    const prefs = await loadPreferences()
    await savePreferences({ ...prefs, disclaimerAccepted: true })
    disclaimerOpen.value = false
  }

  return (
    <Modal open title={t('disclaimerTitle')} blocking>
      <p class="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
        {t('disclaimerBody')}
      </p>
      <button type="button" class="btn-primary w-full" onClick={handleAccept}>
        {t('disclaimerAccept')}
      </button>
    </Modal>
  )
}
