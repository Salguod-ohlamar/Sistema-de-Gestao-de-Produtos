import { Card } from '@/components/ui/card'
import type { DashboardDailySale } from '@/lib/api'
import { formatCurrency } from '@/lib/utils/formatters'
import { dateLabel, fillDailySales } from '../dashboardFormat'

interface SalesChartProps {
  sales: DashboardDailySale[]
  from: string
  to: string
}

const compactCurrency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 0,
})

// Componente React responsável por renderizar sales chart.
export function SalesChart({ sales, from, to }: SalesChartProps) {
  const days = fillDailySales(sales, from, to)
  const maxRevenue = Math.max(...days.map((day) => Number(day.revenue)), 0)
  const scaleMax = maxRevenue || 1
  const points = days.map((day, index) => ({
    day,
    x: days.length === 1 ? 340 : (index / (days.length - 1)) * 680,
    y: 205 - (Number(day.revenue) / scaleMax) * 180,
  }))
  const line = points.map((point) => `${point.x},${point.y}`).join(' ')
  const area = points.length
    ? `M ${points[0].x} 210 L ${points.map((point) => `${point.x} ${point.y}`).join(' L ')} L ${points[points.length - 1].x} 210 Z`
    : ''
  const labelCount = Math.min(days.length, 7)
  const labelIndices = Array.from({ length: labelCount }, (_, index) =>
    labelCount === 1 ? 0 : Math.round((index * (days.length - 1)) / (labelCount - 1))
  )

  return (
    <Card className="p-6 bg-surface-2 border-border shadow-md flex flex-col justify-between">
      <div className="pb-4 border-b border-border/60">
        <h2 className="font-headline text-lg font-semibold text-text-primary">
          Vendas no período
        </h2>
        <span className="text-xs text-text-muted">
          Receita diária de vendas concluídas
        </span>
      </div>

      <div className="relative w-full h-[250px] mt-4 flex">
        <div className="flex flex-col justify-between items-end pr-3 pb-6 font-mono text-xs text-text-muted select-none w-16 shrink-0 tabular-nums">
          {[1, 0.75, 0.5, 0.25, 0].map((fraction) => (
            <span key={fraction}>{compactCurrency.format(scaleMax * fraction)}</span>
          ))}
        </div>

        <div className="relative flex-1 h-full pb-6">
          <svg
            className="w-full h-[210px] overflow-visible"
            preserveAspectRatio="none"
            role="img"
            aria-label={`Receita diária entre ${dateLabel(from)} e ${dateLabel(to)}`}
            viewBox="0 0 680 210"
          >
            <defs>
              <linearGradient id="salesAreaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 52, 105, 157, 210].map((y) => (
              <line
                key={y}
                x1="0"
                x2="680"
                y1={y}
                y2={y}
                stroke="#1B2540"
                strokeDasharray={y === 210 ? undefined : '3,4'}
              />
            ))}
            {area && <path d={area} fill="url(#salesAreaGradient)" />}
            {points.length > 1 && (
              <polyline
                points={line}
                fill="none"
                stroke="#2F6BFF"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
            )}
            {points.map((point) => (
              <circle
                key={point.day.date}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#2F6BFF"
              >
                <title>
                  {`${dateLabel(point.day.date)}: ${formatCurrency(Number(point.day.revenue))} · ${point.day.sales_count} venda(s)`}
                </title>
              </circle>
            ))}
          </svg>

          <div className="absolute bottom-0 left-0 right-0 flex justify-between font-mono text-xs text-text-muted pt-2 border-t border-border">
            {labelIndices.map((index) => (
              <span key={days[index].date}>{dateLabel(days[index].date)}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
