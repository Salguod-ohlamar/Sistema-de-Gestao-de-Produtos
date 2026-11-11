import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSale, listProducts, listSales, type SaleItemInput } from '@/lib/api'

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: listProducts })
}

export function useSalesHistory() {
  return useQuery({ queryKey: ['sales'], queryFn: listSales })
}

export function useCreateSale() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (items: SaleItemInput[]) => createSale(items),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['products'] }),
        queryClient.invalidateQueries({ queryKey: ['sales'] }),
      ])
    },
  })
}
