import { apiFetch } from './client'

export type CollaboratorRole = 'administrator' | 'manager' | 'operator'

export interface CompanyOverview {
  id: number
  trade_name: string
  plan_code: string | null
  plan_started_at: string | null
  plan_term_months: number | null
  plan_end_date: string | null
  product_count: number
  stock_units: number | string
  stock_cost_value: number | string
  stock_sale_value: number | string
  critical_product_count: number
  minimum_coverage_percent: number
  low_stock_products: {
    id: number
    name: string
    sku: string
    stock_quantity: number
    min_stock_quantity: number
    sale_price: number | string
  }[]
  stock_health_percent: number
  active_collaborator_count: number
  collaborator_count: number
}

export interface CompanyBilling {
  id: number
  trade_name: string
  plan_code: string | null
  plan_started_at: string | null
  plan_term_months: number | null
  plan_end_date: string | null
  next_due_date: string | null
  active_collaborator_count: number
}

export interface CompanyCollaborator {
  id: number
  name: string
  email: string
  cpf: string
  is_admin: boolean
  phone: string | null
  hire_date: string
  termination_date: string | null
  role: CollaboratorRole
  company_id?: number
  is_active: boolean
  created_at: string
}

export interface NewCollaboratorInput {
  name: string
  email: string
  cpf: string
  phone: string | null
  hire_date: string
  role: CollaboratorRole
  is_admin: boolean
  password: string
}

export interface UpdateCollaboratorInput {
  name: string
  role: CollaboratorRole
  phone: string | null
}

// Busca ou obtém get company overview e entrega o resultado ao chamador.
export function getCompanyOverview(): Promise<CompanyOverview> {
  return apiFetch<CompanyOverview>('/empresa/dashboard')
}

// Busca ou obtém get company billing e entrega o resultado ao chamador.
export function getCompanyBilling(): Promise<CompanyBilling> {
  return apiFetch<CompanyBilling>('/empresa/financeiro')
}

// Busca ou obtém list company collaborators e entrega o resultado ao chamador.
export function listCompanyCollaborators(): Promise<CompanyCollaborator[]> {
  return apiFetch<CompanyCollaborator[]>('/empresa/colaboradores')
}

// Cria ou registra create collaborator e trata o resultado da operação.
export function createCollaborator(input: NewCollaboratorInput): Promise<CompanyCollaborator> {
  return apiFetch<CompanyCollaborator>('/colaboradores', { method: 'POST', body: { ...input } })
}

// Atualiza ou altera update collaborator, aplicando os dados recebidos.
export function updateCollaborator(
  id: number,
  input: UpdateCollaboratorInput
): Promise<CompanyCollaborator> {
  return apiFetch<CompanyCollaborator>(`/colaboradores/${id}`, {
    method: 'PUT',
    body: { ...input },
  })
}

// Atualiza ou altera set collaborator active, aplicando os dados recebidos.
export function setCollaboratorActive(
  id: number,
  isActive: boolean
): Promise<Pick<CompanyCollaborator, 'id' | 'name' | 'is_active'>> {
  return apiFetch<Pick<CompanyCollaborator, 'id' | 'name' | 'is_active'>>(
    `/empresa/colaboradores/${id}/ativo`,
    { method: 'PATCH', body: { is_active: isActive } }
  )
}
