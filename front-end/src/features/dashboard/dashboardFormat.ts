import type { DashboardDailySale } from '@/lib/api'

export interface DateRange {
  from: string
  to: string
}

// Formata ou converte to date input value para o formato exigido pela interface.
function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Implementa a operação relacionada a date range for days.
export function dateRangeForDays(days: number, now = new Date()): DateRange {
  if (!Number.isInteger(days) || days < 1) {
    throw new RangeError('O período deve conter pelo menos um dia.')
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  // Implementa a operação relacionada a date part.
  const datePart = (type: 'year' | 'month' | 'day') =>
    Number(parts.find((part) => part.type === type)?.value)
  const to = new Date(datePart('year'), datePart('month') - 1, datePart('day'), 12)
  const from = new Date(to)
  from.setDate(from.getDate() - days + 1)
  return { from: toDateInputValue(from), to: toDateInputValue(to) }
}

// Implementa a operação relacionada a fill daily sales.
export function fillDailySales(
  sales: DashboardDailySale[],
  from: string,
  to: string
): DashboardDailySale[] {
  const byDate = new Map(sales.map((sale) => [sale.date, sale]))
  const cursor = new Date(`${from}T12:00:00`)
  const end = new Date(`${to}T12:00:00`)
  const result: DashboardDailySale[] = []

  while (cursor <= end) {
    const date = toDateInputValue(cursor)
    result.push(byDate.get(date) ?? { date, sales_count: 0, revenue: '0.00' })
    cursor.setDate(cursor.getDate() + 1)
  }

  return result
}

// Implementa a operação relacionada a date label.
export function dateLabel(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(
    new Date(year, month - 1, day, 12)
  )
}
