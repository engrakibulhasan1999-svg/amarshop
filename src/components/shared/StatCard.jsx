import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const tones = {
  primary: 'bg-primary/10 text-primary',
  blue: 'bg-blue-500/10 text-blue-500',
  purple: 'bg-purple-500/10 text-purple-500',
  green: 'bg-success/10 text-success',
}

export function StatCard({ icon: Icon, label, value, sub, tone = 'primary', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card className="overflow-hidden">
        <CardContent className="flex items-center gap-4 p-5">
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', tones[tone])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-muted-foreground">{label}</p>
            <p className="truncate text-xl font-bold tracking-tight md:text-2xl">{value}</p>
            {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
