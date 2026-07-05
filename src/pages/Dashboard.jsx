import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Wallet, Package, HardHat, FolderKanban, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CostPieChart } from '@/components/charts/CostPieChart'
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart'
import { useProjectStore } from '@/store/useProjectStore'
import { useCurrency } from '@/hooks/useCurrency'
import { portfolioTotals, costSummary } from '@/lib/calc'
import { MONTHLY_PROGRESS } from '@/data/seed'
import { formatDate } from '@/lib/utils'

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const projects = useProjectStore((s) => s.projects)
  const { fmt } = useCurrency()

  const totals = useMemo(() => portfolioTotals(projects), [projects])
  const activeCount = projects.filter((p) => p.status !== 'completed').length
  const recent = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5),
    [projects],
  )

  return (
    <PageTransition>
      <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Wallet}
          tone="primary"
          label={t('dashboard.totalCost')}
          value={fmt(totals.grandTotal, { compact: true })}
          sub={`${projects.length} ${t('nav.projects').toLowerCase()}`}
          delay={0}
        />
        <StatCard
          icon={Package}
          tone="blue"
          label={t('dashboard.materialCost')}
          value={fmt(totals.material, { compact: true })}
          delay={0.06}
        />
        <StatCard
          icon={HardHat}
          tone="purple"
          label={t('dashboard.laborCost')}
          value={fmt(totals.labor, { compact: true })}
          delay={0.12}
        />
        <StatCard
          icon={FolderKanban}
          tone="green"
          label={t('dashboard.activeProjects')}
          value={activeCount}
          sub={`${projects.length - activeCount} ${t('dashboard.completed').toLowerCase()}`}
          delay={0.18}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.costDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CostPieChart totals={totals} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t('dashboard.monthlyProgress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyBarChart rows={MONTHLY_PROGRESS} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>{t('dashboard.recentProjects')}</CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-primary">
            <Link to="/projects">
              {t('dashboard.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {recent.map((p) => {
            const s = costSummary(p)
            return (
              <button
                key={p.id}
                onClick={() => navigate(`/boq?project=${p.id}`)}
                className="flex w-full items-center gap-4 rounded-lg border p-3 text-left transition-colors hover:bg-accent"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.client} · {p.location}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold">{fmt(s.grandTotal, { compact: true })}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(p.startDate)}</p>
                </div>
                <StatusBadge status={p.status} />
              </button>
            )
          })}
        </CardContent>
      </Card>
    </PageTransition>
  )
}
