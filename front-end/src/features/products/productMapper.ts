import type { ApiProduct } from '@/lib/api'

export type ProductStatus = 'Em estoque' | 'Estoque baixo' | 'Esgotado'
export type StatusVariant = 'success' | 'warning' | 'destructive'

/** Linha da tabela de Produtos, já formatada para exibição. */
export interface ProductRow {
  id: string
  name: string
  sku: string
  category: string
  price: string
  stockUnits: number
  stockMax: number
  status: ProductStatus
  statusVariant: StatusVariant
  updatedAt: string
  image?: string
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatBrl(value: string | number): string {
  const n = Number(value)
  return brl.format(Number.isFinite(n) ? n : 0)
}

/** Esgotado = 0; baixo = no mínimo cadastrado ou abaixo (mesma regra do backend). */
export function stockStatus(
  stock: number,
  min: number
): { status: ProductStatus; variant: StatusVariant } {
  if (stock <= 0) return { status: 'Esgotado', variant: 'destructive' }
  if (stock <= min) return { status: 'Estoque baixo', variant: 'warning' }
  return { status: 'Em estoque', variant: 'success' }
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
}

export function mapApiProduct(p: ApiProduct): ProductRow {
  const { status, variant } = stockStatus(p.stock_quantity, p.min_stock_quantity)
  return {
    id: String(p.id),
    name: p.name,
    sku: p.sku,
    category: p.category ?? 'Sem categoria',
    price: formatBrl(p.sale_price),
    stockUnits: p.stock_quantity,
    // O barramento visual usa o maior entre o mínimo x2 e o estoque atual como referência.
    stockMax: Math.max(p.min_stock_quantity * 2, p.stock_quantity, 1),
    status,
    statusVariant: variant,
    updatedAt: formatDate(p.updated_at ?? p.created_at),
    image: p.image_url ?? undefined,
  }
}
