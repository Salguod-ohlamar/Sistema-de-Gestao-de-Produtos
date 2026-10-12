import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface StockAlertsProps {
  onReplenish?: (sku: string) => void
}

export function StockAlerts({ onReplenish }: StockAlertsProps) {
  const alerts = [
    {
      name: 'Webcam 4K UltraStream',
      sku: 'SKU: CAM-4K-PRO',
      status: 'Sem estoque',
      variant: 'destructive' as const,
      ratio: '0 / 25 un.',
      colorClass: 'text-destructive',
    },
    {
      name: 'Cabo Thunderbolt 4 2m',
      sku: 'SKU: CBL-TB4-2M',
      status: 'Estoque baixo',
      variant: 'warning' as const,
      ratio: '2 / 30 un.',
      colorClass: 'text-status-warning',
    },
    {
      name: 'Microfone Condensador Wave',
      sku: 'SKU: MIC-WAV-USB',
      status: 'Estoque baixo',
      variant: 'warning' as const,
      ratio: '3 / 20 un.',
      colorClass: 'text-status-warning',
    },
    {
      name: 'Carregador GaN 65W Rápido',
      sku: 'SKU: CHG-GAN-65W',
      status: 'Estoque baixo',
      variant: 'warning' as const,
      ratio: '4 / 40 un.',
      colorClass: 'text-status-warning',
    },
    {
      name: 'Mousepad Desk Mat 90x40',
      sku: 'SKU: MAT-9040-NVY',
      status: 'Sem estoque',
      variant: 'destructive' as const,
      ratio: '0 / 15 un.',
      colorClass: 'text-destructive',
    },
  ]

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
            5 pendências
          </Badge>
        </div>
        <button
          type="button"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          Ver todos
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Lista de Alertas */}
      <div className="divide-y divide-border/50 mt-2">
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
