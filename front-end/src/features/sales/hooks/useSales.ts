import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSale, listSales, type SaleItemInput } from '@/lib/api'
import { productsQueryKey, useProducts } from '@/features/products/hooks/useProducts'
import { useAuth } from '@/features/auth/context'

export { useProducts }

export function useSalesHistory(companyId: string | null) {
  return useQuery({
    queryKey: ['sales', companyId],
    queryFn: listSales,
    enabled: companyId !== null,
  })
}

export function useCreateSale() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const companyId = user?.id ?? null
  return useMutation({
    mutationFn: (items: SaleItemInput[]) => createSale(items),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productsQueryKey(companyId) }),
        queryClient.invalidateQueries({ queryKey: ['sales', companyId] }),
      ])
    },
  })
}
