import { describe, it, expect } from 'vitest'
import {
  EMPTY_PRODUCT_FORM,
  buildCreateProductPayload,
  validateNewProduct,
  type NewProductForm,
} from './newProductForm'

const validForm: NewProductForm = {
  ...EMPTY_PRODUCT_FORM,
  name: '  Caneta azul  ',
  sku: ' CAN-AZ-01 ',
  category: 'Hardware & Componentes',
  salePrice: '4,50',
  costPrice: '1.20',
  currentStock: '10',
  minStock: '2',
}

describe('newProductForm', () => {
  it('formulário inicial é vazio (sem produto de exemplo)', () => {
    expect(EMPTY_PRODUCT_FORM.name).toBe('')
    expect(EMPTY_PRODUCT_FORM.sku).toBe('')
    expect(EMPTY_PRODUCT_FORM.category).toBe('')
    expect(EMPTY_PRODUCT_FORM.salePrice).toBe('')
    expect(validateNewProduct(EMPTY_PRODUCT_FORM)).not.toBeNull()
  })

  it('monta o corpo de POST /produtos com os nomes do backend', () => {
    expect(buildCreateProductPayload(validForm)).toEqual({
      name: 'Caneta azul',
      sku: 'CAN-AZ-01',
      category: 'Hardware & Componentes',
      brand: null,
      barcode: null,
      unit: 'UN',
      stock_quantity: 10,
      min_stock_quantity: 2,
      cost_price: 1.2,
      sale_price: 4.5,
    })
  })

  it('envia marca e código de barras quando preenchidos (máx. 14 caracteres)', () => {
    const payload = buildCreateProductPayload({
      ...validForm,
      brand: ' Bic ',
      barcode: '7891234567890123',
    })
    expect(payload.brand).toBe('Bic')
    expect(payload.barcode).toBe('78912345678901')
    expect(payload.barcode).toHaveLength(14)
  })

  it('aceita formulário válido e custo/estoque vazios como zero', () => {
    expect(validateNewProduct(validForm)).toBeNull()
    const payload = buildCreateProductPayload({ ...validForm, costPrice: '', currentStock: '' })
    expect(payload.cost_price).toBe(0)
    expect(payload.stock_quantity).toBe(0)
  })

  it.each<[Partial<NewProductForm>, string]>([
    [{ name: ' ' }, 'Informe o nome do produto.'],
    [{ sku: '' }, 'Informe o SKU.'],
    [{ category: '' }, 'Selecione a categoria.'],
    [{ salePrice: '0' }, 'O preço de venda deve ser maior que zero.'],
    [{ salePrice: '' }, 'O preço de venda deve ser maior que zero.'],
    [{ costPrice: '-1' }, 'O custo não pode ser negativo.'],
    [{ currentStock: '-3' }, 'A quantidade em estoque deve ser um número inteiro maior ou igual a zero.'],
    [{ currentStock: '1.5' }, 'A quantidade em estoque deve ser um número inteiro maior ou igual a zero.'],
    [{ minStock: '-1' }, 'O estoque mínimo deve ser um número inteiro maior ou igual a zero.'],
    [{ barcode: '123456789012345' }, 'O código de barras aceita no máximo 14 caracteres.'],
  ])('recusa %o', (override, message) => {
    expect(validateNewProduct({ ...validForm, ...override })).toBe(message)
  })
})
