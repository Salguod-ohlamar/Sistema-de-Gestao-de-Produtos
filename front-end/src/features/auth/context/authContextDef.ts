import { createContext } from 'react'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  status: 'Ativo' | 'Inativo'
  /** Tipo de conta no backend (empresa, colaborador ou administração central) */
  principalType?: 'root' | 'company' | 'collaborator'
  /** Papel do colaborador no backend */
  roleKey?: 'administrator' | 'manager' | 'operator'
}

export interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  /** Última mensagem de erro de login devolvida pelo servidor, em português */
  loginError: string | null
}

export const DEFAULT_USER: UserProfile = {
  id: 'usr-01',
  name: 'Rodrigo Silveira',
  email: 'rodrigo.s@nexora.io',
  role: 'Gerente de Operações',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  status: 'Ativo',
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
