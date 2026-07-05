import { useCallback } from 'react'
import { useSettingsStore } from '@/store/useSettingsStore'
import { formatCurrency } from '@/lib/format'

export function useCurrency() {
  const currency = useSettingsStore((s) => s.currency)
  const fmt = useCallback(
    (amountBdt, options) => formatCurrency(amountBdt, currency, options),
    [currency],
  )
  return { currency, fmt }
}
