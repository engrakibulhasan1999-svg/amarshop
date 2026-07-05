import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

const MAP = {
  planning: { variant: 'secondary', key: 'projects.statusPlanning' },
  ongoing: { variant: 'default', key: 'projects.statusOngoing' },
  completed: { variant: 'success', key: 'projects.statusCompleted' },
  onhold: { variant: 'warning', key: 'projects.statusOnHold' },
}

export function StatusBadge({ status }) {
  const { t } = useTranslation()
  const cfg = MAP[status] || MAP.planning
  return <Badge variant={cfg.variant}>{t(cfg.key)}</Badge>
}
