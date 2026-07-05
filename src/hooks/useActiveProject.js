import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProjectStore } from '@/store/useProjectStore'

// Reads/writes the active project id from the `project` query param and
// falls back to the first available project.
export function useActiveProject() {
  const [params, setParams] = useSearchParams()
  const projects = useProjectStore((s) => s.projects)
  const paramId = params.get('project')

  const active =
    projects.find((p) => p.id === paramId) || projects[0] || null

  useEffect(() => {
    if (!paramId && active) {
      setParams({ project: active.id }, { replace: true })
    }
  }, [paramId, active, setParams])

  const setActive = (id) => setParams({ project: id }, { replace: true })

  return { projects, active, setActive }
}
