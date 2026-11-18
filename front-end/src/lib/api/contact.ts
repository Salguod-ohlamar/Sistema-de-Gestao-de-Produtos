import { apiFetch } from './client'

export interface ContactInput {
  name: string
  phone: string
  email: string
  company_name: string
  website: string
}

export interface ContactRequest {
  id: number
  name: string | null
  phone: string | null
  email: string
  company_name: string | null
  source: 'contact' | 'company_registration' | 'password_reset'
  company_id: number | null
  created_at: string
  handled: boolean
}

export interface ContactSubmissionResponse {
  ok: true
}

// Implementa a operação relacionada a submit contact.
export function submitContact(input: ContactInput): Promise<ContactSubmissionResponse> {
  return apiFetch<ContactSubmissionResponse>('/contatos', {
    method: 'POST',
    body: { ...input },
  })
}

// Busca ou obtém list contact requests e entrega o resultado ao chamador.
export function listContactRequests(): Promise<ContactRequest[]> {
  return apiFetch<ContactRequest[]>('/admin/contatos')
}

// Atualiza ou altera set contact request handled, aplicando os dados recebidos.
export function setContactRequestHandled(
  id: number,
  handled: boolean
): Promise<Pick<ContactRequest, 'id' | 'handled'>> {
  return apiFetch<Pick<ContactRequest, 'id' | 'handled'>>(`/admin/contatos/${id}`, {
    method: 'PATCH',
    body: { handled },
  })
}
