import type { Message } from '../db/types'
import { SafetyNotice } from './SafetyNotice'
import { useTranslation } from '../i18n/context'
import { Edit } from 'lucide-preact'
import { marked } from 'marked'

interface MessageBubbleProps {
  message: Message
  isLastUserMessage: boolean
  onEdit: (messageId: string) => void
}

export function MessageBubble({ message, isLastUserMessage, onEdit }: MessageBubbleProps) {
  const { t } = useTranslation()
  const isUser = message.role === 'user'
  
  function handleEdit() {
    if (isUser && isLastUserMessage) {
      onEdit(message.id)
    }
  }
  
  // Configure marked options to preserve empty lines
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
    pedantic: false,
  })
  
  const renderedContent = !isUser ? marked.parse(message.content) : message.content
  
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
          {isUser ? (
            <p class="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div 
              class="prose prose-sm max-w-none prose-p:mb-3 prose-headings:mb-3 prose-headings:font-semibold prose-strong:font-semibold prose-em:italic prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-white-space-pre-wrap"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          )}
          {!isUser && message.safetyNotice && (
            <SafetyNotice text={message.safetyNotice} />
          )}
        </div>
        {isUser && isLastUserMessage && (
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
