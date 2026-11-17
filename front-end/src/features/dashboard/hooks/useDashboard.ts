import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '@/lib/api'
import { lastDaysRange } from '../dashboardRange'

export function useDashboard(days: number) {
  const { from, to } = lastDaysRange(days)
  return useQuery({ queryKey: ['dashboard', from, to], queryFn: () => getDashboard(from, to, 5) })
}
