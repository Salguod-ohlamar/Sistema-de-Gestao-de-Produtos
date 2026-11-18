import { apiFetch } from './client'

export interface ApiProduct {
  id: number
  name: string
  sku: string
  category: string | null
  brand: string | null
  barcode: string | null
  image_url: string | null
  stock_quantity: number
  min_stock_quantity: number
  sale_price: string
  cost_price: string
  unit: string | null
  created_at?: string
  updated_at?: string
}

export interface ProductInput {
  name: string
  sku: string
  category: string
  brand?: string
  barcode?: string
  image_url?: string
  stock_quantity: number
  min_stock_quantity: number
  sale_price: number
  cost_price: number
  final_price?: number
  markup?: number
  unit: string
}

// Busca ou obtém list products e entrega o resultado ao chamador.
export function listProducts(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>('/produtos')
}

// Busca ou obtém get product e entrega o resultado ao chamador.
export function getProduct(id: number): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/produtos/${id}`)
}

// Busca ou obtém find product by code e entrega o resultado ao chamador.
export function findProductByCode(code: string): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/produtos/codigo/${encodeURIComponent(code)}`)
}

// Cria ou registra create product e trata o resultado da operação.
export function createProduct(input: ProductInput): Promise<ApiProduct> {
  return apiFetch<ApiProduct>('/produtos', { method: 'POST', body: { ...input } })
}

// Atualiza ou altera update product, aplicando os dados recebidos.
export function updateProduct(id: number, input: ProductInput): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/produtos/${id}`, { method: 'PUT', body: { ...input } })
}

// Remove ou cancela delete product e devolve o resultado da operação.
export function deleteProduct(id: number): Promise<null> {
  return apiFetch<null>(`/produtos/${id}`, { method: 'DELETE' })
}
