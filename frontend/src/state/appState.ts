import { computed, signal } from '@preact/signals'
import type { Conversation, ProviderConfig, Theme } from '../db/types'
import { DEFAULT_PROVIDER_CONFIG } from '../db/types'

export const conversations = signal<Conversation[]>([])
export const activeConversationId = signal<string | null>(null)
export const providerConfig = signal<ProviderConfig>({ ...DEFAULT_PROVIDER_CONFIG })
export const theme = signal<Theme>('light')
export const sidebarOpen = signal(false)
export const isLoading = signal(false)
export const settingsOpen = signal(false)
export const disclaimerOpen = signal(false)
export const deleteTargetId = signal<string | null>(null)
export const apiError = signal<string | null>(null)

export const activeConversation = computed(() =>
  conversations.value.find((c) => c.id === activeConversationId.value) ?? null,
)

export const charLimit = computed(() =>
  providerConfig.value.mode === 'free' ? 1000 : 5000,
)

export function createId(): string {
  return crypto.randomUUID()
}

export function truncateTitle(text: string, max = 42): string {
  const clean = text.trim().replace(/\s+/g, ' ')
  return clean.length <= max ? clean : `${clean.slice(0, max)}…`
}
