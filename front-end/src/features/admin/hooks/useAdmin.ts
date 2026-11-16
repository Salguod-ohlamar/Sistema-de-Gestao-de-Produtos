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

export function useAdminCompanies(enabled: boolean) {
  return useQuery({
    queryKey: adminCompaniesQueryKey,
    queryFn: listAdminCompanies,
    enabled,
  })
}

export function useAdminContacts(enabled: boolean) {
  return useQuery({
    queryKey: adminContactsQueryKey,
    queryFn: listContactRequests,
    enabled,
  })
}

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

export function useSetAdminCollaboratorActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      setAdminCollaboratorActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminCompaniesQueryKey }),
  })
}

export function useAssignCompanyPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, termMonths }: { id: number; termMonths: number }) =>
      assignCompanyPlan(id, termMonths),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminCompaniesQueryKey }),
  })
}

export function useSetContactHandled() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, handled }: { id: number; handled: boolean }) =>
      setContactRequestHandled(id, handled),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminContactsQueryKey }),
  })
}
