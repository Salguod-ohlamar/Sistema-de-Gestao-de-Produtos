import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface KpiCardProps {
  title: string
  value: string
  delta: string
  isPositive?: boolean
  deltaLabel?: string
  icon: LucideIcon
  sparklineVariant?: 'blue' | 'cyan' | 'amber'
  isWarning?: boolean
  attentionText?: string
}

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
          ) : (
            <Badge
              variant={isPositive ? 'success' : 'destructive'}
              className="px-1.5 py-0.5 text-[10px] font-mono font-bold"
            >
              {delta}
            </Badge>
          )}
          <span className="text-xs text-text-muted">{deltaLabel}</span>
        </div>
      </div>

      {/* Mini Sparkline SVG no fundo */}
      <svg
        className="absolute right-2 bottom-1.5 w-24 h-10 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity"
        fill="none"
        viewBox="0 0 100 40"
      >
        <defs>
          <linearGradient
            id={`grad-${sparklineVariant}`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={
                sparklineVariant === 'cyan'
                  ? '#38BDF8'
                  : sparklineVariant === 'amber'
                  ? '#F5B544'
                  : '#2F6BFF'
              }
            />
            <stop
              offset="100%"
              stopColor={
                sparklineVariant === 'cyan'
                  ? '#38BDF8'
                  : sparklineVariant === 'amber'
                  ? '#F5B544'
                  : '#2F6BFF'
              }
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        {isPositive ? (
          <>
            <path
              d="M0 32 Q 25 30, 45 22 T 75 14 T 100 4"
              stroke={
                sparklineVariant === 'cyan'
                  ? '#38BDF8'
                  : sparklineVariant === 'amber'
                  ? '#F5B544'
                  : '#2F6BFF'
              }
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M0 32 Q 25 30, 45 22 T 75 14 T 100 4 L 100 40 L 0 40 Z"
              fill={`url(#grad-${sparklineVariant})`}
              opacity="0.35"
            />
          </>
        ) : (
          <path
            d="M0 10 Q 30 16, 50 18 T 80 28 T 100 32"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </Card>
  )
}
