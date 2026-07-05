import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HardHat, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NAV_SECTIONS } from './nav'
import { cn } from '@/lib/utils'

function NavItems({ onNavigate }) {
  const { t } = useTranslation()
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 scrollbar-thin">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t(section.label)}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active"
                        className="absolute left-0 h-6 w-1 rounded-r-full bg-primary"
                      />
                    )}
                    <item.icon className="h-[18px] w-[18px]" />
                    <span>{t(item.label)}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function Brand() {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <HardHat className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <p className="text-base font-extrabold tracking-tight">{t('app.name')}</p>
        <p className="text-[10px] text-muted-foreground">{t('app.tagline')}</p>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card lg:flex">
      <Brand />
      <NavItems />
    </aside>
  )
}

export function MobileSidebar({ open, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="absolute inset-y-0 left-0 flex w-72 flex-col bg-card shadow-xl"
      >
        <div className="flex items-center justify-between pr-3">
          <Brand />
          <button
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavItems onNavigate={onClose} />
      </motion.aside>
    </div>
  )
}
