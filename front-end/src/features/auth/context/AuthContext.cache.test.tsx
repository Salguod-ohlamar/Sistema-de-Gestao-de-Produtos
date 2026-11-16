import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { AuthProvider, useAuth } from './index'

function LogoutButton() {
  const { logout } = useAuth()
  return <button onClick={logout}>Sair</button>
}

describe('AuthProvider query cache lifecycle', () => {
  it('clears cached company data on logout', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(['products', 'company-a'], [{ id: 1 }])

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LogoutButton />
        </AuthProvider>
      </QueryClientProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))

    expect(queryClient.getQueryData(['products', 'company-a'])).toBeUndefined()
  })
})
