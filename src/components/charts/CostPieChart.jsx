import { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { CHART_COLORS } from './registerCharts'
import { useCurrency } from '@/hooks/useCurrency'

export function CostPieChart({ totals }) {
  const { t } = useTranslation()
  const { fmt } = useCurrency()

  const data = useMemo(
    () => ({
      labels: [
        t('dashboard.material'),
        t('dashboard.labor'),
        t('dashboard.misc'),
        t('dashboard.profit'),
        t('dashboard.vat'),
      ],
      datasets: [
        {
          data: [totals.material, totals.labor, totals.misc, totals.profit, totals.vat],
          backgroundColor: [
            CHART_COLORS.material,
            CHART_COLORS.labor,
            CHART_COLORS.misc,
            CHART_COLORS.profit,
            CHART_COLORS.vat,
          ],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    }),
    [totals, t],
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, boxWidth: 8 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${fmt(ctx.parsed)}`,
          },
        },
      },
    }),
    [fmt],
  )

  return (
    <div className="relative h-72">
      <Doughnut data={data} options={options} />
    </div>
  )
}
