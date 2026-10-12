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
import { SalesChart } from './SalesChart'
import { CategoryDonut } from './CategoryDonut'
import { TopProducts } from './TopProducts'
import { StockAlerts } from './StockAlerts'
import { RecentSalesTable } from './RecentSalesTable'
import { toast } from 'sonner'

export function DashboardView() {
  const [period, setPeriod] = useState<'7' | '30' | '90' | 'custom'>('30')

  const handleExport = () => {
    toast.success('Relatório executivo exportado com sucesso!')
  }

  const handleReplenish = (sku: string) => {
    toast.info(`Ordem de reposição gerada para o item: ${sku}`)
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

      {/* Linha 1 — 4 Cards de KPI */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Faturamento Total"
          value="R$ 148.920,50"
          delta="+12,4%"
          isPositive={true}
          icon={DollarSign}
          sparklineVariant="blue"
        />
        <KpiCard
          title="Vendas Realizadas"
          value="1.284"
          delta="+8,1%"
          isPositive={true}
          icon={ShoppingBag}
          sparklineVariant="blue"
        />
        <KpiCard
          title="Ticket Médio"
          value="R$ 115,98"
          delta="-2,3%"
          isPositive={false}
          icon={Receipt}
          sparklineVariant="cyan"
        />
        <KpiCard
          title="Itens em Estoque Baixo"
          value="17"
          delta=""
          attentionText="Atenção"
          deltaLabel="Requer reposição"
          icon={AlertTriangle}
          sparklineVariant="amber"
          isWarning={true}
        />
      </section>

      {/* Linha 2 — Gráficos Analíticos */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SalesChart />
        </div>
        <div className="lg:col-span-4">
          <CategoryDonut />
        </div>
      </section>

      {/* Linha 3 — Listas Operacionais */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts />
        <StockAlerts onReplenish={handleReplenish} />
      </section>

      {/* Linha 4 — Tabela de Vendas Recentes */}
      <section>
        <RecentSalesTable />
      </section>
    </div>
  )
}
