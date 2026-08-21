import type { ComponentRow } from './AccountComponentsSection'

export const finalAmount = (row: ComponentRow) => {
  const rate = Number(row.rateOrAmount) || 0
  const spread = Number(row.spread) || 0
  return Number((rate + spread).toFixed(2))
}

export const getDrInterestBreakdown = (components: ComponentRow[]) => {
  const rows = components.filter((row) => row.drCr === 'DR' && row.componentType === 'INTEREST')
  const total = rows.reduce((sum, row) => sum + finalAmount(row), 0)
  return { rows, total }
}

export const getCrInterestBreakdown = (components: ComponentRow[]) => {
  const rows = components.filter((row) => row.drCr === 'CR' && row.componentType === 'INTEREST')
  const total = rows.reduce((sum, row) => sum + finalAmount(row), 0)
  return { rows, total }
}
