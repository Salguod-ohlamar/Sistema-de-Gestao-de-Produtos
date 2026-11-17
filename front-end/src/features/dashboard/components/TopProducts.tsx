import { Package, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { DashboardTopProduct } from '@/lib/api'

interface TopProductsProps {
  items?: DashboardTopProduct[]
  loading?: boolean
  onViewReport?: () => void
}

export function TopProducts({ items = [], loading = false, onViewReport }: TopProductsProps = {}) {
  const max = Math.max(1, ...items.map((i) => i.quantity_sold))
  const products = items.map((i) => ({
    name: i.name,
    sku: `SKU: ${i.sku}`,
    units: `${i.quantity_sold} un.`,
    progress: Math.round((i.quantity_sold / max) * 100),
    icon: Package,
    iconColor: 'text-primary',
  }))

  return (
    <Card className="p-6 bg-surface-2 border-border shadow-md flex flex-col justify-between">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <h2 className="font-headline text-lg font-semibold text-text-primary">
            Produtos mais vendidos
          </h2>
          <span className="text-xs text-text-muted">
            Ranking por unidades vendidas no período
          </span>
        </div>
        <button
          type="button"
          onClick={onViewReport}
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          Ver relatório completo
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Lista com Barras de Progresso */}
      <div className="divide-y divide-border/50 mt-2">
        {products.length === 0 && (
          <p className="py-6 text-center text-sm text-text-muted">
            {loading ? 'Carregando...' : 'Nenhuma venda no período.'}
          </p>
        )}
        {products.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.sku}
              className="py-3 flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                  <Icon className={`h-5 w-5 ${item.iconColor}`} strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {item.name}
                  </div>
                  <div className="font-mono text-[11px] text-text-muted">
                    {item.sku}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 w-36">
                <span className="font-mono text-xs font-bold text-text-primary tabular-nums">
                  {item.units}
                </span>
                <div className="w-full bg-surface-1 rounded-full h-1.5 mt-1.5 overflow-hidden border border-border/30">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
