import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext, type UserProfile } from '@/features/auth/context/authContextDef'
import { Sidebar } from './Sidebar'

function createUser(
  principalType: UserProfile['principalType'],
  roleKey?: UserProfile['roleKey']
): UserProfile {
  return {
    id: '1',
    name: 'Joana Lima',
    email: 'joana@example.com',
    role: roleKey ?? (principalType === 'root' ? 'Administração central' : 'Empresa'),
    avatar: '',
    status: 'Ativo',
    principalType,
    roleKey,
  }
}

function renderSidebar(
  user: UserProfile,
  currentView: string,
  onNavigate = vi.fn()
) {
  render(
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true,
        login: async () => null,
        registerCompany: async () => false,
        logout: () => undefined,
        loginError: null,
      }}
    >
      <Sidebar currentView={currentView} onNavigate={onNavigate} />
    </AuthContext.Provider>
  )
  return onNavigate
}

describe('Sidebar settings navigation', () => {
  it('groups dashboard, DRE, users and company workspace under expandable settings', () => {
    const onNavigate = renderSidebar(createUser('company'), 'dashboard')

    expect(screen.getByRole('button', { name: 'Configurações' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('button', { name: 'DRE' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Usuários' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Espaço da empresa' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Configurações' }))
    expect(screen.queryByRole('button', { name: 'DRE' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Configurações' }))
    fireEvent.click(screen.getByRole('button', { name: 'DRE' }))
    expect(onNavigate).toHaveBeenCalledWith('dre')
  })

  it('keeps settings hidden from operators and root administrators', () => {
    const { unmount } = render(
      <AuthContext.Provider
        value={{
          user: createUser('collaborator', 'operator'),
          isAuthenticated: true,
          login: async () => null,
          registerCompany: async () => false,
          logout: () => undefined,
          loginError: null,
        }}
      >
        <Sidebar currentView="pdv" />
      </AuthContext.Provider>
    )
    expect(screen.getByRole('button', { name: 'Frente de caixa' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Configurações' })).not.toBeInTheDocument()
    unmount()

    render(
      <AuthContext.Provider
        value={{
          user: createUser('root'),
          isAuthenticated: true,
          login: async () => null,
          registerCompany: async () => false,
          logout: () => undefined,
          loginError: null,
        }}
      >
        <Sidebar currentView="admin" />
      </AuthContext.Provider>
    )
    expect(screen.getByRole('button', { name: 'Administração' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Configurações' })).not.toBeInTheDocument()
  })
})
