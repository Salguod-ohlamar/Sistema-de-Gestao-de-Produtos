import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createCollaborator,
  getCompanyBilling,
  getCompanyOverview,
  listCompanyCollaborators,
  setAccessToken,
  setCollaboratorActive,
  updateCollaborator,
  type NewCollaboratorInput,
} from './index'

const collaboratorInput: NewCollaboratorInput = {
  name: 'Ana Silva',
  email: 'ana@example.com',
  cpf: '12345678901',
  phone: null,
  hire_date: '2026-11-15',
  role: 'manager',
  is_admin: false,
  password: 'secure-pass-123',
}

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

describe('company workspace API', () => {
  it('uses the company overview, billing and collaborator routes', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response({}))
    vi.stubGlobal('fetch', fetchMock)
    setAccessToken('company-token')

    await getCompanyOverview()
    await getCompanyBilling()
    await listCompanyCollaborators()

    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([
      expect.stringMatching(/\/empresa\/dashboard$/),
      expect.stringMatching(/\/empresa\/financeiro$/),
      expect.stringMatching(/\/empresa\/colaboradores$/),
    ])
    expect(fetchMock.mock.calls[0][1]?.headers).toEqual(
      expect.objectContaining({ Authorization: 'Bearer company-token' })
    )
  })

  it('creates, updates and activates collaborators using the backend contract', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response({ id: 8 }))
    vi.stubGlobal('fetch', fetchMock)

    await createCollaborator(collaboratorInput)
    await updateCollaborator(8, {
      name: 'Ana Silva',
      role: 'administrator',
      phone: '11912345678',
    })
    await setCollaboratorActive(8, false)

    expect(fetchMock.mock.calls.map((call) => call[1]?.method)).toEqual([
      'POST',
      'PUT',
      'PATCH',
    ])
    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([
      expect.stringMatching(/\/colaboradores$/),
      expect.stringMatching(/\/colaboradores\/8$/),
      expect.stringMatching(/\/empresa\/colaboradores\/8\/ativo$/),
    ])
    expect(fetchMock.mock.calls[0][1]?.body).toBe(JSON.stringify(collaboratorInput))
    expect(fetchMock.mock.calls[2][1]?.body).toBe(JSON.stringify({ is_active: false }))
  })
})
