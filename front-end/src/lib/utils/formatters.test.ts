import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDecimal,
  formatInteger,
  formatPercent,
  formatDate,
  formatDateTime,
} from './formatters'

describe('formatters', () => {
  it('formata valores monetários em padrão BRL', () => {
    const formatted = formatCurrency(1234.56)
    // Pode conter non-breaking space (\u00a0)
    expect(formatted.replace(/\s/g, ' ')).toBe('R$ 1.234,56')
  })

  it('formata números decimais em padrão pt-BR', () => {
    expect(formatDecimal(1250.75)).toBe('1.250,75')
  })

  it('formata números inteiros com separador de milhar', () => {
    expect(formatInteger(12500)).toBe('12.500')
  })

  it('formata porcentagens em padrão pt-BR com ou sem sinal', () => {
    expect(formatPercent(12.5)).toBe('12,5%')
    expect(formatPercent(8.2, true)).toBe('+8,2%')
  })

  it('formata datas em padrão pt-BR', () => {
    const date = new Date(2026, 9, 12, 14, 30)
    expect(formatDate(date)).toBe('12/10/2026')
  })

  it('formata data e hora no estilo do dashboard', () => {
    const date = new Date(2026, 9, 12, 14, 30)
    expect(formatDateTime(date)).toBe('12 out, 14:30')
  })
})
