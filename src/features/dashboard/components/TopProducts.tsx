import {
  Headphones,
  Keyboard,
  Mouse,
  Monitor,
  Cpu,
  ArrowRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'

export function TopProducts() {
  const products = [
    {
      name: 'Fone Bluetooth Pulse X2',
      sku: 'SKU: PLS-X2-BLK',
      units: '312 un.',
      progress: 100,
      icon: Headphones,
      iconColor: 'text-primary',
    },
    {
      name: 'Teclado Mecânico ErgoPro',
      sku: 'SKU: KBD-ERG-99',
      units: '248 un.',
      progress: 80,
      icon: Keyboard,
      iconColor: 'text-cyan-accent',
    },
    {
      name: 'Mouse Sem Fio Precision MX',
      sku: 'SKU: MOU-MX-SIL',
      units: '194 un.',
      progress: 62,
      icon: Mouse,
      iconColor: 'text-primary-hover',
    },
    {
      name: 'Suporte Articulado Dual Vesa',
      sku: 'SKU: SUP-VESA-02',
      units: '142 un.',
      progress: 45,
      icon: Monitor,
      iconColor: 'text-text-muted',
    },
    {
      name: 'Hub USB-C 8 em 1 Pro',
      sku: 'SKU: HUB-8IN1-GRY',
      units: '118 un.',
      progress: 38,
      icon: Cpu,
      iconColor: 'text-cyan-accent',
    },
  ]

  return (
    <Card className="p-6 bg-surface-2 border-border shadow-md flex flex-col justify-between">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <h2 className="font-headline text-lg font-semibold text-text-primary">
            Produtos mais vendidos
          </h2>
          <span className="text-xs text-text-muted">
            Rankeamento por volume expedido
          </span>
        </div>
        <button
          type="button"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          Ver relatório completo
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Lista com Barras de Progresso */}
      <div className="divide-y divide-border/50 mt-2">
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
