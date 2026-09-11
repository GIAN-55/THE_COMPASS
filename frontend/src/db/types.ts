import type { ProviderId } from '../config/providers'

export type Theme = 'light' | 'dark'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  safetyNotice?: string | null
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export interface Preferences {
  theme: Theme
  disclaimerAccepted: boolean
}

export interface ProviderConfig {
  mode: 'free' | 'byok'
  provider: ProviderId | 'default'
  model: string
  apiKey: string
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'light',
  disclaimerAccepted: false,
}

export const DEFAULT_PROVIDER_CONFIG: ProviderConfig = {
  mode: 'free',
  provider: 'default',
  model: '',
  apiKey: '',
}
