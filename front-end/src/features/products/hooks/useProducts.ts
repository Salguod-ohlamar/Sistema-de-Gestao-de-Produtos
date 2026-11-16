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

export const productsQueryKey = (companyId: string | null) => ['products', companyId] as const
export const productQueryKey = (companyId: string | null, id: number | null) =>
  [...productsQueryKey(companyId), id] as const

function useCompanyId(): string | null {
  const { user } = useAuth()
  return user?.id ?? null
}

export function useProducts() {
  const companyId = useCompanyId()
  return useQuery({
    queryKey: productsQueryKey(companyId),
    queryFn: listProducts,
    enabled: companyId !== null,
  })
}

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

export function useFindProductByCode() {
  return useMutation({ mutationFn: (code: string) => findProductByCode(code) })
}

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
