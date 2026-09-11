import { ApiError, sendChat } from '../api/chat'
import { deleteConversation, saveConversation } from '../db/store'
import type { Conversation, Message } from '../db/types'
import { useTranslation } from '../i18n/context'
import {
  activeConversation,
  activeConversationId,
  apiError,
  conversations,
  createId,
  isLoading,
  providerConfig,
  truncateTitle,
  editingMessageId,
} from '../state/appState'

function upsertConversation(updated: Conversation) {
  conversations.value = [
    updated,
    ...conversations.value.filter((c) => c.id !== updated.id),
  ]
}

function historyForApi(messages: Message[]) {
  return messages.map(({ role, content }) => ({ role, content }))
}

export function useChatActions() {
  const { language, t } = useTranslation()

  async function createConversation(): Promise<string> {
    const id = createId()
    const now = Date.now()
    const conv: Conversation = {
      id,
      title: t('newConversation'),
      messages: [],
      createdAt: now,
      updatedAt: now,
    }
    upsertConversation(conv)
    activeConversationId.value = id
    await saveConversation(conv)
    return id
  }

  async function removeConversation(id: string) {
    await deleteConversation(id)
    conversations.value = conversations.value.filter((c) => c.id !== id)
    if (activeConversationId.value === id) {
      activeConversationId.value = conversations.value[0]?.id ?? null
    }
  }

  async function sendMessage(text: string, isEdit = false) {
    const trimmed = text.trim()
    if (!trimmed || isLoading.value) return
    apiError.value = null
    let conv = activeConversation.value
    if (!conv) {
      const id = await createConversation()
      conv = conversations.value.find((c) => c.id === id)!
    }
    
    // If editing, remove the message being edited and all messages after it
    if (isEdit && editingMessageId.value) {
      const messageIndex = conv.messages.findIndex(m => m.id === editingMessageId.value)
      if (messageIndex !== -1) {
        conv = {
          ...conv,
          messages: conv.messages.slice(0, messageIndex),
        }
        upsertConversation(conv)
        await saveConversation(conv)
      }
      editingMessageId.value = null
    }
    
    const userMessage: Message = { id: createId(), role: 'user', content: trimmed }
    const withUser: Conversation = {
      ...conv,
      title: conv.messages.length === 0 ? truncateTitle(trimmed) : conv.title,
      messages: [...conv.messages, userMessage],
      updatedAt: Date.now(),
    }
    upsertConversation(withUser)
    await saveConversation(withUser)
    isLoading.value = true
    try {
      const response = await sendChat(
        trimmed,
        historyForApi(withUser.messages.slice(0, -1)),
        language,
        providerConfig.value,
      )
      const assistantMessage: Message = {
        id: createId(),
        role: 'assistant',
        content: response.reply,
        safetyNotice: response.safety_notice,
      }
      const complete: Conversation = {
        ...withUser,
        messages: [...withUser.messages, assistantMessage],
        updatedAt: Date.now(),
      }
      upsertConversation(complete)
      await saveConversation(complete)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429) apiError.value = t('errorRateLimit')
        else if (err.message) apiError.value = err.message
        else if (err.status === 400) apiError.value = t('errorValidation')
        else apiError.value = t('errorGeneric')
      } else {
        apiError.value = t('errorGeneric')
      }
    } finally {
      isLoading.value = false
    }
  }
  
  function editMessage(messageId: string) {
    editingMessageId.value = messageId
  }

  return { createConversation, removeConversation, sendMessage, editMessage }
}
