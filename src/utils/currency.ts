export const getCurrencySymbol = (currencyCode: string): string => {
  try {
    const parts = new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).formatToParts(0)
    return parts.find((part) => part.type === 'currency')?.value ?? currencyCode
  } catch {
    return currencyCode
  }
}

export const formatCurrencyAmount = (value: number, currencyCode: string, decimals = 2): string =>
  `${getCurrencySymbol(currencyCode)}${value.toFixed(decimals)}`
