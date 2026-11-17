import { apiFetch } from './client'

export interface DashboardTopProduct {
  product_id: number
  name: string
  sku: string
  quantity_sold: number
  revenue: string
}

export interface DashboardLowStock {
  product_id: number
  name: string
  sku: string
  stock_quantity: number
  min_stock_quantity: number
}

export interface DashboardData {
  period: { from: string; to: string }
  summary: {
    sales_count: number
    revenue: string
    average_ticket: string
    low_stock_count: number
  }
  top_products: DashboardTopProduct[]
  stagnant_products: { product_id: number; name: string; sku: string; stock_quantity: number }[]
  low_stock: DashboardLowStock[]
}

export function getDashboard(from: string, to: string, limit = 5): Promise<DashboardData> {
  const qs = new URLSearchParams({ from, to, limit: String(limit) })
  return apiFetch<DashboardData>(`/dashboard?${qs.toString()}`)
}
