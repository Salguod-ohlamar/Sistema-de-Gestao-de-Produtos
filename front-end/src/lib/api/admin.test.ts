import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  assignCompanyPlan,
  listAdminCompanies,
  setAccessToken,
  setAdminCollaboratorActive,
  setAdminCompanyActive,
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

describe('central administration API', () => {
  it('lists companies and sends plan and access updates to protected routes', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response([]))
    vi.stubGlobal('fetch', fetchMock)

    await listAdminCompanies()
    await assignCompanyPlan(12, 24)
    await setAdminCompanyActive(12, false)
    await setAdminCollaboratorActive(31, false)

    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([
      expect.stringMatching(/\/admin\/companies$/),
      expect.stringMatching(/\/admin\/companies\/12\/plan$/),
      expect.stringMatching(/\/admin\/companies\/12\/active$/),
      expect.stringMatching(/\/admin\/collaborators\/31\/active$/),
    ])
    expect(fetchMock.mock.calls.map((call) => call[1]?.method)).toEqual([
      'GET',
      'PATCH',
      'PATCH',
      'PATCH',
    ])
    expect(fetchMock.mock.calls[1][1]?.body).toBe(JSON.stringify({ term_months: 24 }))
    expect(fetchMock.mock.calls[2][1]?.body).toBe(JSON.stringify({ is_active: false }))
    expect(fetchMock.mock.calls[3][1]?.body).toBe(JSON.stringify({ is_active: false }))
  })
})
