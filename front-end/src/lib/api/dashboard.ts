import { apiFetch } from './client'

export interface DashboardQuery {
  from: string
  to: string
}

export interface DashboardDailySale {
  date: string
  sales_count: number
  revenue: string
}

export interface DashboardCategoryStock {
  category: string
  products_count: number
  stock_units: number
}

export interface DashboardTopProduct {
  product_id: number
  name: string
  sku: string
  quantity_sold: number
  revenue: string
}

export interface DashboardLowStockProduct {
  product_id: number
  name: string
  sku: string
  stock_quantity: number
  min_stock_quantity: number
}

export interface DashboardData {
  period: DashboardQuery
  summary: {
    sales_count: number
    revenue: string
    average_ticket: string
    low_stock_count: number
  }
  top_products: DashboardTopProduct[]
  stagnant_products: {
    product_id: number
    name: string
    sku: string
    stock_quantity: number
    last_sold_at: string | null
  }[]
  low_stock: DashboardLowStockProduct[]
  daily_sales: DashboardDailySale[]
  stock_by_category: DashboardCategoryStock[]
}

// Busca ou obtém get dashboard e entrega o resultado ao chamador.
export function getDashboard({ from, to }: DashboardQuery): Promise<DashboardData> {
  const query = new URLSearchParams({ from, to })
  return apiFetch<DashboardData>(`/dashboard?${query.toString()}`)
}
