import { createContext } from 'preact'
import { useContext, useMemo } from 'preact/hooks'
import es from './es.json'
import en from './en.json'
import { LANGUAGE_KEY } from '../config/app'

export type Language = 'es' | 'en'
type Dict = typeof es

const dictionaries: Record<Language, Dict> = { es, en }

function readStoredLanguage(): Language {
  const stored = localStorage.getItem(LANGUAGE_KEY)
  return stored === 'en' ? 'en' : 'es'
}

function resolve(obj: Record<string, unknown>, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj)
  return typeof value === 'string' ? value : path
}

interface I18nContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue>({
  language: 'es',
  setLanguage: () => {},
  t: (key) => key,
})

export function I18nProvider({
  language,
  setLanguage,
  children,
}: {
  language: Language
  setLanguage: (lang: Language) => void
  children: preact.ComponentChildren
}) {
  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage: (lang) => {
      localStorage.setItem(LANGUAGE_KEY, lang)
      setLanguage(lang)
    },
    t: (key, vars) => {
      let text = resolve(dictionaries[language] as unknown as Record<string, unknown>, key)
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(`{{${k}}}`, String(v))
        }
      }
      return text
    },
  }), [language, setLanguage])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  return useContext(I18nContext)
}

export function getInitialLanguage(): Language {
  return readStoredLanguage()
}
