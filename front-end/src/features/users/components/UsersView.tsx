import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  RefreshCw,
  Search,
  Shield,
  UserPlus,
  Users,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { UserDrawer } from './UserDrawer'
import { useAuth } from '@/features/auth/context'
import {
  useCompanyCollaborators,
  useSetCollaboratorActive,
} from '@/features/company/hooks/useCompanyWorkspace'
import {
  ApiError,
  type CollaboratorRole,
  type CompanyCollaborator,
} from '@/lib/api'
import { paginate, pageWindow } from '@/lib/pagination'
import { toast } from 'sonner'

const USERS_PAGE_SIZE = 8

function roleLabel(role: CollaboratorRole) {
  if (role === 'administrator') return 'Administrador'
  if (role === 'manager') return 'Gerente'
  return 'Operador / Vendedor'
}

function formatHireDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('pt-BR').format(date)
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function UsersView() {
  const { user } = useAuth()
  const companyId = user?.principalType === 'root' ? null : user?.id ?? null
  const collaboratorsQuery = useCompanyCollaborators(companyId)
  const setActiveMutation = useSetCollaboratorActive(companyId)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedCollaborator, setSelectedCollaborator] =
    useState<CompanyCollaborator | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | CollaboratorRole>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [page, setPage] = useState(1)
  const canManageTeam =
    user?.principalType === 'company' ||
    user?.isAdmin === true ||
    user?.roleKey === 'administrator'

  const collaborators = collaboratorsQuery.data ?? []
  const filteredCollaborators = collaborators.filter((collaborator) => {
    const query = searchQuery.trim().toLocaleLowerCase()
    const matchesQuery =
      !query ||
      collaborator.name.toLocaleLowerCase().includes(query) ||
      collaborator.email.toLocaleLowerCase().includes(query)
    const matchesRole = roleFilter === 'all' || collaborator.role === roleFilter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? collaborator.is_active : !collaborator.is_active)
    return matchesQuery && matchesRole && matchesStatus
  })
  const pageData = paginate(filteredCollaborators, page, USERS_PAGE_SIZE)
  const activeCount = collaborators.filter((collaborator) => collaborator.is_active).length
  const administratorCount = collaborators.filter(
    (collaborator) => collaborator.role === 'administrator' || collaborator.is_admin
  ).length

  const openCreateDrawer = () => {
    setSelectedCollaborator(null)
    setDrawerOpen(true)
  }

  const openEditDrawer = (collaborator: CompanyCollaborator) => {
    setSelectedCollaborator(collaborator)
    setDrawerOpen(true)
  }

  const toggleCollaboratorActive = async (collaborator: CompanyCollaborator) => {
    try {
      await setActiveMutation.mutateAsync({
        id: collaborator.id,
        isActive: !collaborator.is_active,
      })
      toast.success(
        collaborator.is_active
          ? 'Acesso do colaborador desativado.'
          : 'Acesso do colaborador ativado.'
      )
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível atualizar o acesso do colaborador.'
      )
    }
  }

  if (user?.principalType === 'root' || !user) {
    return (
      <div className="p-8 text-center text-sm text-text-muted">
        A gestão de colaboradores está disponível para usuários vinculados a uma empresa.
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 py-7 space-y-7">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
            Usuários e colaboradores
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Gerencie os acessos cadastrados para sua empresa.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => void collaboratorsQuery.refetch()}
            disabled={collaboratorsQuery.isFetching}
            aria-label="Atualizar lista de colaboradores"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${collaboratorsQuery.isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          {canManageTeam && (
            <Button onClick={openCreateDrawer} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Novo colaborador
            </Button>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 bg-surface-1 border-border">
          <div className="flex items-center justify-between text-sm text-text-muted">
            Total de colaboradores
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 font-headline text-2xl font-bold text-text-primary">
            {collaborators.length}
          </p>
        </Card>
        <Card className="p-5 bg-surface-1 border-border">
          <div className="flex items-center justify-between text-sm text-text-muted">
            Acessos ativos
            <span className="h-2 w-2 rounded-full bg-cyan-accent" />
          </div>
          <p className="mt-3 font-headline text-2xl font-bold text-text-primary">
            {activeCount}
          </p>
        </Card>
        <Card className="p-5 bg-surface-1 border-border">
          <div className="flex items-center justify-between text-sm text-text-muted">
            Administradores
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 font-headline text-2xl font-bold text-text-primary">
            {administratorCount}
          </p>
        </Card>
      </section>

      <Card className="rounded-xl bg-surface-2 border-border overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative w-full lg:max-w-[360px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              aria-label="Buscar colaboradores"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Buscar por nome ou e-mail..."
              className="pl-9 bg-surface-1"
            />
          </div>
          <select
            aria-label="Filtrar por perfil"
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value as 'all' | CollaboratorRole)
              setPage(1)
            }}
            className="h-10 rounded-lg border border-border bg-surface-1 px-3 text-xs text-text-primary"
          >
            <option value="all">Todos os perfis</option>
            <option value="administrator">Administrador</option>
            <option value="manager">Gerente</option>
            <option value="operator">Operador / Vendedor</option>
          </select>
          <select
            aria-label="Filtrar por status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as 'all' | 'active' | 'inactive')
              setPage(1)
            }}
            className="h-10 rounded-lg border border-border bg-surface-1 px-3 text-xs text-text-primary"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
          <span className="ml-auto text-xs text-text-muted">
            {filteredCollaborators.length} de {collaborators.length}
          </span>
        </div>

        {collaboratorsQuery.isLoading ? (
          <p className="p-8 text-center text-sm text-text-secondary" role="status">
            Carregando colaboradores...
          </p>
        ) : collaboratorsQuery.isError ? (
          <div className="p-8 text-center" role="alert">
            <p className="text-sm text-status-error">
              {collaboratorsQuery.error instanceof ApiError
                ? collaboratorsQuery.error.message
                : 'Não foi possível carregar os colaboradores.'}
            </p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => void collaboratorsQuery.refetch()}
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="h-11 bg-surface-1 border-b border-border text-xs uppercase tracking-wider text-text-muted">
                  <th className="pl-6 pr-4 font-medium">Colaborador</th>
                  <th className="px-4 font-medium">Perfil</th>
                  <th className="px-4 font-medium">Contratação</th>
                  <th className="px-4 font-medium">Status</th>
                  <th className="pr-6 pl-4 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {pageData.items.map((collaborator) => {
                  const isCurrentUser =
                    user.principalType === 'collaborator' &&
                    String(collaborator.id) === user.id
                  const canDeactivate =
                    canManageTeam && !(isCurrentUser && collaborator.is_active)
                  return (
                    <tr key={collaborator.id} className="h-16 hover:bg-surface-elevated/40">
                      <td className="pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                            {initials(collaborator.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-text-primary">
                              {collaborator.name}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-text-muted">(você)</span>
                              )}
                            </p>
                            <p className="truncate text-xs text-text-muted">{collaborator.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4">
                        <Badge variant="outline">{roleLabel(collaborator.role)}</Badge>
                      </td>
                      <td className="px-4 text-xs text-text-secondary">
                        {formatHireDate(collaborator.hire_date)}
                      </td>
                      <td className="px-4">
                        <Badge variant={collaborator.is_active ? 'success' : 'secondary'}>
                          {collaborator.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="pr-6 pl-4">
                        <div className="flex justify-end gap-2">
                          {canManageTeam && (
                            <>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Editar ${collaborator.name}`}
                                title="Editar colaborador"
                                onClick={() => openEditDrawer(collaborator)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!canDeactivate || setActiveMutation.isPending}
                                title={
                                  !canDeactivate && isCurrentUser
                                    ? 'Você não pode desativar o próprio acesso.'
                                    : undefined
                                }
                                onClick={() => void toggleCollaboratorActive(collaborator)}
                              >
                                {collaborator.is_active ? 'Desativar' : 'Ativar'}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {pageData.items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-sm text-text-muted">
                      {collaborators.length === 0
                        ? 'Nenhum colaborador cadastrado.'
                        : 'Nenhum colaborador corresponde aos filtros.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!collaboratorsQuery.isLoading && !collaboratorsQuery.isError && (
          <div className="p-4 border-t border-border flex items-center justify-between text-xs">
            <span className="text-text-muted">
              Página {pageData.page} de {pageData.totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="icon-sm"
                aria-label="Página anterior"
                disabled={pageData.page <= 1}
                onClick={() => setPage(pageData.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {pageWindow(pageData.page, pageData.totalPages).map((number, index) =>
                number === null ? (
                  <span key={`gap-${index}`} className="px-1 text-text-muted">…</span>
                ) : (
                  <Button
                    key={number}
                    variant={number === pageData.page ? 'default' : 'secondary'}
                    size="sm"
                    aria-current={number === pageData.page ? 'page' : undefined}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </Button>
                )
              )}
              <Button
                variant="secondary"
                size="icon-sm"
                aria-label="Próxima página"
                disabled={pageData.page >= pageData.totalPages}
                onClick={() => setPage(pageData.page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {drawerOpen && (
        <UserDrawer
          key={selectedCollaborator?.id ?? 'new'}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          collaborator={selectedCollaborator}
        />
      )}
    </div>
  )
}
