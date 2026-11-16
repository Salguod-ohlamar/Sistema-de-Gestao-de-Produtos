import { Building2, Boxes, CalendarDays, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/features/auth/context'
import {
  useCompanyBilling,
  useCompanyOverview,
} from '@/features/company/hooks/useCompanyWorkspace'
import { ApiError } from '@/lib/api'
import { formatCurrency } from '@/lib/utils/formatters'

interface CompanyWorkspaceViewProps {
  onNavigate?: (view: string) => void
}

function currency(value: number | string) {
  return formatCurrency(Number(value) || 0)
}

function formatDate(value: string | null) {
  if (!value) return 'Não informado'
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? 'Não informado'
    : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date)
}

function QueryError({
  error,
  onRetry,
  fallback,
}: {
  error: unknown
  onRetry: () => void
  fallback: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-status-error/30 bg-status-error/5 p-4">
      <p className="text-sm text-status-error">
        {error instanceof ApiError ? error.message : fallback}
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  )
}

export function CompanyWorkspaceView({ onNavigate }: CompanyWorkspaceViewProps) {
  const { user } = useAuth()
  const companyId = user?.principalType === 'root' ? null : user?.id ?? null
  const overviewQuery = useCompanyOverview(companyId)
  const billingQuery = useCompanyBilling(companyId)

  if (!companyId || user?.principalType === 'root') {
    return (
      <div className="p-8 text-center text-sm text-text-muted">
        O espaço da empresa está disponível para usuários vinculados a uma empresa.
      </div>
    )
  }

  const overview = overviewQuery.data
  const billing = billingQuery.data

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="font-headline text-2xl font-bold text-text-primary">
              Espaço da empresa
            </h1>
          </div>
          <p className="mt-1 text-sm text-text-muted">
            {overview?.trade_name ?? user?.name ?? 'Resumo da empresa, equipe e plano'}
          </p>
        </div>
        <Button onClick={() => onNavigate?.('usuarios')} className="gap-2">
          <Users className="h-4 w-4" />
          Gerenciar colaboradores
        </Button>
      </header>

      {overviewQuery.isLoading ? (
        <p className="p-8 text-center text-sm text-text-secondary" role="status">
          Carregando dados da empresa...
        </p>
      ) : overviewQuery.isError ? (
        <QueryError
          error={overviewQuery.error}
          onRetry={() => void overviewQuery.refetch()}
          fallback="Não foi possível carregar o espaço da empresa."
        />
      ) : overview ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="p-5 bg-surface-1 border-border">
              <div className="flex items-center justify-between text-sm text-text-muted">
                Produtos cadastrados
                <Boxes className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 font-headline text-2xl font-bold text-text-primary">
                {overview.product_count.toLocaleString('pt-BR')}
              </p>
            </Card>
            <Card className="p-5 bg-surface-1 border-border">
              <div className="flex items-center justify-between text-sm text-text-muted">
                Unidades em estoque
                <Boxes className="h-4 w-4 text-cyan-accent" />
              </div>
              <p className="mt-3 font-headline text-2xl font-bold text-text-primary">
                {Number(overview.stock_units).toLocaleString('pt-BR')}
              </p>
            </Card>
            <Card className="p-5 bg-surface-1 border-border">
              <div className="flex items-center justify-between text-sm text-text-muted">
                Valor de custo do estoque
                <span className="text-xs">R$</span>
              </div>
              <p className="mt-3 font-headline text-xl font-bold text-text-primary">
                {currency(overview.stock_cost_value)}
              </p>
            </Card>
            <Card className="p-5 bg-surface-1 border-border">
              <div className="flex items-center justify-between text-sm text-text-muted">
                Saúde do estoque
                <Badge variant={overview.stock_health_percent >= 70 ? 'success' : 'warning'}>
                  {overview.stock_health_percent}%
                </Badge>
              </div>
              <p className="mt-3 text-sm text-text-secondary">
                {overview.critical_product_count} produto(s) em nível crítico
              </p>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6 bg-surface-1 border-border space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline text-lg font-semibold text-text-primary">
                    Plano da empresa
                  </h2>
                  <p className="text-sm text-text-muted">Informações vinculadas à conta.</p>
                </div>
                <Badge variant="outline">{overview.plan_code ?? 'Sem plano'}</Badge>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-text-muted">Início do plano</dt>
                  <dd className="mt-1 text-sm text-text-primary">
                    {formatDate(overview.plan_started_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-text-muted">Término do plano</dt>
                  <dd className="mt-1 text-sm text-text-primary">
                    {formatDate(overview.plan_end_date)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-text-muted">Duração contratada</dt>
                  <dd className="mt-1 text-sm text-text-primary">
                    {overview.plan_term_months === null
                      ? 'Não informado'
                      : `${overview.plan_term_months} meses`}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-text-muted">Colaboradores ativos</dt>
                  <dd className="mt-1 text-sm text-text-primary">
                    {overview.active_collaborator_count} de {overview.collaborator_count}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="p-6 bg-surface-1 border-border space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline text-lg font-semibold text-text-primary">
                    Vigência e cobrança
                  </h2>
                  <p className="text-sm text-text-muted">
                    A API ainda não fornece valores de mensalidade.
                  </p>
                </div>
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              {billingQuery.isLoading ? (
                <p className="text-sm text-text-secondary" role="status">
                  Carregando dados financeiros...
                </p>
              ) : billingQuery.isError ? (
                <QueryError
                  error={billingQuery.error}
                  onRetry={() => void billingQuery.refetch()}
                  fallback="Não foi possível carregar o financeiro da empresa."
                />
              ) : billing ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-text-muted">Próximo vencimento estimado</dt>
                    <dd className="mt-1 text-sm text-text-primary">
                      {formatDate(billing.next_due_date)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted">Início do plano</dt>
                    <dd className="mt-1 text-sm text-text-primary">
                      {formatDate(billing.plan_started_at)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted">Duração contratada</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-primary">
                      {billing.plan_term_months === null
                        ? 'Não informado'
                        : `${billing.plan_term_months} meses`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted">Colaboradores ativos</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-primary">
                      {billing.active_collaborator_count}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-text-muted">Dados financeiros indisponíveis.</p>
              )}
            </Card>
          </section>
        </>
      ) : null}
    </div>
  )
}
