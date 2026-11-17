import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduct, type CreateProductInput } from '@/lib/api'

/** Cadastra um produto e atualiza a lista de Produtos, o PDV e o Dashboard. */
export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['products'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
    },
  })
}
