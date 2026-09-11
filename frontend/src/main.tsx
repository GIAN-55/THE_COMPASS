import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@preact/signals'
import { render } from 'preact'
import { useState } from 'preact/hooks'
import { App } from './app.tsx'
import { getInitialLanguage, I18nProvider, type Language } from './i18n/context'
import './index.css'

function Root() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage())
  return (
    <I18nProvider language={language} setLanguage={setLanguage}>
      <App />
    </I18nProvider>
  )
}

render(<Root />, document.getElementById('app')!)
