import { MoreVertical } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function CategoryDonut() {
  const categories = [
    {
      name: 'Eletrônicos',
      skus: '3.204 SKUs',
      pct: '38%',
      color: '#2F6BFF',
    },
    {
      name: 'Acessórios',
      skus: '2.276 SKUs',
      pct: '27%',
      color: '#38BDF8',
    },
    {
      name: 'Escritório',
      skus: '1.770 SKUs',
      pct: '21%',
      color: '#B4C5FF',
    },
    {
      name: 'Outros',
      skus: '1.182 SKUs',
      pct: '14%',
      color: '#5D74BC',
    },
  ]

  return (
    <Card className="p-6 bg-surface-2 border-border shadow-md flex flex-col justify-between">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h2 className="font-headline text-lg font-semibold text-text-primary">
            Estoque por categoria
          </h2>
          <span className="text-xs text-text-muted">
            Distribuição de 4 departamentos
          </span>
        </div>
        <button
          type="button"
          aria-label="Mais opções"
          className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
        >
          <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Gráfico Donut SVG */}
      <div className="relative flex items-center justify-center my-4">
        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
          {/* Círculo Base Fundo */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#141C30"
            strokeWidth="10"
          />
          {/* Eletrônicos (38%) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#2F6BFF"
            strokeWidth="10"
            strokeDasharray="90.7 238.7"
            strokeDashoffset="0"
          />
          {/* Acessórios (27%) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="10"
            strokeDasharray="64.4 238.7"
            strokeDashoffset="-90.7"
          />
          {/* Escritório (21%) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#B4C5FF"
            strokeWidth="10"
            strokeDasharray="50.1 238.7"
            strokeDashoffset="-155.1"
          />
          {/* Outros (14%) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#5D74BC"
            strokeWidth="10"
            strokeDasharray="33.4 238.7"
            strokeDashoffset="-205.2"
          />
        </svg>

        {/* Centro Vazado do Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-headline text-2xl font-bold text-text-primary leading-none">
            8.432
          </span>
          <span className="text-xs text-text-muted mt-0.5">itens totais</span>
        </div>
      </div>

      {/* Legenda Detalhada */}
      <div className="space-y-2.5 pt-2 border-t border-border/60 text-xs">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-text-primary font-medium">{cat.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-text-muted tabular-nums">
                {cat.skus}
              </span>
              <span className="font-mono font-bold text-text-primary tabular-nums">
                {cat.pct}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
