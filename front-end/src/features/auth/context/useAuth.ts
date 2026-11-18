import { useContext } from 'react'
import { AuthContext } from './authContextDef'

// Hook React que gerencia o estado e as operações relacionadas a auth.
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider')
  }
  return context
}
