import { apiFetch } from './client'

export interface CompanyRegistrationInput {
  trade_name: string
  legal_name: string
  email: string
  cnpj: string
  phone: string
  segment: 'technology' | 'retail' | 'services' | 'industry'
  password: string
}

export interface LoginResponse {
  company: { id: number | null; trade_name: string; email: string }
  principalType: 'root' | 'company' | 'collaborator'
  role?: 'administrator' | 'manager' | 'operator'
  isAdmin?: boolean
  accessToken: string
}

export interface CompanyRegistrationResponse {
  ok: true
  pendingApproval: true
}

// Executa autenticação, autorização ou verificação relacionada a login request.
export function loginRequest(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } })
}

// Cria ou registra register company request e trata o resultado da operação.
export function registerCompanyRequest(
  input: CompanyRegistrationInput
): Promise<CompanyRegistrationResponse> {
  return apiFetch<CompanyRegistrationResponse>('/empresas', { method: 'POST', body: { ...input } })
}

// Implementa a operação relacionada a request password reset.
export function requestPasswordReset(email: string): Promise<{ ok: true; message: string }> {
  return apiFetch('/auth/forgot-password', { method: 'POST', body: { email } })
}

// Implementa a operação relacionada a reset password.
export function resetPassword(token: string, password: string): Promise<{ ok: true }> {
  return apiFetch('/auth/reset-password', { method: 'POST', body: { token, password } })
}
