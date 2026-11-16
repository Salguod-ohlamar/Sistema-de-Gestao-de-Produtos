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

export const companyOverviewQueryKey = (companyId: string | null) =>
  ['company-workspace', companyId, 'overview'] as const
export const companyBillingQueryKey = (companyId: string | null) =>
  ['company-workspace', companyId, 'billing'] as const
export const companyCollaboratorsQueryKey = (companyId: string | null) =>
  ['company-collaborators', companyId] as const

export function useCompanyOverview(companyId: string | null) {
  return useQuery({
    queryKey: companyOverviewQueryKey(companyId),
    queryFn: getCompanyOverview,
    enabled: companyId !== null,
  })
}

export function useCompanyBilling(companyId: string | null) {
  return useQuery({
    queryKey: companyBillingQueryKey(companyId),
    queryFn: getCompanyBilling,
    enabled: companyId !== null,
  })
}

export function useCompanyCollaborators(companyId: string | null) {
  return useQuery({
    queryKey: companyCollaboratorsQueryKey(companyId),
    queryFn: listCompanyCollaborators,
    enabled: companyId !== null,
  })
}

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

export function useCreateCollaborator(companyId: string | null) {
  const invalidateCompanyData = useCompanyMutationInvalidation(companyId)
  return useMutation({
    mutationFn: (input: NewCollaboratorInput) => createCollaborator(input),
    onSuccess: invalidateCompanyData,
  })
}

export function useUpdateCollaborator(companyId: string | null) {
  const invalidateCompanyData = useCompanyMutationInvalidation(companyId)
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCollaboratorInput }) =>
      updateCollaborator(id, input),
    onSuccess: invalidateCompanyData,
  })
}

export function useSetCollaboratorActive(companyId: string | null) {
  const invalidateCompanyData = useCompanyMutationInvalidation(companyId)
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      setCollaboratorActive(id, isActive),
    onSuccess: invalidateCompanyData,
  })
}
