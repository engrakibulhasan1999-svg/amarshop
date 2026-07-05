import { create } from 'zustand'
import { uid } from '@/lib/utils'

export const useToastStore = create((set, get) => ({
  toasts: [],
  toast: ({ title, description, variant = 'default', duration = 3200 }) => {
    const id = uid('toast')
    set({ toasts: [...get().toasts, { id, title, description, variant }] })
    setTimeout(() => {
      set({ toasts: get().toasts.filter((t) => t.id !== id) })
    }, duration)
    return id
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

export const toast = (opts) => useToastStore.getState().toast(opts)
