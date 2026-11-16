import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createProduct,
  deleteProduct,
  findProductByCode,
  getProduct,
  listProducts,
  setAccessToken,
  updateProduct,
  type ProductInput,
} from './index'

const productInput: ProductInput = {
  name: 'Café',
  sku: 'CAF-001',
  category: 'Alimentos',
  barcode: '789123',
  brand: 'Marca',
  sale_price: 12.5,
  cost_price: 8,
  stock_quantity: 10,
  min_stock_quantity: 2,
  unit: 'UN',
}

function response(data: unknown, status = 200): Response {
  return new Response(status === 204 ? null : JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  setAccessToken(null)
})

describe('product API', () => {
  it('lists products with the session token', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response([]))
    vi.stubGlobal('fetch', fetchMock)
    setAccessToken('session-token')

    await listProducts()

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/produtos$/),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer session-token' }),
      })
    )
  })

  it('uses the product detail and code lookup routes', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response({ id: 7 }))
    vi.stubGlobal('fetch', fetchMock)

    await getProduct(7)
    await findProductByCode('ABC/123')

    expect(fetchMock.mock.calls[0][0]).toEqual(expect.stringMatching(/\/produtos\/7$/))
    expect(fetchMock.mock.calls[1][0]).toEqual(
      expect.stringMatching(/\/produtos\/codigo\/ABC%2F123$/)
    )
  })

  it('sends create, update and delete requests using the backend contract', async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(response({ id: 7 }))
      .mockResolvedValueOnce(response({ id: 7 }))
      .mockResolvedValueOnce(response(null, 204))
    vi.stubGlobal('fetch', fetchMock)

    await createProduct(productInput)
    await updateProduct(7, productInput)
    await deleteProduct(7)

    expect(fetchMock.mock.calls.map((call) => call[1]?.method)).toEqual(['POST', 'PUT', 'DELETE'])
    expect(fetchMock.mock.calls[0][1]?.body).toBe(JSON.stringify(productInput))
    expect(fetchMock.mock.calls[1][0]).toEqual(expect.stringMatching(/\/produtos\/7$/))
  })
})
