import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCollaborator,
  getCompanyBilling,
  getCompanyOverview,
  listCompanyCollaborators,
  setCollaboratorActive,
  updateCollaborator,
  type NewCollaboratorInput,
  type UpdateCollaboratorInput,
} from '@/lib/api'

// Implementa a operação relacionada a company overview query key.
export const companyOverviewQueryKey = (companyId: string | null) =>
  ['company-workspace', companyId, 'overview'] as const
// Implementa a operação relacionada a company billing query key.
export const companyBillingQueryKey = (companyId: string | null) =>
  ['company-workspace', companyId, 'billing'] as const
// Implementa a operação relacionada a company collaborators query key.
export const companyCollaboratorsQueryKey = (companyId: string | null) =>
  ['company-collaborators', companyId] as const

// Hook React que gerencia o estado e as operações relacionadas a company overview.
export function useCompanyOverview(companyId: string | null) {
  return useQuery({
    queryKey: companyOverviewQueryKey(companyId),
    queryFn: getCompanyOverview,
    enabled: companyId !== null,
  })
}

// Hook React que gerencia o estado e as operações relacionadas a company billing.
export function useCompanyBilling(companyId: string | null) {
  return useQuery({
    queryKey: companyBillingQueryKey(companyId),
    queryFn: getCompanyBilling,
    enabled: companyId !== null,
  })
}

// Hook React que gerencia o estado e as operações relacionadas a company collaborators.
export function useCompanyCollaborators(companyId: string | null) {
  return useQuery({
    queryKey: companyCollaboratorsQueryKey(companyId),
    queryFn: listCompanyCollaborators,
    enabled: companyId !== null,
  })
}

// Hook React que gerencia o estado e as operações relacionadas a company mutation invalidation.
function useCompanyMutationInvalidation(companyId: string | null) {
  const queryClient = useQueryClient()
  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: companyCollaboratorsQueryKey(companyId) }),
      queryClient.invalidateQueries({ queryKey: companyOverviewQueryKey(companyId) }),
      queryClient.invalidateQueries({ queryKey: companyBillingQueryKey(companyId) }),
    ])
  }
}

// Hook React que gerencia o estado e as operações relacionadas a create collaborator.
export function useCreateCollaborator(companyId: string | null) {
  const invalidateCompanyData = useCompanyMutationInvalidation(companyId)
  return useMutation({
    mutationFn: (input: NewCollaboratorInput) => createCollaborator(input),
    onSuccess: invalidateCompanyData,
  })
}

// Hook React que gerencia o estado e as operações relacionadas a update collaborator.
export function useUpdateCollaborator(companyId: string | null) {
  const invalidateCompanyData = useCompanyMutationInvalidation(companyId)
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCollaboratorInput }) =>
      updateCollaborator(id, input),
    onSuccess: invalidateCompanyData,
  })
}

// Hook React que gerencia o estado e as operações relacionadas a set collaborator active.
export function useSetCollaboratorActive(companyId: string | null) {
  const invalidateCompanyData = useCompanyMutationInvalidation(companyId)
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      setCollaboratorActive(id, isActive),
    onSuccess: invalidateCompanyData,
  })
}
