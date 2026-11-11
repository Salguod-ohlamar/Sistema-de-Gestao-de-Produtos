import { describe, it, expect } from 'vitest'
import { currentMonthRange, formatDateBr, toDateInput } from './dreFormat'

describe('dreFormat', () => {
  it('período do mês atual', () => {
    expect(currentMonthRange(new Date(2026, 10, 6))).toEqual({ from: '2026-11-01', to: '2026-11-30' })
    expect(currentMonthRange(new Date(2028, 1, 10))).toEqual({ from: '2028-02-01', to: '2028-02-29' })
  })
  it('data local sem deslocar o dia', () => {
    expect(toDateInput(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
  it('formata data brasileira a partir do ISO', () => {
    expect(formatDateBr('2026-11-06')).toBe('06/11/2026')
    expect(formatDateBr('2026-11-06T00:00:00.000Z')).toBe('06/11/2026')
  })
})
