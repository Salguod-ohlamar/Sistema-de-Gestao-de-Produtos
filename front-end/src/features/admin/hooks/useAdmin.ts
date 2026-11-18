import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  assignCompanyPlan,
  listAdminCompanies,
  listContactRequests,
  setAdminCollaboratorActive,
  setAdminCompanyActive,
  setContactRequestHandled,
} from '@/lib/api'

export const adminCompaniesQueryKey = ['admin', 'companies'] as const
export const adminContactsQueryKey = ['admin', 'contacts'] as const

// Hook React que gerencia o estado e as operações relacionadas a admin companies.
export function useAdminCompanies(enabled: boolean) {
  return useQuery({
    queryKey: adminCompaniesQueryKey,
    queryFn: listAdminCompanies,
    enabled,
  })
}

// Hook React que gerencia o estado e as operações relacionadas a admin contacts.
export function useAdminContacts(enabled: boolean) {
  return useQuery({
    queryKey: adminContactsQueryKey,
    queryFn: listContactRequests,
    enabled,
  })
}

// Hook React que gerencia o estado e as operações relacionadas a set admin company active.
export function useSetAdminCompanyActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      setAdminCompanyActive(id, isActive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminCompaniesQueryKey })
      void queryClient.invalidateQueries({ queryKey: adminContactsQueryKey })
    },
  })
}

// Hook React que gerencia o estado e as operações relacionadas a set admin collaborator active.
export function useSetAdminCollaboratorActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      setAdminCollaboratorActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminCompaniesQueryKey }),
  })
}

// Hook React que gerencia o estado e as operações relacionadas a assign company plan.
export function useAssignCompanyPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, termMonths }: { id: number; termMonths: number }) =>
      assignCompanyPlan(id, termMonths),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminCompaniesQueryKey }),
  })
}

// Hook React que gerencia o estado e as operações relacionadas a set contact handled.
export function useSetContactHandled() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, handled }: { id: number; handled: boolean }) =>
      setContactRequestHandled(id, handled),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminContactsQueryKey }),
  })
}
