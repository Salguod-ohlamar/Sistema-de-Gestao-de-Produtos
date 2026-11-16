import { describe, expect, it } from 'vitest'
import type { DashboardDailySale } from '@/lib/api'
import { dateRangeForDays, fillDailySales } from './dashboardFormat'

describe('dashboard date helpers', () => {
  it('creates an inclusive date range ending on the current local day', () => {
    expect(dateRangeForDays(7, new Date(2026, 10, 15, 20))).toEqual({
      from: '2026-11-09',
      to: '2026-11-15',
    })
  })

  it('fills missing days with zero sales without changing returned data', () => {
    const sales: DashboardDailySale[] = [
      { date: '2026-11-14', sales_count: 2, revenue: '40.00' },
    ]

    expect(fillDailySales(sales, '2026-11-13', '2026-11-15')).toEqual([
      { date: '2026-11-13', sales_count: 0, revenue: '0.00' },
      sales[0],
      { date: '2026-11-15', sales_count: 0, revenue: '0.00' },
    ])
  })
})
