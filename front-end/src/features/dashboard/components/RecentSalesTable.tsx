import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSalesHistory } from '@/features/sales/hooks/useSales'
import { formatBrl } from '@/features/products/productMapper'

interface RecentSalesTableProps {
  onViewAll?: () => void
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' })
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
  return `${date} às ${time}`
}

export function RecentSalesTable({ onViewAll }: RecentSalesTableProps = {}) {
  const { data, isLoading, isError } = useSalesHistory()
  const sales = (data ?? []).slice(0, 6)

  return (
    <Card className="rounded-xl bg-surface-2 border-border shadow-md overflow-hidden mb-8">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="font-headline text-lg font-semibold text-text-primary">Vendas recentes</h2>
          <span className="text-xs text-text-muted">Últimas vendas registradas</span>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          Ver histórico completo
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="h-11 bg-surface-1 border-b border-border font-mono text-[11px] text-text-muted uppercase tracking-wider select-none">
              <th className="py-3 px-5 font-semibold">Venda</th>
              <th className="py-3 px-4 font-semibold">Operador</th>
              <th className="py-3 px-4 font-semibold">Itens</th>
              <th className="py-3 px-4 font-semibold text-right">Valor total</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-5 font-semibold">Data e hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {isLoading && (
              <tr><td colSpan={6} className="py-10 text-center text-sm text-text-muted">Carregando vendas...</td></tr>
            )}
            {isError && (
              <tr><td colSpan={6} className="py-10 text-center text-sm text-destructive">Não foi possível carregar as vendas.</td></tr>
            )}
            {!isLoading && !isError && sales.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-sm text-text-muted">Nenhuma venda registrada ainda.</td></tr>
            )}
            {sales.map((sale) => (
              <tr key={sale.id} className="h-[60px] hover:bg-surface-elevated/60 transition-colors">
                <td className="py-3 px-5 font-mono text-sm text-primary font-medium">#{sale.id}</td>
                <td className="py-3 px-4 text-text-primary">{sale.operator_name}</td>
                <td className="py-3 px-4 text-text-secondary">
                  {sale.items_count} {sale.items_count === 1 ? 'item' : 'itens'}
                </td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-text-primary tabular-nums">
                  {formatBrl(sale.total)}
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={sale.status === 'completed' ? 'success' : 'destructive'}
                    className="font-mono text-xs px-2.5 py-0.5"
                  >
                    {sale.status === 'completed' ? 'Concluída' : 'Cancelada'}
                  </Badge>
                </td>
                <td className="py-3 px-5 font-mono text-xs text-text-muted">{formatDateTime(sale.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
