import { apiFetch } from './client'

/** Campos do produto usados pelo PDV (o backend devolve mais colunas). */
export interface ApiProduct {
  id: number
  name: string
  sku: string
  category: string | null
  image_url: string | null
  stock_quantity: number
  min_stock_quantity: number
  /** numeric(10,2) chega como string no JSON */
  sale_price: string
  /** podem não existir dependendo da versão da tabela */
  created_at?: string | null
  updated_at?: string | null
}

export function listProducts(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>('/produtos')
}
