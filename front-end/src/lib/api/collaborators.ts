import { apiFetch } from './client'

export type CollaboratorRole = 'administrator' | 'manager' | 'operator'

export interface ApiCollaborator {
  id: number
  name: string
  email: string
  cpf: string | null
  phone: string | null
  hire_date: string | null
  termination_date: string | null
  role: CollaboratorRole
  is_active: boolean
  is_admin?: boolean
  created_at: string
}

export function listCollaborators(): Promise<ApiCollaborator[]> {
  return apiFetch<ApiCollaborator[]>('/empresa/colaboradores')
}
