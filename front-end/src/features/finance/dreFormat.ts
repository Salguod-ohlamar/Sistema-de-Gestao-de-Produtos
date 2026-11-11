import type { ExpenseCategory } from '@/lib/api'

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  rent: 'Aluguel',
  utilities: 'Água, luz e internet',
  payroll: 'Salários e encargos',
  marketing: 'Marketing',
  other: 'Outras despesas',
}

export const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as ExpenseCategory[]).map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}))

const pad = (n: number) => String(n).padStart(2, '0')

/** Datas locais no formato AAAA-MM-DD (sem passar por UTC). */
export function toDateInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function currentMonthRange(now: Date = new Date()): { from: string; to: string } {
  const first = new Date(now.getFullYear(), now.getMonth(), 1)
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { from: toDateInput(first), to: toDateInput(last) }
}

/** 'AAAA-MM-DD' -> 'DD/MM/AAAA' sem criar Date (evita deslocar o dia por fuso). */
export function formatDateBr(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}
