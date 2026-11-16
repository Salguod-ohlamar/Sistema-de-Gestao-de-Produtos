import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  listContactRequests,
  setAccessToken,
  setContactRequestHandled,
  submitContact,
} from './index'

function response(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  setAccessToken(null)
})

describe('contact API', () => {
  it('submits public contact details and uses protected admin routes', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)
    setAccessToken('root-token')

    await submitContact({
      name: 'Pessoa Teste',
      phone: '11912345678',
      email: 'pessoa@example.com',
      company_name: 'Empresa Teste',
      website: '',
    })
    await listContactRequests()
    await setContactRequestHandled(4, true)

    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([
      expect.stringMatching(/\/contatos$/),
      expect.stringMatching(/\/admin\/contatos$/),
      expect.stringMatching(/\/admin\/contatos\/4$/),
    ])
    expect(fetchMock.mock.calls.map((call) => call[1]?.method)).toEqual([
      'POST',
      'GET',
      'PATCH',
    ])
    expect(fetchMock.mock.calls[0][1]?.body).toBe(
      JSON.stringify({
        name: 'Pessoa Teste',
        phone: '11912345678',
        email: 'pessoa@example.com',
        company_name: 'Empresa Teste',
        website: '',
      })
    )
    expect(fetchMock.mock.calls[2][1]?.body).toBe(JSON.stringify({ handled: true }))
  })
})
