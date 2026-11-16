import { Card } from '@/components/ui/card'
import type { DashboardCategoryStock } from '@/lib/api'

interface CategoryDonutProps {
  categories: DashboardCategoryStock[]
}

const COLORS = ['#2F6BFF', '#38BDF8', '#B4C5FF', '#5D74BC', '#7C8BA8']
const CIRCUMFERENCE = 2 * Math.PI * 38

export function CategoryDonut({ categories }: CategoryDonutProps) {
  const totalStock = categories.reduce((sum, item) => sum + item.stock_units, 0)
  const visible = categories.slice(0, 4)
  const rest = categories.slice(4)
  if (rest.length) {
    visible.push({
      category: 'Outros',
      products_count: rest.reduce((sum, item) => sum + item.products_count, 0),
      stock_units: rest.reduce((sum, item) => sum + item.stock_units, 0),
    })
  }

  const segments = visible.map((item, index) => {
    const length = totalStock ? (item.stock_units / totalStock) * CIRCUMFERENCE : 0
    const offset = visible
      .slice(0, index)
      .reduce(
        (sum, previous) => sum + (totalStock ? (previous.stock_units / totalStock) * CIRCUMFERENCE : 0),
        0
      )
    return { ...item, color: COLORS[index % COLORS.length], length, offset }
  })

  return (
    <Card className="p-6 bg-surface-2 border-border shadow-md flex flex-col justify-between">
      <div className="pb-3 border-b border-border/60">
        <h2 className="font-headline text-lg font-semibold text-text-primary">
          Estoque por categoria
        </h2>
        <span className="text-xs text-text-muted">
          Distribuição do estoque cadastrado
        </span>
      </div>

      <div className="relative flex items-center justify-center my-4">
        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100" role="img" aria-label="Estoque por categoria">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#141C30" strokeWidth="10" />
          {segments.map((segment) => (
            <circle
              key={segment.category}
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={segment.color}
              strokeWidth="10"
              strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
              strokeDashoffset={-segment.offset}
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-headline text-2xl font-bold text-text-primary leading-none">
            {totalStock.toLocaleString('pt-BR')}
          </span>
          <span className="text-xs text-text-muted mt-0.5">unidades</span>
        </div>
      </div>

      <div className="space-y-2.5 pt-2 border-t border-border/60 text-xs">
        {segments.length ? segments.map((segment) => {
          const percentage = totalStock ? Math.round((segment.stock_units / totalStock) * 100) : 0
          return (
            <div key={segment.category} className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate text-text-primary font-medium">{segment.category}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-text-muted tabular-nums">
                  {segment.products_count} produto(s)
                </span>
                <span className="font-mono font-bold text-text-primary tabular-nums">
                  {percentage}%
                </span>
              </div>
            </div>
          )
        }) : (
          <p className="py-2 text-center text-text-muted">Nenhum produto cadastrado.</p>
        )}
      </div>
    </Card>
  )
}
