import {
  LayoutDashboard,
  FolderKanban,
  Table2,
  Calculator,
  Coins,
  FileText,
  Zap,
  Settings,
} from 'lucide-react'

export const NAV_SECTIONS = [
  {
    label: 'nav.main',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'nav.dashboard', end: true },
      { to: '/projects', icon: FolderKanban, label: 'nav.projects' },
      { to: '/boq', icon: Table2, label: 'nav.boq' },
    ],
  },
  {
    label: 'nav.tools',
    items: [
      { to: '/materials', icon: Calculator, label: 'nav.materials' },
      { to: '/cost', icon: Coins, label: 'nav.cost' },
      { to: '/reports', icon: FileText, label: 'nav.reports' },
      { to: '/quick-estimate', icon: Zap, label: 'nav.quickEstimate' },
      { to: '/settings', icon: Settings, label: 'nav.settings' },
    ],
  },
]
