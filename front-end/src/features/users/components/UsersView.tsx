import { useState } from 'react'
import {
  Users,
  Shield,
  UserPlus,
  Download,
  Search,
  RefreshCw,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCollaborators } from '../hooks/useCollaborators'
import { mapCollaborator } from '../userMapper'
import { toast } from 'sonner'
import { paginate, pageWindow } from '@/lib/pagination'

const USERS_PAGE_SIZE = 4

export function UsersView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [page, setPage] = useState(1)

  const { data: collaborators, isLoading, isError, error, refetch } = useCollaborators()
  const users = (collaborators ?? []).map(mapCollaborator)
  const activeCount = users.filter((u) => u.status === 'Ativo').length
  const adminCount = users.filter((u) => u.role === 'Administrador').length
  const inactiveCount = users.length - activeCount

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'Todos' || u.role === roleFilter
    const matchesStatus = statusFilter === 'Todos' || u.status === statusFilter
    return matchesQuery && matchesRole && matchesStatus
  })

  const pageData = paginate(filteredUsers, page, USERS_PAGE_SIZE)

  const handleExport = () => {
    toast.info('Exportação ainda não está disponível.')
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 py-7 space-y-7">
      {/* Cabeçalho da Página */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
              Usuários
            </h1>
            <Badge
              variant="outline"
              className="px-2.5 py-0.5 text-[11px] font-mono tracking-wide uppercase text-cyan-accent bg-cyan-accent/10 border-cyan-accent/30"
            >
              Operação Ativa
            </Badge>
          </div>
          <p className="text-sm text-text-muted">
            Gerencie acessos, identidades e permissões de segurança da equipe
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleExport}
            className="h-10 px-4 rounded-xl gap-2 text-sm bg-surface-1 border-border hover:bg-surface-elevated text-text-primary shadow-sm cursor-pointer"
          >
            <Download className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
            <span>Exportar</span>
          </Button>

          <Button
            onClick={() => toast.info('Cadastro de usuário ainda não está disponível nesta tela.')}
            className="h-10 px-5 rounded-xl gap-2 font-medium shadow-[0_0_16px_rgba(47,107,255,0.35)] cursor-pointer"
          >
            <UserPlus className="h-4 w-4" strokeWidth={1.5} />
            <span>Novo usuário</span>
          </Button>
        </div>
      </header>

      {/* Faixa de Métricas (KPIs) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de usuários */}
        <Card className="p-5 rounded-xl bg-surface-1 border-border shadow-sm flex flex-col justify-between h-[104px] hover:border-border-highlight transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Total de usuários</span>
            <div className="w-7 h-7 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-primary">
              <Users className="h-4 w-4" strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline text-2xl font-bold text-text-primary">
              {users.length}
            </span>
            <span className="font-mono text-xs text-text-muted">Cadastrados</span>
          </div>
        </Card>

        {/* Ativos */}
        <Card className="p-5 rounded-xl bg-surface-1 border-border shadow-sm flex flex-col justify-between h-[104px] hover:border-border-highlight transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Ativos</span>
            <Badge
              variant="outline"
              className="px-2 py-0.5 text-[11px] font-mono text-cyan-accent bg-cyan-accent/10 border-cyan-accent/20"
            >
              {users.length ? `${((activeCount / users.length) * 100).toFixed(1).replace('.', ',')}%` : '0%'}
            </Badge>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline text-2xl font-bold text-text-primary">
              {activeCount}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-cyan-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent" />
              Em operação
            </span>
          </div>
        </Card>

        {/* Administradores */}
        <Card className="p-5 rounded-xl bg-surface-1 border-border shadow-sm flex flex-col justify-between h-[104px] hover:border-border-highlight transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Administradores</span>
            <div className="w-7 h-7 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-primary">
              <Shield className="h-4 w-4" strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline text-2xl font-bold text-text-primary">
              {adminCount}
            </span>
            <span className="text-xs text-text-muted">Privilégio total</span>
          </div>
        </Card>

        {/* Inativos */}
        <Card className="p-5 rounded-xl bg-surface-1 border-border shadow-sm flex flex-col justify-between h-[104px] hover:border-border-highlight transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Inativos</span>
            <Badge
              variant="outline"
              className="px-2 py-0.5 text-[11px] font-mono text-destructive bg-destructive/10 border-destructive/20"
            >
              Sem acesso
            </Badge>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline text-2xl font-bold text-text-primary">
              {inactiveCount}
            </span>
            <span className="text-xs text-destructive">Acesso desativado</span>
          </div>
        </Card>
      </section>

      {/* Tabela Principal */}
      <Card className="rounded-xl bg-surface-2 border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar de Filtros */}
        <div className="p-4 bg-surface-2 border-b border-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Campo de Pesquisa */}
            <div className="relative w-full sm:w-[320px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4"
                strokeWidth={1.5}
              />
              <Input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                placeholder="Buscar por nome ou e-mail..."
                className="h-10 pl-9 pr-4 rounded-xl bg-surface-1 border-border text-sm"
              />
            </div>

            {/* Filtro Perfil */}
            <div className="relative min-w-[160px]">
              <select
                aria-label="Filtrar por Perfil"
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
                className="w-full h-10 px-3.5 rounded-xl bg-surface-1 border border-border text-text-primary text-xs font-medium cursor-pointer focus:outline-none focus:border-border-highlight"
              >
                <option value="Todos">Perfil: Todos</option>
                <option value="Administrador">Administrador</option>
                <option value="Gerente">Gerente</option>
                <option value="Operador">Operador</option>
              </select>
            </div>

            {/* Filtro Status */}
            <div className="relative min-w-[150px]">
              <select
                aria-label="Filtrar por Status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="w-full h-10 px-3.5 rounded-xl bg-surface-1 border border-border text-text-primary text-xs font-medium cursor-pointer focus:outline-none focus:border-border-highlight"
              >
                <option value="Todos">Status: Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-text-muted font-mono text-xs">
            <span>
              {filteredUsers.length} de {users.length} exibidos
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setSearchQuery('')
                setRoleFilter('Todos')
                setStatusFilter('Todos')
                setPage(1)
                toast.info('Lista de usuários atualizada')
              }}
              className="text-text-muted hover:text-text-primary cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-11 bg-surface-1 border-b border-border text-text-muted text-xs uppercase tracking-wider font-mono select-none">
                <th className="pl-6 pr-4 font-medium">Usuário</th>
                <th className="px-4 font-medium">Perfil</th>
                <th className="px-4 font-medium">Admissão</th>
                <th className="px-4 font-medium">Status</th>
                <th className="pr-6 pl-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {isLoading && (
                <tr><td colSpan={5} className="py-12 text-center text-sm text-text-muted">Carregando usuários...</td></tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-destructive">
                    {error instanceof Error ? error.message : 'Não foi possível carregar os usuários.'}{' '}
                    <button type="button" className="underline cursor-pointer" onClick={() => void refetch()}>Tentar de novo</button>
                  </td>
                </tr>
              )}
              {!isLoading && !isError && pageData.items.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center text-sm text-text-muted">Nenhum usuário encontrado.</td></tr>
              )}
              {pageData.items.map((user) => (
                <tr
                  key={user.id}
                  className="h-16 hover:bg-surface-elevated/40 transition-colors group"
                >
                  {/* Usuário */}
                  <td className="pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-headline text-xs font-bold shrink-0 ${user.initialsBg} ${user.initialsColor}`}
                      >
                        {user.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                          {user.name}
                        </span>
                        <span className="font-mono text-xs text-text-muted truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Perfil */}
                  <td className="px-4">
                    <Badge
                      variant="outline"
                      className={`text-xs font-mono ${
                        user.role === 'Administrador'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : user.role === 'Gerente'
                          ? 'bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20'
                          : 'bg-surface-elevated text-text-secondary border-border'
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </td>

                  {/* Admissão */}
                  <td className="px-4">
                    <span className="font-mono text-xs text-text-primary">{user.hiredOn}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4">
                    {user.status === 'Ativo' ? (
                      <Badge
                        variant="success"
                        className="gap-1.5 font-mono text-xs px-2.5 py-0.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                        Ativo
                      </Badge>
                                        ) : (
                      <Badge
                        variant="secondary"
                        className="gap-1.5 font-mono text-xs px-2.5 py-0.5 text-text-disabled"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-text-disabled" />
                        Inativo
                      </Badge>
                    )}
                  </td>

                  {/* Ações */}
                  <td className="pr-6 pl-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => toast.info('Edição de usuário ainda não está disponível nesta tela.')}
                        className="text-text-muted hover:text-text-primary cursor-pointer"
                        title="Editar Usuário"
                      >
                        <Edit2 className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-text-muted hover:text-text-primary cursor-pointer"
                        title="Opções"
                      >
                        <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="p-4 bg-surface-1 border-t border-border flex items-center justify-between text-xs">
          <span className="text-text-muted font-mono">
            Página {pageData.page} de {pageData.totalPages}
          </span>
          <div className="flex items-center gap-1 font-mono">
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label="Página anterior"
              disabled={pageData.page <= 1}
              onClick={() => setPage(pageData.page - 1)}
              className="h-7 w-7 bg-surface-2 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {pageWindow(pageData.page, pageData.totalPages).map((n, i) =>
              n === null ? (
                <span key={`gap-${i}`} className="text-text-muted px-1">
                  ...
                </span>
              ) : n === pageData.page ? (
                <Button key={n} size="sm" aria-current="page" className="h-7 px-2.5 text-xs font-bold bg-primary text-text-primary">
                  {n}
                </Button>
              ) : (
                <Button
                  key={n}
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(n)}
                  className="h-7 px-2.5 text-xs bg-surface-2 text-text-muted hover:text-text-primary"
                >
                  {n}
                </Button>
              )
            )}
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label="Próxima página"
              disabled={pageData.page >= pageData.totalPages}
              onClick={() => setPage(pageData.page + 1)}
              className="h-7 w-7 bg-surface-2 text-text-muted hover:text-text-primary disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
