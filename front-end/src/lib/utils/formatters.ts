/**
 * Utilitários centralizados de formatação para o padrão brasileiro (pt-BR)
 */

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const decimalFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const integerFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

/**
 * Formata um valor numérico para Moeda Brasileira (R$ 1.250,50)
 */
export function formatCurrency(value: number): string {
  if (isNaN(value)) return 'R$ 0,00'
  return currencyFormatter.format(value)
}

/**
 * Formata um número com 2 casas decimais (1.250,50)
 */
export function formatDecimal(value: number): string {
  if (isNaN(value)) return '0,00'
  return decimalFormatter.format(value)
}

/**
 * Formata número inteiro com separador de milhar (1.250)
 */
export function formatInteger(value: number): string {
  if (isNaN(value)) return '0'
  return integerFormatter.format(value)
}

/**
 * Formata porcentagem (+12,5% ou -2,3%)
 */
export function formatPercent(value: number, includeSign = false): string {
  if (isNaN(value)) return '0,0%'
  const formatted = percentFormatter.format(value / 100)
  if (includeSign && value > 0) {
    return `+${formatted}`
  }
  return formatted
}

/**
 * Formata data curta (ex: "14/10/2026")
 */
export function formatDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d)
  } catch {
    return String(date)
  }
}

/**
 * Formata data e hora (ex: "14 out, 11:20")
 */
export function formatDateTime(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    const day = d.toLocaleDateString('pt-BR', { day: '2-digit' })
    const month = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
    const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    return `${day} ${month}, ${time}`
  } catch {
    return String(date)
  }
}
