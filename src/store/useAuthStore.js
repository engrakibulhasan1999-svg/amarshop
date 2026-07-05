import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Demo-only auth. Credentials are not validated against a backend.
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: ({ email, name }) =>
        set({
          isAuthenticated: true,
          user: {
            email,
            name: name || email.split('@')[0],
          },
        }),

      register: ({ name, email }) =>
        set({
          isAuthenticated: true,
          user: { name, email },
        }),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'buildest-auth' },
  ),
)
