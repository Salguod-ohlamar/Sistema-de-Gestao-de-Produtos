import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createExpense, deleteExpense, getDre, listExpenses, type DreQuery, type ExpenseInput } from '@/lib/api'

export function useDre(query: DreQuery) {
  return useQuery({ queryKey: ['dre', query], queryFn: () => getDre(query) })
}

export function useExpenses(from: string, to: string) {
  return useQuery({ queryKey: ['expenses', from, to], queryFn: () => listExpenses(from, to) })
}

function useInvalidateFinance() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['dre'] }),
      queryClient.invalidateQueries({ queryKey: ['expenses'] }),
    ])
}

export function useCreateExpense() {
  const invalidate = useInvalidateFinance()
  return useMutation({ mutationFn: (input: ExpenseInput) => createExpense(input), onSuccess: invalidate })
}

export function useDeleteExpense() {
  const invalidate = useInvalidateFinance()
  return useMutation({ mutationFn: (id: number) => deleteExpense(id), onSuccess: invalidate })
}
