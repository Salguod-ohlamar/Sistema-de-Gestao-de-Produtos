import { useState } from 'react'
import {
  AlertTriangle,
  DollarSign,
  Download,
  Receipt,
  ShoppingBag,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/api'
import { formatCurrency } from '@/lib/utils/formatters'
import { useAuth } from '@/features/auth/context'
import { useSalesHistory } from '@/features/sales/hooks/useSales'
import { useDashboard } from '../hooks/useDashboard'
import { dateRangeForDays } from '../dashboardFormat'
import { CategoryDonut } from './CategoryDonut'
import { KpiCard } from './KpiCard'
import { RecentSalesTable } from './RecentSalesTable'
import { SalesChart } from './SalesChart'
import { StockAlerts } from './StockAlerts'
import { TopProducts } from './TopProducts'
import { toast } from 'sonner'

interface DashboardViewProps {
  onNavigate?: (view: string) => void
}

type Period = '7' | '30' | '90' | 'custom'

export function DashboardView({ onNavigate }: DashboardViewProps = {}) {
  const { user } = useAuth()
  const companyId = user?.id ?? null
  const [period, setPeriod] = useState<Period>('30')
  const initialCustomRange = dateRangeForDays(30)
  const [customFrom, setCustomFrom] = useState(initialCustomRange.from)
  const [customTo, setCustomTo] = useState(initialCustomRange.to)
  const range = period === 'custom'
    ? { from: customFrom, to: customTo }
    : dateRangeForDays(Number(period))
  const hasValidRange = Boolean(range.from && range.to && range.from <= range.to)

  const dashboardQuery = useDashboard(companyId, range)
  const salesQuery = useSalesHistory(companyId)

  const handleExport = () => {
    toast.info('A exportação de relatórios ainda não está disponível.')
  }
  const dashboard = dashboardQuery.data

  return (
    <div className="w-full max-w-[1140px] mx-auto p-8 flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
              Dashboard
            </h1>
            <Badge
              variant="outline"
              className="text-[11px] font-mono uppercase tracking-wider text-cyan-accent bg-cyan-accent/10 border-cyan-accent/30 px-2.5 py-0.5"
            >
              Dados atualizados
            </Badge>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Vendas e estoque da empresa no período selecionado
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <div className="flex items-center p-1 rounded-lg bg-surface-1 border border-border shadow-inner">
            {(['7', '30', '90', 'custom'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setPeriod(value)}
                aria-pressed={period === value}
                className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  period === value
                    ? 'bg-surface-elevated border border-border-highlight text-text-primary font-semibold shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {value === 'custom' ? 'Personalizado' : `${value} dias`}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            onClick={handleExport}
            className="h-10 px-4 text-sm gap-2 bg-surface-2 border-border hover:border-border-highlight text-text-primary shadow-sm"
          >
            <Download className="h-4 w-4 text-cyan-accent" strokeWidth={1.5} />
            <span>Exportar relatório</span>
          </Button>
        </div>
      </header>

      {period === 'custom' && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface-1 p-4">
          <label className="flex flex-col gap-1 text-xs text-text-secondary">
            De
            <input
              type="date"
              value={customFrom}
              max={customTo || undefined}
              onChange={(event) => setCustomFrom(event.target.value)}
              className="h-9 rounded-md border border-border bg-surface-elevated px-2 text-text-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-text-secondary">
            Até
            <input
              type="date"
              value={customTo}
              min={customFrom || undefined}
              onChange={(event) => setCustomTo(event.target.value)}
              className="h-9 rounded-md border border-border bg-surface-elevated px-2 text-text-primary"
            />
          </label>
        </div>
      )}

      {!hasValidRange && (
        <p className="text-center text-sm text-status-warning" role="alert">
          Informe um período válido: a data inicial deve ser anterior ou igual à final.
        </p>
      )}
      {hasValidRange && dashboardQuery.isLoading && (
        <p className="p-8 text-center text-text-secondary" role="status">Carregando dashboard...</p>
      )}
      {hasValidRange && (dashboardQuery.isError || (!dashboardQuery.isLoading && !dashboard)) && (
        <div className="flex flex-col items-center gap-3 p-8 text-center" role="alert">
          <AlertTriangle className="h-6 w-6 text-status-error" aria-hidden="true" />
          <p className="text-sm text-text-primary">
            {dashboardQuery.error instanceof ApiError
              ? dashboardQuery.error.message
              : 'Não foi possível carregar o dashboard.'}
          </p>
          <Button variant="outline" onClick={() => void dashboardQuery.refetch()}>
            Tentar novamente
          </Button>
        </div>
      )}

      {hasValidRange && dashboard && (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Faturamento"
              value={formatCurrency(Number(dashboard.summary.revenue))}
              deltaLabel="no período selecionado"
              icon={DollarSign}
              sparklineVariant="blue"
            />
            <KpiCard
              title="Vendas concluídas"
              value={dashboard.summary.sales_count.toLocaleString('pt-BR')}
              deltaLabel="no período selecionado"
              icon={ShoppingBag}
              sparklineVariant="blue"
            />
            <KpiCard
              title="Ticket médio"
              value={formatCurrency(Number(dashboard.summary.average_ticket))}
              deltaLabel="no período selecionado"
              icon={Receipt}
              sparklineVariant="cyan"
            />
            <KpiCard
              title="Produtos no estoque mínimo"
              value={dashboard.summary.low_stock_count.toLocaleString('pt-BR')}
              deltaLabel={dashboard.summary.low_stock_count ? 'requer reposição' : 'sem alertas'}
              attentionText={dashboard.summary.low_stock_count ? 'Atenção' : undefined}
              icon={AlertTriangle}
              sparklineVariant="amber"
              isWarning={dashboard.summary.low_stock_count > 0}
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <SalesChart sales={dashboard.daily_sales} from={range.from} to={range.to} />
            </div>
            <div className="lg:col-span-4">
              <CategoryDonut categories={dashboard.stock_by_category} />
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopProducts
              products={dashboard.top_products}
              onViewReport={() => onNavigate?.('historico')}
            />
            <StockAlerts
              products={dashboard.low_stock}
              totalCount={dashboard.summary.low_stock_count}
              onViewAll={() => onNavigate?.('produtos')}
            />
          </section>

          <RecentSalesTable
            sales={salesQuery.data}
            isLoading={salesQuery.isLoading}
            isError={salesQuery.isError}
            error={salesQuery.error}
            onViewAll={() => onNavigate?.('historico')}
          />
        </>
      )}
    </div>
  )
}
