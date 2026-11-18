import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context'
import {
  createProduct,
  deleteProduct,
  findProductByCode,
  getProduct,
  listProducts,
  updateProduct,
  type ProductInput,
} from '@/lib/api'

// Implementa a operação relacionada a products query key.
export const productsQueryKey = (companyId: string | null) => ['products', companyId] as const
// Implementa a operação relacionada a product query key.
export const productQueryKey = (companyId: string | null, id: number | null) =>
  [...productsQueryKey(companyId), id] as const

// Hook React que gerencia o estado e as operações relacionadas a company id.
function useCompanyId(): string | null {
  const { user } = useAuth()
  return user?.id ?? null
}

// Hook React que gerencia o estado e as operações relacionadas a products.
export function useProducts() {
  const companyId = useCompanyId()
  return useQuery({
    queryKey: productsQueryKey(companyId),
    queryFn: listProducts,
    enabled: companyId !== null,
  })
}

// Hook React que gerencia o estado e as operações relacionadas a product.
export function useProduct(id: number | null) {
  const companyId = useCompanyId()
  return useQuery({
    queryKey: productQueryKey(companyId, id),
    queryFn: () => {
      if (id === null) throw new Error('O identificador do produto é obrigatório.')
      return getProduct(id)
    },
    enabled: companyId !== null && id !== null,
  })
}

// Hook React que gerencia o estado e as operações relacionadas a find product by code.
export function useFindProductByCode() {
  return useMutation({ mutationFn: (code: string) => findProductByCode(code) })
}

// Hook React que gerencia o estado e as operações relacionadas a create product.
export function useCreateProduct() {
  const queryClient = useQueryClient()
  const companyId = useCompanyId()
  return useMutation({
    mutationFn: (input: ProductInput) => createProduct(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productsQueryKey(companyId) })
    },
  })
}

// Hook React que gerencia o estado e as operações relacionadas a update product.
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const companyId = useCompanyId()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ProductInput }) => updateProduct(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productsQueryKey(companyId) })
    },
  })
}

// Hook React que gerencia o estado e as operações relacionadas a delete product.
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const companyId = useCompanyId()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productsQueryKey(companyId) })
    },
  })
}
