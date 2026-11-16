import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setAccessToken } from '@/lib/api'
import { ContactView } from './ContactView'

afterEach(() => {
  vi.unstubAllGlobals()
  setAccessToken(null)
})

describe('public contact flow', () => {
  it('submits contact details and displays the server success state', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    )
    vi.stubGlobal('fetch', fetchMock)
    render(<ContactView onBack={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Joana Lima' } })
    fireEvent.change(screen.getByLabelText('Empresa'), { target: { value: 'Loja Central' } })
    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'joana@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Telefone com DDD'), {
      target: { value: '11912345678' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }))

    expect(await screen.findByText('Mensagem enviada. Obrigado pelo contato.')).toBeInTheDocument()
    await waitFor(() => {
      expect(fetchMock.mock.calls).toHaveLength(1)
      const [url, options] = fetchMock.mock.calls[0]
      expect(String(url)).toMatch(/\/contatos$/)
      expect(options?.method).toBe('POST')
      expect(JSON.parse(String(options?.body))).toEqual({
        name: 'Joana Lima',
        phone: '11912345678',
        email: 'joana@example.com',
        company_name: 'Loja Central',
        website: '',
      })
    })
  })
})
