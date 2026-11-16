import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { DashboardLowStockProduct } from '@/lib/api'

interface StockAlertsProps {
  products: DashboardLowStockProduct[]
  totalCount: number
  onViewAll?: () => void
}

export function StockAlerts({ products, totalCount, onViewAll }: StockAlertsProps) {
  const visibleProducts = products.slice(0, 5)

  return (
    <Card className="p-6 bg-surface-2 border-border shadow-md flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <h2 className="font-headline text-lg font-semibold text-text-primary">
            Alertas de estoque crítico
          </h2>
          <Badge
            variant={totalCount ? 'warning' : 'success'}
            className="px-2 py-0.5 text-[11px] font-mono font-semibold"
          >
            {totalCount} pendência(s)
          </Badge>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          Ver produtos
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-border/50 mt-2">
        {visibleProducts.length ? visibleProducts.map((product) => {
          const outOfStock = product.stock_quantity <= 0
          return (
            <div
              key={product.product_id}
              className="py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">{product.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[11px] text-text-muted">SKU: {product.sku}</span>
                  <Badge
                    variant={outOfStock ? 'destructive' : 'warning'}
                    className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
                  >
                    {outOfStock ? 'Sem estoque' : 'Estoque baixo'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`font-mono text-xs font-bold tabular-nums ${outOfStock ? 'text-destructive' : 'text-status-warning'}`}>
                  {product.stock_quantity} / {product.min_stock_quantity} un.
                </span>
              </div>
            </div>
          )
        }) : (
          <p className="py-8 text-center text-sm text-text-muted">
            Nenhum produto no estoque mínimo.
          </p>
        )}
      </div>

      {totalCount > visibleProducts.length && (
        <p className="pt-2 text-right text-xs text-text-muted">
          Exibindo {visibleProducts.length} de {totalCount} alertas
        </p>
      )}
    </Card>
  )
}
