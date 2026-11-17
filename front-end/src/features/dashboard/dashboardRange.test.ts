import { describe, it, expect } from 'vitest'
import { lastDaysRange } from './dashboardRange'

describe('lastDaysRange', () => {
  it('inclui hoje e volta days-1 dias', () => {
    const r = lastDaysRange(7, new Date('2026-11-17T15:00:00Z'))
    expect(r).toEqual({ from: '2026-11-11', to: '2026-11-17' })
  })

  it('usa o dia de São Paulo, não o de UTC', () => {
    // 01:00 UTC de 18/11 ainda é 22:00 de 17/11 em São Paulo
    expect(lastDaysRange(1, new Date('2026-11-18T01:00:00Z'))).toEqual({
      from: '2026-11-17',
      to: '2026-11-17',
    })
  })
})
