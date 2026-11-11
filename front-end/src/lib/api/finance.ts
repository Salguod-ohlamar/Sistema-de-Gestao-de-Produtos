import { apiFetch } from './client'

export type ExpenseCategory = 'rent' | 'utilities' | 'payroll' | 'marketing' | 'other'

export interface Expense {
  id: number
  category: ExpenseCategory
  description: string | null
  amount: string
  incurred_on: string
  created_at: string
}

export interface ExpenseInput {
  category: ExpenseCategory
  description?: string
  amount: number
  incurred_on: string
}

export interface Dre {
  period: { from: string; to: string }
  tax_rate: number
  sales_count: number
  gross_revenue: string
  taxes: string
  net_revenue: string
  cmv: string
  gross_profit: string
  gross_margin_pct: number | null
  expenses: { category: ExpenseCategory; total: string }[]
  expenses_total: string
  net_result: string
  warnings: string[]
}

export interface DreQuery {
  from: string
  to: string
  taxRate: number
}

export function getDre({ from, to, taxRate }: DreQuery): Promise<Dre> {
  const qs = new URLSearchParams({ from, to, tax_rate: String(taxRate) })
  return apiFetch<Dre>(`/dre?${qs.toString()}`)
}

export function listExpenses(from: string, to: string): Promise<Expense[]> {
  const qs = new URLSearchParams({ from, to })
  return apiFetch<Expense[]>(`/despesas?${qs.toString()}`)
}

export function createExpense(input: ExpenseInput): Promise<Expense> {
  return apiFetch<Expense>('/despesas', { method: 'POST', body: { ...input } })
}

export function deleteExpense(id: number): Promise<null> {
  return apiFetch<null>(`/despesas/${id}`, { method: 'DELETE' })
}
