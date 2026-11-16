import type { ReactNode } from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthContext, type UserProfile } from '@/features/auth/context/authContextDef'
import { CompanyWorkspaceView } from '@/features/company/components/CompanyWorkspaceView'
import type { CompanyCollaborator } from '@/lib/api'
import { setAccessToken } from '@/lib/api'
import { UsersView } from './UsersView'

const companyUser: UserProfile = {
  id: '12',
  name: 'Empresa de teste',
  email: 'empresa@example.com',
  role: 'Conta da empresa',
  avatar: '',
  status: 'Ativo',
  principalType: 'company',
}

function collaborator(id: number, name: string, isActive = true): CompanyCollaborator {
  return {
    id,
    name,
    email: `${name.toLowerCase().replaceAll(' ', '.')}@example.com`,
    cpf: '12345678901',
    is_admin: false,
    phone: null,
    hire_date: '2026-01-15',
    termination_date: null,
    role: 'manager',
    company_id: 12,
    is_active: isActive,
    created_at: '2026-01-15T12:00:00.000Z',
  }
}

function createFetchMock() {
  let collaborators = [collaborator(7, 'Ana Nunes')]
  const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
    const url = String(input)
    const method = init?.method ?? 'GET'

    if (url.endsWith('/empresa/colaboradores') && method === 'GET') {
      return json(collaborators)
    }
    if (url.endsWith('/empresa/colaboradores/7/ativo') && method === 'PATCH') {
      const body = JSON.parse(String(init?.body)) as { is_active: boolean }
      collaborators = collaborators.map((item) =>
        item.id === 7 ? { ...item, is_active: body.is_active } : item
      )
      return json({ id: 7, name: collaborators[0].name, is_active: body.is_active })
    }
    if (url.endsWith('/colaboradores') && method === 'POST') {
      const body = JSON.parse(String(init?.body)) as {
        name: string
        email: string
        cpf: string
        phone: string | null
        hire_date: string
        role: CompanyCollaborator['role']
        is_admin: boolean
      }
      const created = {
        ...collaborator(8, body.name),
        email: body.email,
        cpf: body.cpf,
        phone: body.phone,
        hire_date: body.hire_date,
        role: body.role,
        is_admin: body.is_admin,
      }
      collaborators = [...collaborators, created]
      return json(created, 201)
    }
    if (url.endsWith('/empresa/dashboard')) {
      return json({
        id: 12,
        trade_name: 'Empresa de teste',
        plan_code: 'pro',
        plan_started_at: '2026-01-01',
        plan_term_months: 12,
        plan_end_date: '2027-01-01',
        product_count: 4,
        stock_units: '18',
        stock_cost_value: '450.00',
        stock_sale_value: '700.00',
        critical_product_count: 1,
        minimum_coverage_percent: 75,
        low_stock_products: [],
        stock_health_percent: 75,
        active_collaborator_count: collaborators.filter((item) => item.is_active).length,
        collaborator_count: collaborators.length,
      })
    }
    if (url.endsWith('/empresa/financeiro')) {
      return json({
        id: 12,
        trade_name: 'Empresa de teste',
        plan_code: 'pro',
        plan_started_at: '2026-01-01',
        plan_term_months: 12,
        plan_end_date: '2027-01-01',
        next_due_date: '2026-12-01',
        active_collaborator_count: collaborators.filter((item) => item.is_active).length,
      })
    }
    return json({ error: `Unexpected test request: ${method} ${url}` }, 404)
  })
  return fetchMock
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function renderWithSession(element: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          user: companyUser,
          isAuthenticated: true,
          login: async () => companyUser,
          registerCompany: async () => true,
          logout: () => undefined,
          loginError: null,
        }}
      >
        {element}
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  setAccessToken(null)
})

describe('company users and workspace integrations', () => {
  it('renders collaborators from the API and sends an active-status update', async () => {
    const fetchMock = createFetchMock()
    vi.stubGlobal('fetch', fetchMock)
    setAccessToken('company-test-token')
    renderWithSession(<UsersView />)

    expect(await screen.findByText('Ana Nunes')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/empresa\/colaboradores$/),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer company-test-token' }),
      })
    )

    fireEvent.click(screen.getByRole('button', { name: 'Desativar' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/empresa\/colaboradores\/7\/ativo$/),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ is_active: false }),
        })
      )
    })
    const collaboratorRow = screen.getByRole('row', { name: /Ana Nunes/ })
    expect(within(collaboratorRow).getByText('Inativo')).toBeInTheDocument()
  })

  it('sends collaborator creation data through the form and API', async () => {
    const fetchMock = createFetchMock()
    vi.stubGlobal('fetch', fetchMock)
    setAccessToken('company-test-token')
    renderWithSession(<UsersView />)

    await screen.findByText('Ana Nunes')
    fireEvent.click(screen.getByRole('button', { name: 'Novo colaborador' }))
    fireEvent.change(screen.getByLabelText('Nome completo'), {
      target: { value: 'Bruno Reis' },
    })
    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'bruno@example.com' },
    })
    fireEvent.change(screen.getByLabelText('CPF'), {
      target: { value: '98765432100' },
    })
    fireEvent.change(screen.getByLabelText('Data de contratação'), {
      target: { value: '2026-11-15' },
    })
    fireEvent.change(screen.getByLabelText('Perfil'), {
      target: { value: 'operator' },
    })
    fireEvent.change(screen.getByLabelText('Senha inicial'), {
      target: { value: 'senha-segura-123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar colaborador' }))

    await waitFor(() => {
      const createCall = fetchMock.mock.calls.find(
        ([url, init]) => String(url).endsWith('/colaboradores') && init?.method === 'POST'
      )
      expect(createCall).toBeDefined()
      expect(JSON.parse(String(createCall?.[1]?.body))).toEqual({
        name: 'Bruno Reis',
        email: 'bruno@example.com',
        cpf: '98765432100',
        phone: null,
        hire_date: '2026-11-15',
        role: 'operator',
        is_admin: false,
        password: 'senha-segura-123',
      })
    })
    expect(await screen.findByText('Bruno Reis')).toBeInTheDocument()
  })

  it('loads the company overview and billing responses into the workspace', async () => {
    const fetchMock = createFetchMock()
    vi.stubGlobal('fetch', fetchMock)
    setAccessToken('company-test-token')
    renderWithSession(<CompanyWorkspaceView />)

    expect(await screen.findByText('Próximo vencimento estimado')).toBeInTheDocument()
    expect(screen.getByText('1 de 1')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/empresa\/dashboard$/),
      expect.any(Object)
    )
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/empresa\/financeiro$/),
      expect.any(Object)
    )
  })
})
