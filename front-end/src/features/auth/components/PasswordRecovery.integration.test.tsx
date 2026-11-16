import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setAccessToken } from '@/lib/api'
import { ForgotPasswordView } from './ForgotPasswordView'
import { PasswordResetView } from './PasswordResetView'

afterEach(() => {
  vi.unstubAllGlobals()
  setAccessToken(null)
})

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('password recovery flow', () => {
  it('submits the email and displays a non-enumerating confirmation', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse({
        ok: true,
        message: 'Se o e-mail estiver cadastrado, você receberá um link.',
      }, 202)
    )
    vi.stubGlobal('fetch', fetchMock)
    render(<ForgotPasswordView onBack={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'empresa@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar link de recuperação' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Se o e-mail estiver cadastrado'
    )
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/forgot-password$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'empresa@example.com' }),
      })
    )
  })

  it('rejects mismatched passwords and consumes a valid reset link', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)
    const onCompleted = vi.fn()
    render(
      <PasswordResetView token="one-time-token" onBack={vi.fn()} onCompleted={onCompleted} />
    )

    fireEvent.change(screen.getByLabelText('Nova senha'), {
      target: { value: 'new-password-123' },
    })
    fireEvent.change(screen.getByLabelText('Confirmar nova senha'), {
      target: { value: 'different-password' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Redefinir senha' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('não coincidem')
    expect(fetchMock).not.toHaveBeenCalled()

    fireEvent.change(screen.getByLabelText('Confirmar nova senha'), {
      target: { value: 'new-password-123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Redefinir senha' }))

    await waitFor(() => expect(onCompleted).toHaveBeenCalledOnce())
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/reset-password$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ token: 'one-time-token', password: 'new-password-123' }),
      })
    )
  })
})
