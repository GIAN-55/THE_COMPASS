import { useEffect } from 'preact/hooks'
import {
  loadConversations,
  loadPreferences,
  loadProviderConfig,
} from '../db/store'
import {
  activeConversationId,
  conversations,
  disclaimerOpen,
  providerConfig,
  theme,
} from '../state/appState'
import type { Theme } from '../db/types'

export function applyTheme(value: Theme) {
  document.documentElement.classList.toggle('dark', value === 'dark')
}

export function useAppInit() {
  useEffect(() => {
    async function init() {
      const [convs, prefs, config] = await Promise.all([
        loadConversations(),
        loadPreferences(),
        loadProviderConfig(),
      ])
      conversations.value = convs
      providerConfig.value = config
      theme.value = prefs.theme
      applyTheme(prefs.theme)
      if (convs.length > 0) {
        activeConversationId.value = convs[0].id
      }
      if (!prefs.disclaimerAccepted) {
        disclaimerOpen.value = true
      }
    }
    init()
  }, [])
}
