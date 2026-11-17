import { describe, it, expect } from 'vitest'
import { mapApiProduct, stockStatus } from './productMapper'

const base = {
  id: 7,
  name: 'Camiseta Básica',
  sku: 'CAM-01',
  category: null,
  image_url: null,
  stock_quantity: 10,
  min_stock_quantity: 5,
  sale_price: '59.90',
}

describe('productMapper', () => {
  it('classifica o estoque como o backend (zero, no mínimo ou abaixo, ok)', () => {
    expect(stockStatus(0, 5).status).toBe('Esgotado')
    expect(stockStatus(5, 5).status).toBe('Estoque baixo')
    expect(stockStatus(6, 5).status).toBe('Em estoque')
  })

  it('formata preço em reais e preenche categoria vazia', () => {
    const row = mapApiProduct(base)
    expect(row.id).toBe('7')
    expect(row.price.replace(/\s/g, ' ')).toBe('R$ 59,90')
    expect(row.category).toBe('Sem categoria')
    expect(row.image).toBeUndefined()
    expect(row.updatedAt).toBe('—')
  })

  it('nunca gera denominador zero na barra de estoque', () => {
    expect(mapApiProduct({ ...base, stock_quantity: 0, min_stock_quantity: 0 }).stockMax).toBe(1)
  })
})
