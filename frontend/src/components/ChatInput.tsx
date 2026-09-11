import { useState, useEffect } from 'preact/hooks'
import { Info, Send, X } from 'lucide-preact'
import { useTranslation } from '../i18n/context'
import { charLimit, disclaimerOpen, isLoading, editingMessageId, activeConversation } from '../state/appState'

interface ChatInputProps {
  onSend: (text: string, isEdit?: boolean) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const limit = charLimit.value
  const count = text.length
  const disabled = isLoading.value || count === 0 || count > limit

  useEffect(() => {
    if (editingMessageId.value) {
      const conv = activeConversation.value
      if (conv) {
        const message = conv.messages.find(m => m.id === editingMessageId.value)
        if (message && message.role === 'user') {
          setText(message.content)
          setIsEditing(true)
        }
      }
    } else {
      setIsEditing(false)
      setText('')
    }
  }, [editingMessageId.value])
  
  function cancelEdit() {
    editingMessageId.value = null
    setIsEditing(false)
    setText('')
  }

  function handleSubmit(e: Event) {
    e.preventDefault()
    if (disabled) return
    onSend(text, isEditing)
    setText('')
    setIsEditing(false)
    editingMessageId.value = null
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (!disabled) {
        onSend(text, isEditing)
        setText('')
        setIsEditing(false)
        editingMessageId.value = null
      }
    }
  }

  return (
    <div class="border-t border-[var(--border)] bg-[var(--surface)] p-4">
      {isLoading.value && (
        <p class="mb-2 text-xs text-[var(--text-secondary)]">{t('typing')}</p>
      )}
      {isEditing && (
        <p class="mb-2 text-xs text-[var(--text-secondary)]">
          {t('edit')}
          <button
            type="button"
            class="ml-2 text-xs text-[var(--accent)] hover:underline"
            onClick={cancelEdit}
          >
            <X size={12} class="inline" />
          </button>
        </p>
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
            onKeyDown={handleKeyDown}
            disabled={isLoading.value}
            rows={2}
            placeholder={isEditing ? t('edit') : t('emptyChat')}
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
