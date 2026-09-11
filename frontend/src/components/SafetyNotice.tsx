import { AlertTriangle } from 'lucide-preact'
import { useTranslation } from '../i18n/context'

export function SafetyNotice({ text }: { text: string }) {
  const { t } = useTranslation()
  return (
    <div class="mt-2 flex gap-2 rounded-md border border-[var(--alert-border)] bg-[var(--alert-bg)] p-3 text-sm text-[var(--alert-text)]">
      <AlertTriangle size={18} class="mt-0.5 shrink-0" />
      <div>
        <p class="mb-1 font-medium">{t('safetyNoticeLabel')}</p>
        <p>{text}</p>
      </div>
    </div>
  )
}
