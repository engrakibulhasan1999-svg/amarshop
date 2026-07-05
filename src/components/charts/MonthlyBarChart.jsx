import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { CHART_COLORS } from './registerCharts'
import { convert, CURRENCIES } from '@/lib/format'
import { useSettingsStore } from '@/store/useSettingsStore'

export function MonthlyBarChart({ rows }) {
  const { t } = useTranslation()
  const currency = useSettingsStore((s) => s.currency)
  const themeIsDark = useSettingsStore((s) => s.theme === 'dark')
  const grid = themeIsDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const tick = themeIsDark ? '#94a3b8' : '#64748b'

  const data = useMemo(
    () => ({
      labels: rows.map((r) => r.month),
      datasets: [
        {
          label: t('dashboard.planned'),
          data: rows.map((r) => convert(r.planned, currency)),
          backgroundColor: CHART_COLORS.planned,
          borderRadius: 6,
          maxBarThickness: 22,
        },
        {
          label: t('dashboard.completed'),
          data: rows.map((r) => convert(r.completed, currency)),
          backgroundColor: CHART_COLORS.completed,
          borderRadius: 6,
          maxBarThickness: 22,
        },
      ],
    }),
    [rows, t, currency],
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const sym = CURRENCIES[currency].symbol
              const val = new Intl.NumberFormat(undefined, {
                maximumFractionDigits: currency === 'USD' ? 2 : 0,
              }).format(ctx.parsed.y)
              return ` ${ctx.dataset.label}: ${sym}${val}`
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: tick } },
        y: {
          grid: { color: grid },
          ticks: {
            color: tick,
            callback: (v) => new Intl.NumberFormat(undefined, { notation: 'compact' }).format(v),
          },
        },
      },
    }),
    [grid, tick, currency],
  )

  return (
    <div className="relative h-72">
      <Bar data={data} options={options} />
    </div>
  )
}
