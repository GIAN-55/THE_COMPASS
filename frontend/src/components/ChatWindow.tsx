import { useEffect, useRef } from 'preact/hooks'
import { useTranslation } from '../i18n/context'
import { activeConversation, apiError } from '../state/appState'
import { ChatInput } from './ChatInput'
import { MessageBubble } from './MessageBubble'

interface ChatWindowProps {
  onSend: (text: string, isEdit?: boolean) => void
  onEdit: (messageId: string) => void
}

export function ChatWindow({ onSend, onEdit }: ChatWindowProps) {
  const { t } = useTranslation()
  const conv = activeConversation.value
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv?.messages.length, conv?.messages.at(-1)?.content])

  return (
    <main class="flex flex-1 flex-col min-w-0">
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        {!conv || conv.messages.length === 0 ? (
          <p class="text-center text-sm text-[var(--text-secondary)] mt-12">{t('emptyChat')}</p>
        ) : (
          conv.messages.map((msg, index) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isLast={index === conv.messages.length - 1}
              onEdit={onEdit}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
      {apiError.value && (
        <div class="mx-4 mb-2 rounded-md border border-[var(--alert-border)] bg-[var(--alert-bg)] px-4 py-2 text-sm text-[var(--alert-text)]">
          {apiError.value}
        </div>
      )}
      <ChatInput onSend={onSend} />
    </main>
  )
}
