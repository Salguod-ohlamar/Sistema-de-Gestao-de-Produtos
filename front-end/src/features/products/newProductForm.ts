import type { CreateProductInput } from '@/lib/api'

/** O backend recusa código de barras com mais de 14 caracteres. */
export const BARCODE_MAX_LENGTH = 14

/** Valores do formulário "Novo produto". Campos numéricos ficam como texto do input. */
export interface NewProductForm {
  name: string
  sku: string
  category: string
  brand: string
  barcode: string
  unit: string
  salePrice: string
  costPrice: string
  currentStock: string
  minStock: string
}

export const EMPTY_PRODUCT_FORM: NewProductForm = {
  name: '',
  sku: '',
  category: '',
  brand: '',
  barcode: '',
  unit: 'UN',
  salePrice: '',
  costPrice: '',
  currentStock: '',
  minStock: '',
}

/** Converte o texto do input em número; vazio vira 0. Aceita vírgula decimal. */
export function parseNumber(value: string): number {
  const trimmed = value.trim().replace(',', '.')
  if (trimmed === '') return 0
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : Number.NaN
}

/** Devolve a primeira mensagem de erro do formulário, ou null se estiver válido. */
export function validateNewProduct(form: NewProductForm): string | null {
  if (!form.name.trim()) return 'Informe o nome do produto.'
  if (!form.sku.trim()) return 'Informe o SKU.'
  if (!form.category.trim()) return 'Selecione a categoria.'
  if (form.barcode.trim().length > BARCODE_MAX_LENGTH) {
    return `O código de barras aceita no máximo ${BARCODE_MAX_LENGTH} caracteres.`
  }

  const salePrice = parseNumber(form.salePrice)
  if (!(salePrice > 0)) return 'O preço de venda deve ser maior que zero.'

  const costPrice = parseNumber(form.costPrice)
  if (!(costPrice >= 0)) return 'O custo não pode ser negativo.'

  const stock = parseNumber(form.currentStock)
  if (!Number.isInteger(stock) || stock < 0) {
    return 'A quantidade em estoque deve ser um número inteiro maior ou igual a zero.'
  }

  const minStock = parseNumber(form.minStock)
  if (!Number.isInteger(minStock) || minStock < 0) {
    return 'O estoque mínimo deve ser um número inteiro maior ou igual a zero.'
  }

  return null
}

/** Monta o corpo de POST /produtos a partir do formulário (assume formulário válido). */
export function buildCreateProductPayload(form: NewProductForm): CreateProductInput {
  const brand = form.brand.trim()
  const barcode = form.barcode.trim().slice(0, BARCODE_MAX_LENGTH)
  return {
    name: form.name.trim(),
    sku: form.sku.trim(),
    category: form.category.trim(),
    brand: brand || null,
    barcode: barcode || null,
    unit: form.unit || 'UN',
    stock_quantity: parseNumber(form.currentStock),
    min_stock_quantity: parseNumber(form.minStock),
    cost_price: parseNumber(form.costPrice),
    sale_price: parseNumber(form.salePrice),
  }
}
