import { useQuery } from '@tanstack/react-query'
import { getDashboard, type DashboardQuery } from '@/lib/api'

// Hook React que gerencia o estado e as operações relacionadas a dashboard.
export function useDashboard(companyId: string | null, query: DashboardQuery) {
  return useQuery({
    queryKey: ['dashboard', companyId, query.from, query.to],
    queryFn: () => getDashboard(query),
    enabled: companyId !== null && Boolean(query.from && query.to) && query.from <= query.to,
  })
}
