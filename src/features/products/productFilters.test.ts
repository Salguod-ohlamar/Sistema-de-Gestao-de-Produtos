import { describe, it, expect } from 'vitest'
import { filterProducts, paginate, pageWindow, parsePrice } from './productFilters'

const base = { query: '', category: null, status: 'all', stock: 'all', price: 'all' } as const
const items = [
  { name: 'Fone', sku: 'A-1', category: 'Eletrônicos', price: 'R$ 249,90', stockUnits: 42, status: 'Em estoque' },
  { name: 'Hub', sku: 'B-2', category: 'Acessórios', price: 'R$ 89,90', stockUnits: 0, status: 'Esgotado' },
  { name: 'Teclado', sku: 'C-3', category: 'Eletrônicos', price: 'R$ 1.249,00', stockUnits: 8, status: 'Estoque baixo' },
]

describe('productFilters', () => {
  it('converte preço em reais', () => {
    expect(parsePrice('R$ 1.249,90')).toBe(1249.9)
  })
  it('filtra por status, estoque e preço', () => {
    expect(filterProducts(items, { ...base, status: 'Esgotado' })).toHaveLength(1)
    expect(filterProducts(items, { ...base, stock: 'low' })[0].sku).toBe('C-3')
    expect(filterProducts(items, { ...base, price: 'gt300' })[0].sku).toBe('C-3')
    expect(filterProducts(items, { ...base, price: 'lt100' })[0].sku).toBe('B-2')
  })
  it('busca por nome ou SKU', () => {
    expect(filterProducts(items, { ...base, query: 'c-3' })).toHaveLength(1)
  })
  it('pagina e ajusta página fora do limite', () => {
    const p = paginate([1, 2, 3, 4, 5], 9, 2)
    expect(p.page).toBe(3)
    expect(p.items).toEqual([5])
    expect(paginate([], 1, 8)).toMatchObject({ from: 0, to: 0, totalPages: 1 })
  })
  it('janela de páginas com reticências', () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3])
    expect(pageWindow(5, 10)).toEqual([1, null, 4, 5, 6, null, 10])
  })
})
