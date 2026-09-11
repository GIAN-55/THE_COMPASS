import { useState } from 'preact/hooks'
import { Info, Send } from 'lucide-preact'
import { useTranslation } from '../i18n/context'
import { charLimit, disclaimerOpen, isLoading } from '../state/appState'

interface ChatInputProps {
  onSend: (text: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const limit = charLimit.value
  const count = text.length
  const disabled = isLoading.value || count === 0 || count > limit

  function handleSubmit(e: Event) {
    e.preventDefault()
    if (disabled) return
    onSend(text)
    setText('')
  }

  return (
    <div class="border-t border-[var(--border)] bg-[var(--surface)] p-4">
      {isLoading.value && (
        <p class="mb-2 text-xs text-[var(--text-secondary)]">{t('typing')}</p>
      )}
      <form onSubmit={handleSubmit} class="flex items-end gap-2">
        <button
          type="button"
          class="icon-btn mb-1"
          aria-label={t('disclaimerInfo')}
          onClick={() => { disclaimerOpen.value = true }}
        >
          <Info size={18} />
        </button>
        <div class="flex-1">
          <textarea
            value={text}
            onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
            disabled={isLoading.value}
            rows={2}
            placeholder={t('emptyChat')}
            class="input-field resize-none"
          />
          <p class="mt-1 text-right text-xs text-[var(--text-secondary)]">
            {t('characters', { count, limit })}
          </p>
        </div>
        <button type="submit" disabled={disabled} class="btn-primary mb-6" aria-label={t('send')}>
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
