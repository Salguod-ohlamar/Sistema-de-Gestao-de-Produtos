import { describe, expect, it } from 'vitest'
import { productQueryKey, productsQueryKey } from './useProducts'

describe('product query keys', () => {
  it('isolates product list and detail cache entries by company', () => {
    expect(productsQueryKey('company-a')).not.toEqual(productsQueryKey('company-b'))
    expect(productQueryKey('company-a', 5)).not.toEqual(productQueryKey('company-b', 5))
  })
})
