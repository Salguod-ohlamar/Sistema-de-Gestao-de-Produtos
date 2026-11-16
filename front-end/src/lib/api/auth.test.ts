import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  registerCompanyRequest,
  requestPasswordReset,
  resetPassword,
  setAccessToken,
} from './index'

afterEach(() => {
  vi.unstubAllGlobals()
  setAccessToken(null)
})

describe('company registration API', () => {
  it('sends registration fields to the public company endpoint', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({ ok: true, pendingApproval: true }),
        { status: 202, headers: { 'Content-Type': 'application/json' } }
      )
    )
    vi.stubGlobal('fetch', fetchMock)
    const input = {
      trade_name: 'Empresa Teste',
      legal_name: 'Empresa Teste LTDA',
      email: 'empresa@example.com',
      cnpj: '12345678000199',
      phone: '11912345678',
      segment: 'retail' as const,
      password: 'senha-segura-123',
    }

    await registerCompanyRequest(input)

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/empresas$/),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(input) })
    )
  })

  it('requests a password reset and submits a new password with the reset token', async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true, message: 'Instruções enviadas.' }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    vi.stubGlobal('fetch', fetchMock)

    await requestPasswordReset('empresa@example.com')
    await resetPassword('reset-token', 'nova-senha-123')

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/\/auth\/forgot-password$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'empresa@example.com' }),
      })
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/\/auth\/reset-password$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ token: 'reset-token', password: 'nova-senha-123' }),
      })
    )
  })
})
