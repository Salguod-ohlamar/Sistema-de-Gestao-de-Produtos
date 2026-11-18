import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface KpiCardProps {
  title: string
  value: string
  delta?: string
  isPositive?: boolean
  deltaLabel?: string
  icon: LucideIcon
  sparklineVariant?: 'blue' | 'cyan' | 'amber'
  isWarning?: boolean
  attentionText?: string
}

// Componente React responsável por renderizar kpi card.
export function KpiCard({
  title,
  value,
  delta,
  isPositive = true,
  deltaLabel = 'vs. período anterior',
  icon: Icon,
  sparklineVariant = 'blue',
  isWarning = false,
  attentionText,
}: KpiCardProps) {
  return (
    <Card
      className={`relative overflow-hidden p-5 flex flex-col justify-between h-[134px] group transition-all duration-200 ${
        isWarning
          ? 'border-status-warning/40 bg-surface-2 hover:border-status-warning/70 shadow-[0_0_20px_rgba(245,181,68,0.06)]'
          : 'bg-surface-2 border-border hover:border-border-highlight'
      }`}
    >
      {/* Topo do Card */}
      <div className="flex items-start justify-between">
        <span
          className={`text-xs uppercase tracking-wider font-medium ${
            isWarning ? 'text-status-warning' : 'text-text-muted'
          }`}
        >
          {title}
        </span>
        <Icon
          className={`h-5 w-5 ${
            isWarning
              ? 'text-status-warning'
              : sparklineVariant === 'cyan'
              ? 'text-cyan-accent'
              : 'text-primary'
          }`}
          strokeWidth={1.5}
        />
      </div>

      {/* Valor e Variação */}
      <div className="z-10">
        <div
          className={`font-headline text-2xl font-bold tracking-tight ${
            isWarning ? 'text-[#FEF3C7]' : 'text-text-primary'
          }`}
        >
          {value}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {attentionText ? (
            <Badge
              variant="warning"
              className="px-1.5 py-0.5 text-[10px] font-mono gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-status-warning animate-pulse" />
              {attentionText}
            </Badge>
          ) : delta ? (
            <Badge
              variant={isPositive ? 'success' : 'destructive'}
              className="px-1.5 py-0.5 text-[10px] font-mono font-bold"
            >
              {delta}
            </Badge>
          ) : null}
          {deltaLabel && <span className="text-xs text-text-muted">{deltaLabel}</span>}
        </div>
      </div>
    </Card>
  )
}
