import { useTranslation } from 'react-i18next'
import { FileText, FileSpreadsheet, Download } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { EmptyState } from '@/components/shared/EmptyState'
import { ProjectPicker } from '@/components/shared/ProjectPicker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useCurrency } from '@/hooks/useCurrency'
import { costSummary, lineAmount } from '@/lib/calc'
import { exportBoqPdf, exportBoqExcel } from '@/lib/exporters'
import { formatDate } from '@/lib/utils'
import { formatNumber } from '@/lib/format'
import { toast } from '@/store/useToastStore'

export default function Reports() {
  const { t } = useTranslation()
  const { projects, active, setActive } = useActiveProject()
  const { currency, fmt } = useCurrency()
  const company = useSettingsStore((s) => s.company)

  if (!active) {
    return (
      <PageTransition>
        <PageHeader title={t('reports.title')} subtitle={t('reports.subtitle')} />
        <EmptyState icon={FileText} title={t('reports.noProject')} />
      </PageTransition>
    )
  }

  const s = costSummary(active)

  const handlePdf = async () => {
    await exportBoqPdf(active, { currency, company })
    toast({ variant: 'success', title: t('reports.exportPdf'), description: active.name })
  }
  const handleExcel = async () => {
    await exportBoqExcel(active, { currency })
    toast({ variant: 'success', title: t('reports.exportExcel'), description: active.name })
  }

  return (
    <PageTransition>
      <PageHeader
        title={t('reports.title')}
        subtitle={t('reports.subtitle')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <ProjectPicker projects={projects} value={active.id} onChange={setActive} />
            <Button variant="outline" className="gap-2" onClick={handleExcel}>
              <FileSpreadsheet className="h-4 w-4" />
              {t('reports.exportExcel')}
            </Button>
            <Button className="gap-2" onClick={handlePdf}>
              <Download className="h-4 w-4" />
              {t('reports.exportPdf')}
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">{company}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('reports.boqReport')}</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-y-1 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">{t('reports.project')}</p>
              <p className="font-medium">{active.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('projects.client')}</p>
              <p className="font-medium">{active.client || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('projects.location')}</p>
              <p className="font-medium">{active.location || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('reports.generatedOn')}</p>
              <p className="font-medium">{formatDate(new Date())}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>{t('boq.description')}</TableHead>
                <TableHead>{t('boq.category')}</TableHead>
                <TableHead>{t('boq.unit')}</TableHead>
                <TableHead className="text-right">{t('boq.quantity')}</TableHead>
                <TableHead className="text-right">{t('boq.rate')}</TableHead>
                <TableHead className="text-right">{t('boq.amount')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {active.boq.map((it, i) => (
                <TableRow key={it.id}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium">{it.description || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{it.category}</TableCell>
                  <TableCell>{t(`units.${it.unit}`)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(it.quantity)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(it.rate)}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {fmt(lineAmount(it))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="text-right font-semibold">
                  {t('cost.materialCost')}
                </TableCell>
                <TableCell className="text-right tabular-nums">{fmt(s.material)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} className="text-right font-semibold">
                  {t('cost.laborCost')} + {t('cost.miscCost')}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {fmt(s.labor + s.misc)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} className="text-right font-semibold">
                  {t('cost.profitAmount')} + {t('cost.vatAmount')}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {fmt(s.profit + s.vat)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-primary/5">
                <TableCell colSpan={6} className="text-right text-base font-bold">
                  {t('cost.grandTotal')}
                </TableCell>
                <TableCell className="text-right text-base font-bold text-primary tabular-nums">
                  {fmt(s.grandTotal)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
