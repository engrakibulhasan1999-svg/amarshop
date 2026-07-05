import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCurrency } from '@/hooks/useCurrency'

// Indicative per-sft construction rates in BDT.
const TYPES = {
  economy: { rate: 1500, key: 'quick.economy' },
  standard: { rate: 2200, key: 'quick.standard' },
  premium: { rate: 3200, key: 'quick.premium' },
  luxury: { rate: 4500, key: 'quick.luxury' },
}

const SFT_PER_SQM = 10.7639

// Typical cost split for a residential building.
const SPLIT = [
  { key: 'dashboard.material', pct: 0.6, color: 'bg-primary' },
  { key: 'dashboard.labor', pct: 0.25, color: 'bg-blue-500' },
  { key: 'dashboard.misc', pct: 0.1, color: 'bg-purple-500' },
  { key: 'dashboard.profit', pct: 0.05, color: 'bg-success' },
]

export default function QuickEstimate() {
  const { t } = useTranslation()
  const { fmt } = useCurrency()
  const [area, setArea] = useState(1200)
  const [unit, setUnit] = useState('sft')
  const [type, setType] = useState('standard')

  const { total, rate } = useMemo(() => {
    const a = Number(area) || 0
    const sft = unit === 'sqm' ? a * SFT_PER_SQM : a
    const r = TYPES[type].rate
    return { total: sft * r, rate: r }
  }, [area, unit, type])

  return (
    <PageTransition>
      <PageHeader title={t('quick.title')} subtitle={t('quick.subtitle')} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {t('quick.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>{t('quick.builtupArea')}</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t('boq.unit')}</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sft">{t('units.sft')}</SelectItem>
                    <SelectItem value="sqm">{t('units.sqm')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('quick.constructionType')}</Label>
              <Tabs value={type} onValueChange={setType}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                  {Object.entries(TYPES).map(([k, v]) => (
                    <TabsTrigger key={k} value={k}>
                      {t(v.key)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <p className="text-xs text-muted-foreground">
                {t('quick.ratePerUnit')} {t('units.sft')}: {fmt(rate)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('quick.estimatedCost')}</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              key={total}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-primary/5 p-6 text-center"
            >
              <p className="text-3xl font-extrabold text-primary md:text-4xl">
                {fmt(total, { compact: true })}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('quick.perArea')} {t('units.sft')}: {fmt(rate)}
              </p>
            </motion.div>

            <div className="mt-5 space-y-3">
              <p className="text-xs text-muted-foreground">{t('quick.breakdownNote')}</p>
              {SPLIT.map((row) => (
                <div key={row.key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t(row.key)}</span>
                    <span className="font-semibold tabular-nums">
                      {fmt(total * row.pct, { compact: true })}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.pct * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${row.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
