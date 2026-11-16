import { ArrowRight, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { DashboardTopProduct } from '@/lib/api'
import { formatCurrency } from '@/lib/utils/formatters'

interface TopProductsProps {
  products: DashboardTopProduct[]
  onViewReport?: () => void
}

export function TopProducts({ products, onViewReport }: TopProductsProps) {
  const maxQuantity = Math.max(...products.map((product) => product.quantity_sold), 0)

  return (
    <Card className="p-6 bg-surface-2 border-border shadow-md flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <h2 className="font-headline text-lg font-semibold text-text-primary">
            Produtos mais vendidos
          </h2>
          <span className="text-xs text-text-muted">Ordenados por unidades vendidas no período</span>
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

      <div className="divide-y divide-border/50 mt-2">
        {products.length ? products.map((product) => (
          <div
            key={product.product_id}
            className="py-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">{product.name}</div>
                <div className="font-mono text-[11px] text-text-muted">SKU: {product.sku}</div>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 w-36">
              <span className="font-mono text-xs font-bold text-text-primary tabular-nums">
                {product.quantity_sold} un. · {formatCurrency(Number(product.revenue))}
              </span>
              <div className="w-full bg-surface-1 rounded-full h-1.5 mt-1.5 overflow-hidden border border-border/30">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${maxQuantity ? (product.quantity_sold / maxQuantity) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        )) : (
          <p className="py-8 text-center text-sm text-text-muted">
            Nenhuma venda concluída neste período.
          </p>
        )}
      </div>
    </Card>
  )
}
