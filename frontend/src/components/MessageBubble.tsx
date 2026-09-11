import type { Message } from '../db/types'
import { SafetyNotice } from './SafetyNotice'

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div class={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        class={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
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
    </div>
  )
}
