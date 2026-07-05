import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Coins, Table2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { EmptyState } from '@/components/shared/EmptyState'
import { ProjectPicker } from '@/components/shared/ProjectPicker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CostPieChart } from '@/components/charts/CostPieChart'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useProjectStore } from '@/store/useProjectStore'
import { costSummary, defaultCost } from '@/lib/calc'
import { useCurrency } from '@/hooks/useCurrency'

function Line({ label, value, strong, accent }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={strong ? 'font-semibold' : 'text-muted-foreground'}>{label}</span>
      <span
        className={
          accent
            ? 'text-lg font-bold text-primary tabular-nums'
            : strong
              ? 'font-bold tabular-nums'
              : 'font-medium tabular-nums'
        }
      >
        {value}
      </span>
    </div>
  )
}

export default function Cost() {
  const { t } = useTranslation()
  const { projects, active, setActive } = useActiveProject()
  const updateCost = useProjectStore((s) => s.updateCost)
  const { fmt } = useCurrency()

  if (!active) {
    return (
      <PageTransition>
        <PageHeader title={t('cost.title')} subtitle={t('cost.subtitle')} />
        <EmptyState icon={Coins} title={t('projects.empty')} />
      </PageTransition>
    )
  }

  const cost = { ...defaultCost(), ...active.cost }
  const s = costSummary(active)

  return (
    <PageTransition>
      <PageHeader
        title={t('cost.title')}
        subtitle={t('cost.subtitle')}
        actions={
          <ProjectPicker projects={projects} value={active.id} onChange={setActive} />
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{active.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Table2 className="h-4 w-4" />
                {t('cost.materialCost')} · {t('cost.fromBoq')}
              </div>
              <span className="font-bold tabular-nums">{fmt(s.material)}</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{t('cost.laborCost')}</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={cost.laborCost}
                  onChange={(e) => updateCost(active.id, { laborCost: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t('cost.miscCost')}</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={cost.miscCost}
                  onChange={(e) => updateCost(active.id, { miscCost: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t('cost.profitPercent')}</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={cost.profitPercent}
                  onChange={(e) => updateCost(active.id, { profitPercent: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t('cost.vatPercent')}</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={cost.vatPercent}
                  onChange={(e) => updateCost(active.id, { vatPercent: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="divide-y rounded-lg border px-4">
              <Line label={t('cost.materialCost')} value={fmt(s.material)} />
              <Line label={t('cost.laborCost')} value={fmt(s.labor)} />
              <Line label={t('cost.miscCost')} value={fmt(s.misc)} />
              <Line label={t('cost.subtotal')} value={fmt(s.subtotal)} strong />
              <Line label={`${t('cost.profitAmount')} (${cost.profitPercent}%)`} value={fmt(s.profit)} />
              <Line label={`${t('cost.vatAmount')} (${cost.vatPercent}%)`} value={fmt(s.vat)} />
              <Line label={t('cost.grandTotal')} value={fmt(s.grandTotal)} accent />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('cost.breakdown')}</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div key={s.grandTotal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CostPieChart totals={s} />
            </motion.div>
            <div className="mt-4 rounded-lg bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">{t('cost.grandTotal')}</p>
              <p className="text-2xl font-extrabold text-primary">{fmt(s.grandTotal)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
