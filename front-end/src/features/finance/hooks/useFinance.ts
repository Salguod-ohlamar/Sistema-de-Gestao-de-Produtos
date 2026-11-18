import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createExpense, deleteExpense, getDre, listExpenses, type DreQuery, type ExpenseInput } from '@/lib/api'

// Hook React que gerencia o estado e as operações relacionadas a dre.
export function useDre(query: DreQuery) {
  return useQuery({ queryKey: ['dre', query], queryFn: () => getDre(query) })
}

// Hook React que gerencia o estado e as operações relacionadas a expenses.
export function useExpenses(from: string, to: string) {
  return useQuery({ queryKey: ['expenses', from, to], queryFn: () => listExpenses(from, to) })
}

// Hook React que gerencia o estado e as operações relacionadas a invalidate finance.
function useInvalidateFinance() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['dre'] }),
      queryClient.invalidateQueries({ queryKey: ['expenses'] }),
    ])
}

// Hook React que gerencia o estado e as operações relacionadas a create expense.
export function useCreateExpense() {
  const invalidate = useInvalidateFinance()
  return useMutation({ mutationFn: (input: ExpenseInput) => createExpense(input), onSuccess: invalidate })
}

// Hook React que gerencia o estado e as operações relacionadas a delete expense.
export function useDeleteExpense() {
  const invalidate = useInvalidateFinance()
  return useMutation({ mutationFn: (id: number) => deleteExpense(id), onSuccess: invalidate })
}
