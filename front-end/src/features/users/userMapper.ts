import type { ApiCollaborator, CollaboratorRole } from '@/lib/api'

export type UserRole = 'Administrador' | 'Gerente' | 'Operador'
export type UserStatus = 'Ativo' | 'Inativo'

export interface UserItem {
  id: string
  name: string
  email: string
  initials: string
  initialsColor: string
  initialsBg: string
  role: UserRole
  hiredOn: string
  status: UserStatus
}

const ROLE_LABEL: Record<CollaboratorRole, UserRole> = {
  administrator: 'Administrador',
  manager: 'Gerente',
  operator: 'Operador',
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  const d = new Date(value.length === 10 ? `${value}T12:00:00` : value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR')
}

export function mapCollaborator(c: ApiCollaborator): UserItem {
  const role = ROLE_LABEL[c.role] ?? 'Operador'
  const style =
    role === 'Administrador'
      ? { color: 'text-primary', bg: 'bg-primary/20' }
      : role === 'Gerente'
        ? { color: 'text-cyan-accent', bg: 'bg-cyan-accent/20' }
        : { color: 'text-text-secondary', bg: 'bg-surface-elevated' }
  return {
    id: String(c.id),
    name: c.name,
    email: c.email,
    initials: initialsOf(c.name),
    initialsColor: style.color,
    initialsBg: style.bg,
    role,
    hiredOn: formatDate(c.hire_date),
    status: c.is_active ? 'Ativo' : 'Inativo',
  }
}
