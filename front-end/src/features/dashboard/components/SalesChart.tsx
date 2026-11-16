import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function SalesChart() {
  return (
    <Card className="p-6 bg-surface-2 border-border shadow-md flex flex-col justify-between">
      {/* Cabeçalho do Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-border/60">
        <div>
          <h2 className="font-headline text-lg font-semibold text-text-primary">
            Vendas ao longo do tempo
          </h2>
          <span className="text-xs text-text-muted">
            Volume transacionado diário em comparação com o ciclo homólogo
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-primary rounded-full" />
            <span className="text-text-primary font-medium">Receita atual</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-t border-dashed border-cyan-accent" />
            <span className="text-text-muted">Período anterior</span>
          </div>
        </div>
      </div>

      {/* Gráfico Vetorial de Precisão */}
      <div className="relative w-full h-[250px] mt-4 flex">
        {/* Eixo Y Tabular */}
        <div className="flex flex-col justify-between items-end pr-3 pb-6 font-mono text-xs text-text-muted select-none w-14 shrink-0 tabular-nums">
          <span>R$ 8k</span>
          <span>R$ 6k</span>
          <span>R$ 4k</span>
          <span>R$ 2k</span>
          <span>R$ 0</span>
        </div>

        {/* Área de Plotagem SVG */}
        <div className="relative flex-1 h-full pb-6">
          <svg
            className="w-full h-[210px] overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 680 210"
          >
            <defs>
              <linearGradient id="salesAreaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Linhas de Grade Sutis */}
            <line
              x1="0"
              x2="680"
              y1="0"
              y2="0"
              stroke="#1B2540"
              strokeDasharray="3,4"
            />
            <line
              x1="0"
              x2="680"
              y1="52"
              y2="52"
              stroke="#1B2540"
              strokeDasharray="3,4"
            />
            <line
              x1="0"
              x2="680"
              y1="105"
              y2="105"
              stroke="#1B2540"
              strokeDasharray="3,4"
            />
            <line
              x1="0"
              x2="680"
              y1="157"
              y2="157"
              stroke="#1B2540"
              strokeDasharray="3,4"
            />
            <line
              x1="0"
              x2="680"
              y1="210"
              y2="210"
              stroke="#1B2540"
              strokeOpacity="0.8"
            />

            {/* Curva Período Anterior (Linha tracejada ciano) */}
            <path
              d="M 0 160 C 80 170, 140 130, 220 120 C 300 110, 360 140, 440 95 C 520 60, 600 70, 680 50"
              fill="none"
              stroke="#38BDF8"
              strokeDasharray="4,4"
              strokeOpacity="0.65"
              strokeWidth="1.8"
            />

            {/* Área Preenchida com Gradiente Primário */}
            <path
              d="M 0 175 C 90 160, 160 135, 230 110 C 300 85, 340 45, 410 42 C 480 40, 540 85, 600 65 C 640 50, 660 30, 680 20 L 680 210 L 0 210 Z"
              fill="url(#salesAreaGradient)"
            />

            {/* Curva Principal Receita Atual */}
            <path
              d="M 0 175 C 90 160, 160 135, 230 110 C 300 85, 340 45, 410 42 C 480 40, 540 85, 600 65 C 640 50, 660 30, 680 20"
              fill="none"
              stroke="#2F6BFF"
              strokeLinecap="round"
              strokeWidth="2.5"
            />

            {/* Linha Vertical no Ponto de Destaque (14 Out) */}
            <line
              x1="410"
              x2="410"
              y1="0"
              y2="210"
              stroke="#2F6BFF"
              strokeDasharray="3,3"
              strokeOpacity="0.45"
              strokeWidth="1.2"
            />
            <circle
              cx="410"
              cy="42"
              r="7"
              fill="#2F6BFF"
              fillOpacity="0.3"
            />
            <circle
              cx="410"
              cy="42"
              r="4.5"
              fill="#2F6BFF"
              stroke="#EAF0FF"
              strokeWidth="1.5"
            />
          </svg>

          {/* Tooltip Flutuante Ativo */}
          <div className="absolute left-[60%] top-[14px] -translate-x-1/2 p-2.5 rounded-lg bg-surface-elevated border border-primary/50 shadow-2xl flex flex-col gap-1 pointer-events-none z-10">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-text-primary font-semibold">14 de outubro</span>
              <Badge variant="success" className="px-1 py-0.5 text-[10px] font-mono">
                +18% média
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-base text-text-primary">
                R$ 6.420,00
              </span>
              <span className="font-mono text-[11px] text-text-muted">
                52 pedidos
              </span>
            </div>
          </div>

          {/* Eixo X Datas Tabulares */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between font-mono text-xs text-text-muted pt-2 border-t border-border">
            <span>01 out</span>
            <span>05 out</span>
            <span>10 out</span>
            <span className="text-primary font-semibold">14 out</span>
            <span>20 out</span>
            <span>25 out</span>
            <span>30 out</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
