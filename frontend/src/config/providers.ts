export type ProviderId = 'groq' | 'openai' | 'anthropic' | 'gemini' | 'mistral'

export interface ProviderOption {
  id: ProviderId
  labelKey: string
  models: string[]
}

export const PROVIDER_OPTIONS: ProviderOption[] = [
  {
    id: 'groq',
    labelKey: 'providers.groq',
    models: ['openai/gpt-oss-120b'],
  },
  {
    id: 'openai',
    labelKey: 'providers.openai',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4.1-mini'],
  },
  {
    id: 'anthropic',
    labelKey: 'providers.anthropic',
    models: ['claude-sonnet-4-5', 'claude-haiku-4-5'],
  },
  {
    id: 'gemini',
    labelKey: 'providers.gemini',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro'],
  },
  {
    id: 'mistral',
    labelKey: 'providers.mistral',
    models: ['mistral-large-latest'],
  },
]

export function modelsForProvider(id: ProviderId): string[] {
  return PROVIDER_OPTIONS.find((p) => p.id === id)?.models ?? []
}
