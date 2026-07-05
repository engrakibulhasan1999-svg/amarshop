import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '@/store/useSettingsStore'

// Keeps the <html> element in sync with theme + language settings.
export function ThemeSync() {
  const theme = useSettingsStore((s) => s.theme)
  const language = useSettingsStore((s) => s.language)
  const { i18n } = useTranslation()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('lang-bn', language === 'bn')
    root.setAttribute('lang', language)
    if (i18n.language !== language) i18n.changeLanguage(language)
  }, [language, i18n])

  return null
}
