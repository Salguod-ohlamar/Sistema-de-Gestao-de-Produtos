import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ApiError, type SaleSummary } from '@/lib/api'
import { formatCurrency } from '@/lib/utils/formatters'

interface RecentSalesTableProps {
  sales?: SaleSummary[]
  isLoading?: boolean
  isError?: boolean
  error?: unknown
  onViewAll?: () => void
}

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

// Componente React responsável por renderizar recent sales table.
export function RecentSalesTable({
  sales = [],
  isLoading = false,
  isError = false,
  error,
  onViewAll,
}: RecentSalesTableProps) {
  const recentSales = sales.slice(0, 6)

  return (
    <Card className="rounded-xl bg-surface-2 border-border shadow-md overflow-hidden mb-8">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
        <div>
          <h2 className="font-headline text-lg font-semibold text-text-primary">Vendas recentes</h2>
          <span className="text-xs text-text-muted">Últimas vendas registradas para a empresa</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-text-muted" role="status">Carregando vendas...</p>
        ) : isError ? (
          <p className="p-8 text-center text-sm text-status-error" role="alert">
            {error instanceof ApiError ? error.message : 'Não foi possível carregar as vendas recentes.'}
          </p>
        ) : recentSales.length === 0 ? (
          <p className="p-8 text-center text-sm text-text-muted">Nenhuma venda registrada.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-11 bg-surface-1 border-b border-border font-mono text-[11px] text-text-muted uppercase tracking-wider">
                <th className="py-3 px-5 font-semibold">Venda</th>
                <th className="py-3 px-4 font-semibold">Data e hora</th>
                <th className="py-3 px-4 font-semibold">Operador</th>
                <th className="py-3 px-4 font-semibold text-right">Itens</th>
                <th className="py-3 px-4 font-semibold text-right">Total</th>
                <th className="py-3 px-5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {recentSales.map((sale) => (
                <tr key={sale.id} className="h-[60px] hover:bg-surface-elevated/60 transition-colors">
                  <td className="py-3 px-5 font-mono text-primary font-medium">VENDA-{sale.id}</td>
                  <td className="py-3 px-4 font-mono text-xs text-text-muted tabular-nums">
                    {dateTimeFormatter.format(new Date(sale.created_at))}
                  </td>
                  <td className="py-3 px-4 text-text-primary">{sale.operator_name}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">{sale.items_count}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-text-primary tabular-nums">
                    {formatCurrency(Number(sale.total))}
                  </td>
                  <td className="py-3 px-5">
                    <Badge
                      variant={sale.status === 'completed' ? 'success' : 'destructive'}
                      className="font-mono text-[11px]"
                    >
                      {sale.status === 'completed' ? 'Concluída' : 'Cancelada'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 px-5 flex items-center justify-between border-t border-border bg-surface-1 text-xs">
        <span className="text-text-muted">Mostrando {recentSales.length} venda(s) recente(s)</span>
        <Button variant="link" onClick={onViewAll} className="h-auto p-0 text-primary">
          Ver histórico de vendas
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  )
}
