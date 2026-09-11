import {
  Compass,
  Globe,
  Mail,
  Menu,
  Moon,
  Settings,
  Sun,
} from 'lucide-preact'
import { APP_NAME, FEEDBACK_EMAIL } from '../config/app'
import { useTranslation, type Language } from '../i18n/context'
import { loadPreferences, savePreferences } from '../db/store'
import { applyTheme } from '../hooks/useAppInit'
import { settingsOpen, sidebarOpen, theme } from '../state/appState'

interface TopBarProps {
  onToggleTheme: () => void
}

export function TopBar({ onToggleTheme }: TopBarProps) {
  const { t, language, setLanguage } = useTranslation()
  const isDark = theme.value === 'dark'
  const feedbackHref = `mailto:${FEEDBACK_EMAIL}?subject=Feedback%20${encodeURIComponent(APP_NAME)}`

  async function toggleLanguage() {
    const next: Language = language === 'es' ? 'en' : 'es'
    setLanguage(next)
  }

  return (
    <header class="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="icon-btn md:hidden"
          onClick={() => { sidebarOpen.value = !sidebarOpen.value }}
          aria-label={t('newConversation')}
        >
          <Menu size={20} />
        </button>
        <Compass size={22} class="text-[var(--accent)]" />
        <h1 class="text-base font-semibold text-[var(--text-primary)]">{t('appName')}</h1>
      </div>
      <div class="flex items-center gap-1">
        <button type="button" class="icon-btn" onClick={toggleLanguage} aria-label={t('language')}>
          <Globe size={18} />
          <span class="ml-1 text-xs uppercase">{language}</span>
        </button>
        <button type="button" class="icon-btn" onClick={() => onToggleTheme()} aria-label={t('theme')}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a href={feedbackHref} class="icon-btn" aria-label={t('feedback')}>
          <Mail size={18} />
        </a>
        <button
          type="button"
          class="icon-btn"
          onClick={() => { settingsOpen.value = true }}
          aria-label={t('settings')}
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  )
}

export async function handleThemeToggle() {
  const next = theme.value === 'light' ? 'dark' : 'light'
  theme.value = next
  applyTheme(next)
  const prefs = await loadPreferences()
  await savePreferences({ ...prefs, theme: next })
}
