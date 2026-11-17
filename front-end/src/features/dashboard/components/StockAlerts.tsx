import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { DashboardLowStock } from '@/lib/api'

interface StockAlertsProps {
  items?: DashboardLowStock[]
  total?: number
  loading?: boolean
  onReplenish?: (sku: string) => void
  onViewAll?: () => void
}

export function StockAlerts({ items = [], total = 0, loading = false, onReplenish, onViewAll }: StockAlertsProps) {
  const alerts = items.slice(0, 5).map((i) => {
    const out = i.stock_quantity <= 0
    return {
      name: i.name,
      sku: i.sku,
      status: out ? 'Sem estoque' : 'Estoque baixo',
      variant: (out ? 'destructive' : 'warning') as 'destructive' | 'warning',
      ratio: `${i.stock_quantity} / mín. ${i.min_stock_quantity}`,
      colorClass: out ? 'text-destructive' : 'text-status-warning',
    }
  })

  return (
    <Card className="p-6 bg-surface-2 border-border shadow-md flex flex-col justify-between">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <h2 className="font-headline text-lg font-semibold text-text-primary">
            Alertas de estoque crítico
          </h2>
          <Badge
            variant="warning"
            className="px-2 py-0.5 text-[11px] font-mono font-semibold"
          >
            {total} {total === 1 ? 'pendência' : 'pendências'}
          </Badge>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          Ver todos
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Lista de Alertas */}
      <div className="divide-y divide-border/50 mt-2">
        {alerts.length === 0 && (
          <p className="py-6 text-center text-sm text-text-muted">
            {loading ? 'Carregando...' : 'Nenhum produto com estoque baixo.'}
          </p>
        )}
        {alerts.map((item) => (
          <div
            key={item.sku}
            className="py-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="text-sm font-medium text-text-primary truncate">
                {item.name}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[11px] text-text-muted">
                  {item.sku}
                </span>
                <Badge
                  variant={item.variant}
                  className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
                >
                  {item.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`font-mono text-xs font-bold tabular-nums ${item.colorClass}`}
              >
                {item.ratio}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onReplenish?.(item.sku)}
                className="h-8 px-3 text-xs bg-surface-elevated hover:border-primary hover:text-primary transition-all cursor-pointer"
              >
                Repor
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
