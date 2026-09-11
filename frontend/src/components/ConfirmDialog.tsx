import { useTranslation } from '../i18n/context'
import { deleteTargetId } from '../state/appState'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  onConfirm: (id: string) => void
}

export function ConfirmDialog({ onConfirm }: ConfirmDialogProps) {
  const { t } = useTranslation()
  const targetId = deleteTargetId.value
  if (!targetId) return null
  return (
    <Modal
      open
      title={t('deleteConfirmTitle')}
      onClose={() => { deleteTargetId.value = null }}
    >
      <p class="mb-6 text-sm text-[var(--text-secondary)]">{t('deleteConfirmMessage')}</p>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="btn-secondary"
          onClick={() => { deleteTargetId.value = null }}
        >
          {t('cancel')}
        </button>
        <button
          type="button"
          class="btn-danger"
          onClick={() => {
            onConfirm(targetId)
            deleteTargetId.value = null
          }}
        >
          {t('confirm')}
        </button>
      </div>
    </Modal>
  )
}
