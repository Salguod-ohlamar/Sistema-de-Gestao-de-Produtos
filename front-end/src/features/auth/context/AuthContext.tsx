import { useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AuthContext, type UserProfile } from './authContextDef'
import { profileFromLogin } from './profileFromLogin'
import {
  ApiError,
  loginRequest,
  registerCompanyRequest,
  setAccessToken,
  type CompanyRegistrationInput,
} from '@/lib/api'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Nota de Segurança: o token fica apenas em memória (ver src/lib/api/client.ts).
  // Proibido gravar em localStorage conforme as regras do projeto Nexora.
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const login = async (email: string, password: string): Promise<UserProfile | null> => {
    setLoginError(null)
    try {
      const data = await loginRequest(email.trim(), password)
      queryClient.clear()
      setAccessToken(data.accessToken)
      const profile = profileFromLogin(data)
      setUser(profile)
      setLoginError(null)
      return profile
    } catch (error) {
      setLoginError(
        error instanceof ApiError ? error.message : 'Não foi possível iniciar a sessão.'
      )
      return null
    }
  }

  const registerCompany = async (input: CompanyRegistrationInput): Promise<boolean> => {
    setLoginError(null)
    try {
      await registerCompanyRequest(input)
      return true
    } catch (error) {
      setLoginError(
        error instanceof ApiError ? error.message : 'Não foi possível cadastrar a empresa.'
      )
      return false
    }
  }

  const logout = () => {
    queryClient.clear()
    setAccessToken(null)
    setUser(null)
    setLoginError(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, registerCompany, logout, loginError }}
    >
      {children}
    </AuthContext.Provider>
  )
}
