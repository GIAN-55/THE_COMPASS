import { API_BASE } from '../config/app'
import type { Language } from '../i18n/context'
import type { ProviderConfig } from '../db/types'

export interface HistoryItem {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  reply: string
  safety_notice: string | null
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function buildPayload(
  message: string,
  history: HistoryItem[],
  language: Language,
  config: ProviderConfig,
) {
  const freeMode = config.mode === 'free'
  return {
    message,
    history,
    language,
    provider: freeMode ? 'default' : config.provider,
    api_key: freeMode ? null : config.apiKey || null,
    model: freeMode ? null : config.model || null,
  }
}

export async function sendChat(
  message: string,
  history: HistoryItem[],
  language: Language,
  config: ProviderConfig,
): Promise<ChatResponse> {
  const apiBase = API_BASE.replace(/\/$/, '') // Remove trailing slash
  const response = await fetch(`${apiBase}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildPayload(message, history, language, config)),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: '' }))
    const detail = typeof data.detail === 'string' ? data.detail : ''
    throw new ApiError(response.status, detail)
  }
  return response.json()
}
