import { useState, type ReactNode } from 'react'
import { AuthContext, type UserProfile } from './authContextDef'
import { profileFromLogin } from './profileFromLogin'
import { ApiError, loginRequest, setAccessToken } from '@/lib/api'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Nota de Segurança: o token fica apenas em memória (ver src/lib/api/client.ts).
  // Proibido gravar em localStorage conforme as regras do projeto Nexora.
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoginError(null)
    try {
      const data = await loginRequest(email.trim(), password)
      setAccessToken(data.accessToken)
      setUser(profileFromLogin(data))
      return true
    } catch (error) {
      setLoginError(
        error instanceof ApiError ? error.message : 'Não foi possível iniciar a sessão.'
      )
      return false
    }
  }

  const logout = () => {
    setAccessToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loginError }}
    >
      {children}
    </AuthContext.Provider>
  )
}
