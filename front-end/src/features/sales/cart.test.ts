import { describe, it, expect } from 'vitest'
import {
  addToCart,
  cartItemCount,
  cartTotalCents,
  changeQuantity,
  removeLine,
  toCents,
  type CartProduct,
} from './cart'

const camiseta: CartProduct = { id: 1, name: 'Camiseta básica M', sku: 'CAM-0042', sale_price: '89.90', stock_quantity: 3 }
const caneca: CartProduct = { id: 2, name: 'Caneca branca', sku: 'CAN-0110', sale_price: '24.90', stock_quantity: 8 }
const esgotado: CartProduct = { id: 3, name: 'Garrafa', sku: 'CAS-0231', sale_price: '79.90', stock_quantity: 0 }

describe('carrinho do PDV', () => {
  it('converte preço em centavos sem erro de ponto flutuante', () => {
    expect(toCents('89.90')).toBe(8990)
    expect(toCents('0.10') + toCents('0.20')).toBe(30)
  })

  it('adiciona produto e soma a quantidade ao repetir', () => {
    let lines = addToCart([], camiseta)
    lines = addToCart(lines, camiseta)
    expect(lines).toHaveLength(1)
    expect(lines[0].quantity).toBe(2)
  })

  it('não passa do estoque disponível', () => {
    let lines = addToCart([], camiseta)
    for (let i = 0; i < 10; i++) lines = addToCart(lines, camiseta)
    expect(lines[0].quantity).toBe(3)
    expect(changeQuantity(lines, 1, 1)[0].quantity).toBe(3)
  })

  it('ignora produto sem estoque', () => {
    expect(addToCart([], esgotado)).toEqual([])
  })

  it('remove a linha ao diminuir até zero', () => {
    const lines = addToCart([], caneca)
    expect(changeQuantity(lines, 2, -1)).toEqual([])
  })

  it('calcula total e quantidade de itens', () => {
    let lines = addToCart([], camiseta)
    lines = addToCart(lines, camiseta)
    lines = addToCart(lines, caneca)
    expect(cartTotalCents(lines)).toBe(2 * 8990 + 2490)
    expect(cartItemCount(lines)).toBe(3)
    expect(cartTotalCents(removeLine(lines, 1))).toBe(2490)
  })
})
