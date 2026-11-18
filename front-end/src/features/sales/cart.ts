/**
 * Lógica pura do carrinho do PDV. Valores monetários em centavos (inteiros)
 * para evitar erro de ponto flutuante. O total oficial da venda é sempre o
 * calculado pelo servidor; aqui ele serve só de pré-visualização.
 */

export interface CartLine {
  productId: number
  name: string
  sku: string
  unitPriceCents: number
  quantity: number
  /** Estoque disponível no momento em que o produto foi adicionado */
  maxQuantity: number
}

export interface CartProduct {
  id: number
  name: string
  sku: string
  sale_price: string
  stock_quantity: number
}

// Formata ou converte to cents para o formato exigido pela interface.
export function toCents(value: string | number): number {
  return Math.round(Number(value) * 100)
}

// Cria ou registra add to cart e trata o resultado da operação.
export function addToCart(lines: CartLine[], product: CartProduct): CartLine[] {
  if (product.stock_quantity <= 0) return lines

  const existing = lines.find((line) => line.productId === product.id)
  if (!existing) {
    return [
      ...lines,
      {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        unitPriceCents: toCents(product.sale_price),
        quantity: 1,
        maxQuantity: product.stock_quantity,
      },
    ]
  }

  return lines.map((line) =>
    line.productId === product.id
      ? { ...line, quantity: Math.min(line.quantity + 1, line.maxQuantity) }
      : line
  )
}

// Atualiza ou altera change quantity, aplicando os dados recebidos.
export function changeQuantity(lines: CartLine[], productId: number, delta: number): CartLine[] {
  return lines
    .map((line) =>
      line.productId === productId
        ? { ...line, quantity: Math.min(line.quantity + delta, line.maxQuantity) }
        : line
    )
    .filter((line) => line.quantity > 0)
}

// Remove ou cancela remove line e devolve o resultado da operação.
export function removeLine(lines: CartLine[], productId: number): CartLine[] {
  return lines.filter((line) => line.productId !== productId)
}

// Implementa a operação relacionada a cart total cents.
export function cartTotalCents(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0)
}

// Implementa a operação relacionada a cart item count.
export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}
