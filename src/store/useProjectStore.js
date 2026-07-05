import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '@/lib/utils'
import { defaultCost } from '@/lib/calc'
import { seedProjects } from '@/data/seed'

export const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: seedProjects(),

      addProject: (data) => {
        const project = {
          id: uid('prj'),
          name: data.name,
          location: data.location || '',
          client: data.client || '',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          status: data.status || 'planning',
          createdAt: new Date().toISOString(),
          boq: [],
          cost: defaultCost(),
        }
        set({ projects: [project, ...get().projects] })
        return project.id
      },

      updateProject: (id, data) =>
        set({
          projects: get().projects.map((p) =>
            p.id === id ? { ...p, ...data } : p,
          ),
        }),

      deleteProject: (id) =>
        set({ projects: get().projects.filter((p) => p.id !== id) }),

      getProject: (id) => get().projects.find((p) => p.id === id),

      // ---- BOQ operations ----
      addBoqItem: (projectId, item) =>
        set({
          projects: get().projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  boq: [
                    ...p.boq,
                    {
                      id: uid('boq'),
                      description: item?.description || '',
                      category: item?.category || 'Miscellaneous',
                      unit: item?.unit || 'nos',
                      quantity: item?.quantity ?? 0,
                      rate: item?.rate ?? 0,
                    },
                  ],
                }
              : p,
          ),
        }),

      updateBoqItem: (projectId, itemId, patch) =>
        set({
          projects: get().projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  boq: p.boq.map((it) =>
                    it.id === itemId ? { ...it, ...patch } : it,
                  ),
                }
              : p,
          ),
        }),

      removeBoqItem: (projectId, itemId) =>
        set({
          projects: get().projects.map((p) =>
            p.id === projectId
              ? { ...p, boq: p.boq.filter((it) => it.id !== itemId) }
              : p,
          ),
        }),

      reorderBoq: (projectId, boq) =>
        set({
          projects: get().projects.map((p) =>
            p.id === projectId ? { ...p, boq } : p,
          ),
        }),

      updateCost: (projectId, patch) =>
        set({
          projects: get().projects.map((p) =>
            p.id === projectId
              ? { ...p, cost: { ...defaultCost(), ...p.cost, ...patch } }
              : p,
          ),
        }),

      resetData: () => set({ projects: seedProjects() }),
    }),
    { name: 'buildest-projects' },
  ),
)
