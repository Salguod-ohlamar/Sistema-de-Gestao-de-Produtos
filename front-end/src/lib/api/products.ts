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

/** Corpo aceito por POST /produtos (nomes de coluna do backend). */
export interface CreateProductInput {
  name: string
  sku: string
  category: string
  brand: string | null
  /** O backend recusa mais de 14 caracteres. */
  barcode: string | null
  unit: string
  stock_quantity: number
  min_stock_quantity: number
  cost_price: number
  sale_price: number
}

export function createProduct(input: CreateProductInput): Promise<ApiProduct> {
  return apiFetch<ApiProduct>('/produtos', {
    method: 'POST',
    body: input as unknown as Record<string, unknown>,
  })
}
