import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
)

export const CHART_COLORS = {
  material: '#f97316',
  labor: '#3b82f6',
  misc: '#a855f7',
  profit: '#22c55e',
  vat: '#f43f5e',
  planned: '#94a3b8',
  completed: '#f97316',
}
