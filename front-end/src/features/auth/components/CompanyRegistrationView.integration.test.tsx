import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/features/auth/context'
import { setAccessToken } from '@/lib/api'
import { CompanyRegistrationView } from './CompanyRegistrationView'

afterEach(() => {
  vi.unstubAllGlobals()
  setAccessToken(null)
})

describe('company registration flow', () => {
  it('submits the company registration for approval without starting a session', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          pendingApproval: true,
        }),
        { status: 202, headers: { 'Content-Type': 'application/json' } }
      )
    )
    vi.stubGlobal('fetch', fetchMock)
    const queryClient = new QueryClient()
    const onRegistered = vi.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CompanyRegistrationView onBack={vi.fn()} onRegistered={onRegistered} />
        </AuthProvider>
      </QueryClientProvider>
    )

    fireEvent.change(screen.getByLabelText('Nome fantasia'), {
      target: { value: 'Mercado Azul' },
    })
    fireEvent.change(screen.getByLabelText('Razão social'), {
      target: { value: 'Mercado Azul LTDA' },
    })
    fireEvent.change(screen.getByLabelText('E-mail corporativo'), {
      target: { value: 'contato@azul.example' },
    })
    fireEvent.change(screen.getByLabelText('CNPJ'), {
      target: { value: '12345678000199' },
    })
    fireEvent.change(screen.getByLabelText('Telefone'), {
      target: { value: '11912345678' },
    })
    fireEvent.change(screen.getByLabelText('Segmento'), {
      target: { value: 'retail' },
    })
    fireEvent.change(screen.getByLabelText('Senha', { selector: 'input' }), {
      target: { value: 'senha-segura-123' },
    })
    fireEvent.change(screen.getByLabelText('Confirmar senha'), {
      target: { value: 'senha-segura-123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar cadastro para aprovação' }))

    await waitFor(() => expect(onRegistered).toHaveBeenCalledOnce())
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/empresas$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          trade_name: 'Mercado Azul',
          legal_name: 'Mercado Azul LTDA',
          email: 'contato@azul.example',
          cnpj: '12345678000199',
          phone: '11912345678',
          segment: 'retail',
          password: 'senha-segura-123',
        }),
      })
    )
  })
})
