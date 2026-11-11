import { apiFetch } from './client'

export interface SaleItemInput {
  product_id: number
  quantity: number
}

export interface SoldItem {
  product_id: number
  quantity: number
  unit_price: string
}

export interface CreatedSale {
  id: number
  created_at: string
  total: string
  status: 'completed'
  items: SoldItem[]
}

export interface SaleSummary {
  id: number
  created_at: string
  total: string
  status: 'completed' | 'canceled'
  operator_name: string
  items_count: number
}

export function createSale(items: SaleItemInput[]): Promise<CreatedSale> {
  return apiFetch<CreatedSale>('/vendas', { method: 'POST', body: { items } })
}

export function listSales(): Promise<SaleSummary[]> {
  return apiFetch<SaleSummary[]>('/vendas')
}
