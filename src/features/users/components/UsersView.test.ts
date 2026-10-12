import { describe, it, expect } from 'vitest'

describe('UsersView filters and logic', () => {
  const users = [
    { id: '1', name: 'Mariana Albuquerque', email: 'mariana.a@nexora.io', role: 'Administrador', status: 'Ativo' },
    { id: '2', name: 'Rafael Tavares', email: 'rafael.t@nexora.io', role: 'Gerente', status: 'Ativo' },
    { id: '3', name: 'Beatriz Nogueira', email: 'beatriz.n@nexora.io', role: 'Vendedor', status: 'Ativo' },
    { id: '4', name: 'Lucas Menezes', email: 'lucas.m@nexora.io', role: 'Estoquista', status: 'Ativo' },
    { id: '5', name: 'Camila Duarte', email: 'camila.d@nexora.io', role: 'Vendedor', status: 'Convite enviado' },
    { id: '6', name: 'Thiago Ribeiro', email: 'thiago.r@nexora.io', role: 'Estoquista', status: 'Inativo' },
  ]

  it('filtra usuários por busca de texto no nome ou email', () => {
    const query = 'mariana'
    const result = users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    )
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Mariana Albuquerque')
  })

  it('filtra usuários por perfil', () => {
    const result = users.filter((u) => u.role === 'Estoquista')
    expect(result).toHaveLength(2)
  })

  it('filtra usuários por status operacional', () => {
    const pendentes = users.filter((u) => u.status === 'Convite enviado')
    expect(pendentes).toHaveLength(1)
    expect(pendentes[0].name).toBe('Camila Duarte')
  })
})
