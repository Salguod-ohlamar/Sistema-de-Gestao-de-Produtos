import type { UserProfile } from './authContextDef'
import type { LoginResponse } from '@/lib/api'

const ROLE_LABELS: Record<NonNullable<LoginResponse['role']>, string> = {
  administrator: 'Administrador',
  manager: 'Gerente',
  operator: 'Operador de caixa',
}

// Implementa a operação relacionada a profile from login.
export function profileFromLogin(data: LoginResponse): UserProfile {
  const roleLabel =
    data.principalType === 'collaborator' && data.role
      ? ROLE_LABELS[data.role]
      : data.principalType === 'root'
        ? 'Administração central'
        : 'Conta da empresa'

  return {
    id: String(data.company.id ?? 'root'),
    name: data.company.trade_name,
    email: data.company.email,
    role: roleLabel,
    avatar: '',
    status: 'Ativo',
    principalType: data.principalType,
    roleKey: data.role,
    isAdmin: data.principalType === 'collaborator' && data.isAdmin === true,
  }
}
