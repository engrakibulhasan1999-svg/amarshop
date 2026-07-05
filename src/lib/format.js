// Simple static exchange rate for demo currency toggle.
// Base amounts across the app are stored in BDT.
export const USD_PER_BDT = 1 / 117

export const CURRENCIES = {
  BDT: { symbol: '৳', locale: 'en-BD', rate: 1 },
  USD: { symbol: '$', locale: 'en-US', rate: USD_PER_BDT },
}

export function convert(amountBdt, currency = 'BDT') {
  const c = CURRENCIES[currency] || CURRENCIES.BDT
  return amountBdt * c.rate
}

export function formatCurrency(amountBdt, currency = 'BDT', options = {}) {
  const c = CURRENCIES[currency] || CURRENCIES.BDT
  const value = convert(amountBdt, currency)
  const { compact = false, decimals } = options
  const maximumFractionDigits =
    decimals ?? (currency === 'USD' ? 2 : 0)
  const formatted = new Intl.NumberFormat(c.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
  }).format(value)
  return `${c.symbol}${formatted}`
}

export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '0'
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(Number(value))
}
