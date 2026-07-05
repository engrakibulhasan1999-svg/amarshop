import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@/i18n'

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      language: 'en',
      currency: 'BDT',
      company: 'BuildEst Consultants Ltd.',

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setLanguage: (language) => {
        i18n.changeLanguage(language)
        localStorage.setItem('buildest-lang', language)
        set({ language })
      },
      setCurrency: (currency) => set({ currency }),
      toggleCurrency: () => set({ currency: get().currency === 'BDT' ? 'USD' : 'BDT' }),
      setCompany: (company) => set({ company }),
    }),
    { name: 'buildest-settings' },
  ),
)
