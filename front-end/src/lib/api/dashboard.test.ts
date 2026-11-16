import { afterEach, describe, expect, it, vi } from 'vitest'
import { getDashboard, setAccessToken } from './index'

afterEach(() => {
  vi.unstubAllGlobals()
  setAccessToken(null)
})

describe('dashboard API', () => {
  it('requests the company sales dashboard for the selected date range', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ summary: { sales_count: 0 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )
    vi.stubGlobal('fetch', fetchMock)
    setAccessToken('company-token')

    await getDashboard({ from: '2026-11-01', to: '2026-11-15' })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/dashboard\?from=2026-11-01&to=2026-11-15$/),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer company-token' }),
      })
    )
  })
})
