import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react'
import { useToastStore } from '@/store/useToastStore'
import { cn } from '@/lib/utils'

const icons = {
  default: Info,
  success: CheckCircle2,
  destructive: AlertTriangle,
}

export function Toaster() {
  const { toasts, dismiss } = useToastStore()

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = icons[t.variant] || Info
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-lg border bg-card p-4 shadow-lg',
                t.variant === 'destructive' && 'border-destructive/40',
                t.variant === 'success' && 'border-success/40',
              )}
            >
              <Icon
                className={cn(
                  'mt-0.5 h-5 w-5 shrink-0',
                  t.variant === 'success' && 'text-success',
                  t.variant === 'destructive' && 'text-destructive',
                  t.variant === 'default' && 'text-primary',
                )}
              />
              <div className="flex-1">
                {t.title && <p className="text-sm font-semibold">{t.title}</p>}
                {t.description && (
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
