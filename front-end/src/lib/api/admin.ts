import { apiFetch } from './client'
import type { CollaboratorRole } from './company'

export interface AdminCollaborator {
  id: number
  name: string
  email: string
  role: CollaboratorRole
  is_admin: boolean
  is_active: boolean
}

export interface AdminCompany {
  id: number
  trade_name: string
  legal_name: string
  email: string
  cnpj: string
  phone: string
  segment: string
  is_active: boolean
  created_at: string
  approved_at: string | null
  plan_code: string | null
  plan_started_at: string | null
  plan_term_months: number | null
  plan_end_date: string | null
  collaborator_count: number
  active_collaborator_count: number
  collaborators: AdminCollaborator[]
}

// Busca ou obtém list admin companies e entrega o resultado ao chamador.
export function listAdminCompanies(): Promise<AdminCompany[]> {
  return apiFetch<AdminCompany[]>('/admin/companies')
}

// Atualiza ou altera set admin company active, aplicando os dados recebidos.
export function setAdminCompanyActive(
  id: number,
  isActive: boolean
): Promise<Pick<AdminCompany, 'id' | 'trade_name' | 'is_active'>> {
  return apiFetch<Pick<AdminCompany, 'id' | 'trade_name' | 'is_active'>>(
    `/admin/companies/${id}/active`,
    { method: 'PATCH', body: { is_active: isActive } }
  )
}

// Atualiza ou altera set admin collaborator active, aplicando os dados recebidos.
export function setAdminCollaboratorActive(
  id: number,
  isActive: boolean
): Promise<{ id: number; name: string; email: string; company_id: number; is_active: boolean }> {
  return apiFetch(
    `/admin/collaborators/${id}/active`,
    { method: 'PATCH', body: { is_active: isActive } }
  )
}

// Implementa a operação relacionada a assign company plan.
export function assignCompanyPlan(
  id: number,
  termMonths: number
): Promise<{
  id: number
  plan_code: string
  plan_started_at: string
  plan_term_months: number
  plan_end_date: string
}> {
  return apiFetch(`/admin/companies/${id}/plan`, {
    method: 'PATCH',
    body: { term_months: termMonths },
  })
}
