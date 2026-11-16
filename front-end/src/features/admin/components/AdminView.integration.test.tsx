import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthContext } from '@/features/auth/context/authContextDef'
import { setAccessToken } from '@/lib/api'
import { AdminView } from './AdminView'

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function createFetchMock(contactSource: 'contact' | 'company_registration' = 'contact') {
  let company = {
    id: 9,
    trade_name: 'Mercado Azul',
    legal_name: 'Mercado Azul LTDA',
    email: 'empresa@example.com',
    cnpj: '12345678000199',
    phone: '11912345678',
    segment: 'retail',
    is_active: true,
    created_at: '2026-01-15T12:00:00.000Z',
    approved_at: '2026-01-15T12:00:00.000Z',
    plan_code: null,
    plan_started_at: null,
    plan_term_months: null,
    plan_end_date: null,
    collaborator_count: 1,
    active_collaborator_count: 1,
    collaborators: [
      {
        id: 31,
        name: 'Joana Lima',
        email: 'joana@example.com',
        role: 'manager',
        is_admin: false,
        is_active: true,
      },
    ],
  }
  let contact = {
    id: 4,
    name: contactSource === 'contact' ? 'Paulo Souza' : 'Mercado Azul',
    phone: '11987654321',
    email: 'paulo@example.com',
    company_name: 'Loja Central',
    source: contactSource,
    company_id: contactSource === 'company_registration' ? 9 : null,
    created_at: '2026-11-15T12:00:00.000Z',
    handled: false,
  }
  return vi.fn<typeof fetch>(async (input, init) => {
    const url = String(input)
    const method = init?.method ?? 'GET'

    if (url.endsWith('/admin/companies') && method === 'GET') return json([company])
    if (url.endsWith('/admin/contatos') && method === 'GET') return json([contact])
    if (url.endsWith('/admin/companies/9/active') && method === 'PATCH') {
      const body = JSON.parse(String(init?.body)) as { is_active: boolean }
      company = { ...company, is_active: body.is_active }
      if (body.is_active && contact.source === 'company_registration') {
        company.approved_at = '2026-11-15T12:00:00.000Z'
        contact = { ...contact, handled: true }
      }
      return json({ id: company.id, trade_name: company.trade_name, is_active: company.is_active })
    }
    if (url.endsWith('/admin/contatos/4') && method === 'PATCH') {
      const body = JSON.parse(String(init?.body)) as { handled: boolean }
      contact = { ...contact, handled: body.handled }
      return json({ id: contact.id, handled: contact.handled })
    }
    return json({ error: `Unexpected test request: ${method} ${url}` }, 404)
  })
}

function renderAdmin(fetchMock: ReturnType<typeof createFetchMock>) {
  vi.stubGlobal('fetch', fetchMock)
  setAccessToken('root-test-token')
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          user: {
            id: '1',
            name: 'Admin',
            email: 'admin@example.com',
            role: 'Administração central',
            avatar: '',
            status: 'Ativo',
            principalType: 'root',
          },
          isAuthenticated: true,
          login: async () => null,
          registerCompany: async () => false,
          logout: () => undefined,
          loginError: null,
        }}
      >
        <AdminView />
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  setAccessToken(null)
})

describe('central administration flow', () => {
  it('loads companies and contacts and updates statuses through protected routes', async () => {
    const fetchMock = createFetchMock()
    renderAdmin(fetchMock)

    expect(await screen.findByText('Mercado Azul')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Desativar empresa' }))
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/admin\/companies\/9\/active$/),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ is_active: false }),
        })
      )
    })

    fireEvent.click(screen.getByRole('button', { name: /Contatos/ }))
    expect(await screen.findByText('Paulo Souza')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Marcar como atendido' }))
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/admin\/contatos\/4$/),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ handled: true }),
        })
      )
    })
    expect(await screen.findByText('Atendido')).toBeInTheDocument()
  })

  it('approves a company registration from the pending contacts tab', async () => {
    const fetchMock = createFetchMock('company_registration')
    renderAdmin(fetchMock)
    fireEvent.click(await screen.findByRole('button', { name: /Contatos/ }))

    expect(await screen.findByText('Cadastro de empresa')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Aprovar empresa' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/admin\/companies\/9\/active$/),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ is_active: true }),
        })
      )
    })
    expect(await screen.findByText('Atendido')).toBeInTheDocument()
  })
})
