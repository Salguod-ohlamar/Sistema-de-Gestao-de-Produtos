import { apiFetch } from './client'

export interface LoginResponse {
  company: { id: number | null; trade_name: string; email: string }
  principalType: 'root' | 'company' | 'collaborator'
  role?: 'administrator' | 'manager' | 'operator'
  isAdmin?: boolean
  accessToken: string
}

export function loginRequest(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } })
}
