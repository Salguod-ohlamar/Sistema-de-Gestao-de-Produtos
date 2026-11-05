export type StatusFilter = 'all' | 'Em estoque' | 'Estoque baixo' | 'Esgotado'
export type StockRange = 'all' | 'zero' | 'low' | 'mid' | 'high'
export type PriceRange = 'all' | 'lt100' | '100to300' | 'gt300'

export interface FilterableProduct {
  name: string
  sku: string
  category: string
  price: string
  stockUnits: number
  status: string
}

export interface ProductFilters {
  query: string
  category: string | null
  status: StatusFilter
  stock: StockRange
  price: PriceRange
}

export const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'Em estoque', label: 'Em estoque' },
  { value: 'Estoque baixo', label: 'Estoque baixo' },
  { value: 'Esgotado', label: 'Esgotado' },
]

export const STOCK_OPTIONS: { value: StockRange; label: string }[] = [
  { value: 'all', label: 'Qualquer' },
  { value: 'zero', label: 'Zerado' },
  { value: 'low', label: '1 a 10 un' },
  { value: 'mid', label: '11 a 30 un' },
  { value: 'high', label: 'Mais de 30 un' },
]

export const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: 'all', label: 'Qualquer' },
  { value: 'lt100', label: 'Até R$ 100' },
  { value: '100to300', label: 'R$ 100 a R$ 300' },
  { value: 'gt300', label: 'Acima de R$ 300' },
]

/** Converte 'R$ 1.249,90' em 1249.9 */
export function parsePrice(price: string): number {
  const n = Number(price.replace(/[^\d,]/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

export function matchesStock(units: number, range: StockRange): boolean {
  switch (range) {
    case 'zero':
      return units === 0
    case 'low':
      return units >= 1 && units <= 10
    case 'mid':
      return units >= 11 && units <= 30
    case 'high':
      return units > 30
    default:
      return true
  }
}

export function matchesPrice(value: number, range: PriceRange): boolean {
  switch (range) {
    case 'lt100':
      return value < 100
    case '100to300':
      return value >= 100 && value <= 300
    case 'gt300':
      return value > 300
    default:
      return true
  }
}

export function filterProducts<T extends FilterableProduct>(
  products: T[],
  f: ProductFilters
): T[] {
  const q = f.query.trim().toLowerCase()
  return products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false
    if (f.category && p.category !== f.category) return false
    if (f.status !== 'all' && p.status !== f.status) return false
    if (!matchesStock(p.stockUnits, f.stock)) return false
    if (!matchesPrice(parsePrice(p.price), f.price)) return false
    return true
  })
}

export { paginate, pageWindow } from '@/lib/pagination'
