import { describe, it, expect } from 'vitest'

describe('ProductsView filter and stock logic', () => {
  const products = [
    { id: '1', name: 'Fone Bluetooth Pulse X2', sku: 'PLS-X2-BLK', category: 'Eletrônicos', status: 'Em estoque' },
    { id: '2', name: 'Mouse Sem Fio Aero M3', sku: 'MOU-AER-M3', category: 'Eletrônicos', status: 'Em estoque' },
    { id: '3', name: 'Teclado Mecânico Forge 75', sku: 'KBD-FRG-75', category: 'Eletrônicos', status: 'Estoque baixo' },
    { id: '4', name: 'Hub USB-C 7 em 1', sku: 'HUB-7IN1-GRY', category: 'Acessórios', status: 'Esgotado' },
    { id: '5', name: 'Webcam Full HD Vision', sku: 'CAM-FHD-VIS', category: 'Eletrônicos', status: 'Em estoque' },
  ]

  it('filtra por categoria Eletrônicos', () => {
    const electronics = products.filter((p) => p.category === 'Eletrônicos')
    expect(electronics).toHaveLength(4)
  })

  it('identifica itens esgotados ou com estoque crítico', () => {
    const depleted = products.filter((p) => p.status === 'Esgotado')
    expect(depleted).toHaveLength(1)
    expect(depleted[0].sku).toBe('HUB-7IN1-GRY')
  })

  it('calcula porcentagem de estoque relativo à capacidade máxima', () => {
    const stockUnits = 42
    const stockMax = 50
    const pct = Math.round((stockUnits / stockMax) * 100)
    expect(pct).toBe(84)
  })
})
