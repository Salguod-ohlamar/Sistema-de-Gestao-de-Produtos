import { describe, it, expect } from 'vitest'
import { initialsOf, mapCollaborator } from './userMapper'

describe('userMapper', () => {
  it('gera iniciais de nomes simples e compostos', () => {
    expect(initialsOf('Vinical')).toBe('V')
    expect(initialsOf('Ana Maria Souza')).toBe('AS')
    expect(initialsOf('  ')).toBe('?')
  })

  it('traduz perfil e status do colaborador', () => {
    const u = mapCollaborator({
      id: 3, name: 'Ana Souza', email: 'ana@x.com', cpf: null, phone: null,
      hire_date: '2026-01-05', termination_date: null, role: 'manager',
      is_active: false, created_at: '2026-01-05T10:00:00Z',
    })
    expect(u.role).toBe('Gerente')
    expect(u.status).toBe('Inativo')
    expect(u.hiredOn).toBe('05/01/2026')
  })
})
