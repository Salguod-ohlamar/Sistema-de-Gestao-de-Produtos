import { useState } from 'react'
import {
  DollarSign,
  ShoppingBag,
  Receipt,
  AlertTriangle,
  Download,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { KpiCard } from './KpiCard'
import { TopProducts } from './TopProducts'
import { StockAlerts } from './StockAlerts'
import { RecentSalesTable } from './RecentSalesTable'
import { toast } from 'sonner'
import { useDashboard } from '../hooks/useDashboard'
import { formatBrl } from '@/features/products/productMapper'

interface DashboardViewProps {
  onNavigate?: (view: string) => void
}

export function DashboardView({ onNavigate }: DashboardViewProps = {}) {
  const [period, setPeriod] = useState<'7' | '30' | '90' | 'custom'>('30')

  const days = period === '7' ? 7 : period === '90' ? 90 : 30
  const { data, isLoading, isError, error } = useDashboard(days)
  const summary = data?.summary
  const dash = (v: string | undefined) => (isLoading || !v ? '—' : v)

  const handleExport = () => {
    toast.info('Exportação de relatório ainda não está disponível.')
  }

  const handleReplenish = () => {
    toast.info('Para repor, ajuste a quantidade do produto na tela Produtos.')
  }

  return (
    <div className="w-full max-w-[1140px] mx-auto p-8 flex flex-col gap-6">
      {/* Cabeçalho da Página */}
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
              Cockpit Ativo
            </Badge>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Resumo executivo de vendas, inventário e throughput logístico
          </p>
        </div>

        {/* Controles de Período e Exportação */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          {/* Segmented Control */}
          <div className="flex items-center p-1 rounded-lg bg-surface-1 border border-border shadow-inner">
            <button
              type="button"
              onClick={() => setPeriod('7')}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                period === '7'
                  ? 'bg-surface-elevated border border-border-highlight text-text-primary font-semibold shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              7 dias
            </button>
            <button
              type="button"
              onClick={() => setPeriod('30')}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                period === '30'
                  ? 'bg-surface-elevated border border-border-highlight text-text-primary font-semibold shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              30 dias
            </button>
            <button
              type="button"
              onClick={() => setPeriod('90')}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                period === '90'
                  ? 'bg-surface-elevated border border-border-highlight text-text-primary font-semibold shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              90 dias
            </button>
            <button
              type="button"
              hidden
              onClick={() => setPeriod('custom')}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                period === 'custom'
                  ? 'bg-surface-elevated border border-border-highlight text-text-primary font-semibold shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Personalizado
            </button>
          </div>

          {/* Botão Secundário Exportação */}
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

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : 'Não foi possível carregar o dashboard.'}
        </p>
      )}

      {/* Linha 1 — 4 Cards de KPI */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Faturamento Total"
          value={dash(summary && formatBrl(summary.revenue))}
          delta=""
          deltaLabel="no período selecionado"
          isPositive={true}
          icon={DollarSign}
          sparklineVariant="blue"
        />
        <KpiCard
          title="Vendas Realizadas"
          value={dash(summary && String(summary.sales_count))}
          delta=""
          deltaLabel="no período selecionado"
          isPositive={true}
          icon={ShoppingBag}
          sparklineVariant="blue"
        />
        <KpiCard
          title="Ticket Médio"
          value={dash(summary && formatBrl(summary.average_ticket))}
          delta=""
          deltaLabel="no período selecionado"
          isPositive={true}
          icon={Receipt}
          sparklineVariant="cyan"
        />
        <KpiCard
          title="Itens em Estoque Baixo"
          value={dash(summary && String(summary.low_stock_count))}
          delta=""
          attentionText="Atenção"
          deltaLabel="Requer reposição"
          icon={AlertTriangle}
          sparklineVariant="amber"
          isWarning={true}
        />
      </section>

      {/* Linha 3 — Listas Operacionais */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts items={data?.top_products} loading={isLoading} onViewReport={() => onNavigate?.('historico')} />
        <StockAlerts items={data?.low_stock} total={summary?.low_stock_count ?? 0} loading={isLoading} onReplenish={handleReplenish} onViewAll={() => onNavigate?.('produtos')} />
      </section>

      {/* Linha 4 — Tabela de Vendas Recentes */}
      <section>
        <RecentSalesTable onViewAll={() => onNavigate?.('historico')} />
      </section>
    </div>
  )
}
