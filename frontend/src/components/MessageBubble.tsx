import type { Message } from '../db/types'
import { SafetyNotice } from './SafetyNotice'
import { useTranslation } from '../i18n/context'
import { Edit } from 'lucide-preact'

interface MessageBubbleProps {
  message: Message
  isLast: boolean
  onEdit: (messageId: string) => void
}

export function MessageBubble({ message, isLast, onEdit }: MessageBubbleProps) {
  const { t } = useTranslation()
  const isUser = message.role === 'user'
  
  function handleEdit() {
    if (isUser && isLast) {
      onEdit(message.id)
    }
  }
  
  return (
    <div class={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div class="flex flex-col gap-1 max-w-[85%]">
        <div
          class={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-[var(--accent)] text-white'
              : 'border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-primary)]'
          }`}
        >
          <p class="whitespace-pre-wrap">{message.content}</p>
          {!isUser && message.safetyNotice && (
            <SafetyNotice text={message.safetyNotice} />
          )}
        </div>
        {isLast && isUser && (
          <div class="flex gap-2 justify-end">
            <button
              type="button"
              class="icon-btn text-xs opacity-60 hover:opacity-100"
              onClick={handleEdit}
              aria-label={t('edit')}
            >
              <Edit size={14} />
              <span class="ml-1">{t('edit')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
