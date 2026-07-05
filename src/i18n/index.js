import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en'
import bn from './bn'

const stored =
  typeof localStorage !== 'undefined' ? localStorage.getItem('buildest-lang') : null

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bn: { translation: bn },
  },
  lng: stored || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
