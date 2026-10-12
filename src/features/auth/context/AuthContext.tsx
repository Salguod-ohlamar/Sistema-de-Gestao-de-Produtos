import { useState, type ReactNode } from 'react'
import {
  AuthContext,
  DEFAULT_USER,
  type UserProfile,
} from './authContextDef'

interface AuthProviderProps {
  children: ReactNode
  initialAuthenticated?: boolean
}

export function AuthProvider({
  children,
  initialAuthenticated = true,
}: AuthProviderProps) {
  // Nota de Segurança: Token é mantido estritamente em memória de execução
  // Proibido gravar em localStorage conforme as regras do projeto Nexora
  const [user, setUser] = useState<UserProfile | null>(
    initialAuthenticated ? DEFAULT_USER : null
  )

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação com validação corporativa
    if (password === 'senha-errada' || password === 'SenhaIncorreta123') {
      return false
    }

    setUser({
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
    })
    return true
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
