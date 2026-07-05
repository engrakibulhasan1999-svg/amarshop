// Central estimation math. All monetary values are in BDT.

export function lineAmount(item) {
  const qty = Number(item.quantity) || 0
  const rate = Number(item.rate) || 0
  return qty * rate
}

export function boqTotal(project) {
  if (!project?.boq?.length) return 0
  return project.boq.reduce((sum, item) => sum + lineAmount(item), 0)
}

export function defaultCost() {
  return { laborCost: 0, miscCost: 0, profitPercent: 10, vatPercent: 7.5 }
}

export function costSummary(project) {
  const cost = { ...defaultCost(), ...(project?.cost || {}) }
  const material = boqTotal(project)
  const labor = Number(cost.laborCost) || 0
  const misc = Number(cost.miscCost) || 0
  const subtotal = material + labor + misc
  const profit = (subtotal * (Number(cost.profitPercent) || 0)) / 100
  const vat = ((subtotal + profit) * (Number(cost.vatPercent) || 0)) / 100
  const grandTotal = subtotal + profit + vat
  return { material, labor, misc, subtotal, profit, vat, grandTotal }
}

export function portfolioTotals(projects = []) {
  return projects.reduce(
    (acc, p) => {
      const s = costSummary(p)
      acc.material += s.material
      acc.labor += s.labor
      acc.misc += s.misc
      acc.profit += s.profit
      acc.vat += s.vat
      acc.grandTotal += s.grandTotal
      return acc
    },
    { material: 0, labor: 0, misc: 0, profit: 0, vat: 0, grandTotal: 0 },
  )
}

// ---- Material estimation helpers ----

// Dry volume factor for wet concrete (typical 1.54)
export const DRY_FACTOR = 1.54
export const CEMENT_DENSITY = 1440 // kg/m3
export const CEMENT_BAG_KG = 50

// ratio like "1:2:4" -> { cement, sand, aggregate, sum }
export function parseMix(ratio) {
  const parts = String(ratio)
    .split(':')
    .map((n) => Number(n.trim()))
    .filter((n) => !Number.isNaN(n) && n > 0)
  const [cement = 1, sand = 2, aggregate = 4] = parts
  return { cement, sand, aggregate, sum: cement + sand + aggregate }
}

// dimensions in metres, wet volume in m3
export function concreteEstimate({ length, width, depth, ratio }) {
  const l = Number(length) || 0
  const w = Number(width) || 0
  const d = Number(depth) || 0
  const wetVolume = l * w * d
  const dryVolume = wetVolume * DRY_FACTOR
  const mix = parseMix(ratio)
  const cementVol = (dryVolume * mix.cement) / mix.sum
  const cementKg = cementVol * CEMENT_DENSITY
  const cementBags = cementKg / CEMENT_BAG_KG
  const sandVol = (dryVolume * mix.sand) / mix.sum
  const aggregateVol = (dryVolume * mix.aggregate) / mix.sum
  return {
    wetVolume,
    dryVolume,
    mix,
    cementBags,
    cementKg,
    sandVolume: sandVol,
    aggregateVolume: aggregateVol,
    // handy CFT values (1 m3 = 35.3147 cft)
    sandCft: sandVol * 35.3147,
    aggregateCft: aggregateVol * 35.3147,
  }
}

// Unit weight of steel bar = d^2 / 162 (kg per metre, d in mm)
export function steelEstimate({ dia, totalLength, count }) {
  const d = Number(dia) || 0
  const len = Number(totalLength) || 0
  const n = Number(count) || 1
  const weightPerM = (d * d) / 162
  const totalWeight = weightPerM * len * n
  return {
    weightPerM,
    totalWeightKg: totalWeight,
    totalWeightTon: totalWeight / 1000,
  }
}
