import { useMemo, useState } from 'react'
import { AlertTriangle, Check, Receipt, Search, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ApiError, type SaleSummary } from '@/lib/api'
import { formatCurrency } from '@/lib/utils/formatters'
import { useSalesHistory } from '../hooks/useSales'

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

function isToday(iso: string): boolean {
  return new Date(iso).toDateString() === new Date().toDateString()
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-1 flex-col gap-1.5 rounded-[14px] border p-5 ${highlight ? 'border-border-highlight bg-surface-elevated' : 'border-border bg-surface-2'}`}>
      <span className="text-[13px] font-medium text-text-secondary">{label}</span>
      <span className="font-mono text-[28px] font-medium leading-tight text-text-primary">{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: SaleSummary['status'] }) {
  return status === 'completed' ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-status-success/12 px-2.5 py-1 text-xs font-semibold text-status-success">
      <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" /> Concluída
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-status-error/12 px-2.5 py-1 text-xs font-semibold text-status-error">
      <XCircle className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" /> Cancelada
    </span>
  )
}

export function SalesHistoryView() {
  const { data: sales, isLoading, isError, error, refetch } = useSalesHistory()
  const [search, setSearch] = useState('')

  const stats = useMemo(() => {
    const today = (sales ?? []).filter((s) => s.status === 'completed' && isToday(s.created_at))
    const revenue = today.reduce((sum, s) => sum + Math.round(Number(s.total) * 100), 0) / 100
    return { count: today.length, revenue, average: today.length ? revenue / today.length : 0 }
  }, [sales])

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase().replace(/^venda-/, '')
    return (sales ?? []).filter((s) => !term || String(s.id).includes(term))
  }, [sales, search])

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-[28px] font-bold leading-tight text-text-primary">Histórico de vendas</h1>
          <p className="text-[13px] text-text-secondary">Acompanhe o que foi vendido. Os totais abaixo são de hoje.</p>
        </div>
        <div className="relative w-[280px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
          <Input aria-label="Buscar código da venda" placeholder="Buscar código da venda" value={search} onChange={(e) => setSearch(e.target.value)} className="h-11 pl-10" />
        </div>
      </div>

      <div className="flex gap-4">
        <StatCard label="Vendas hoje" value={String(stats.count)} />
        <StatCard label="Faturamento hoje" value={formatCurrency(stats.revenue)} highlight />
        <StatCard label="Ticket médio" value={formatCurrency(stats.average)} />
      </div>

      <div className="overflow-hidden rounded-[14px] border border-border bg-surface-2">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4" aria-busy="true">
            {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : isError ? (
          <div role="alert" className="flex flex-col items-center gap-3 p-10 text-center">
            <AlertTriangle className="h-6 w-6 text-status-error" aria-hidden="true" />
            <p className="text-sm text-text-primary">
              {error instanceof ApiError ? error.message : 'Não foi possível carregar o histórico.'}
            </p>
            <Button variant="outline" onClick={() => void refetch()}>Tentar novamente</Button>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <Receipt className="h-7 w-7 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm text-text-secondary">
              {sales?.length ? 'Nenhuma venda encontrada para essa busca.' : 'Nenhuma venda registrada ainda.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Data e hora</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead className="text-right">Itens</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-[13px]">VENDA-{s.id}</TableCell>
                  <TableCell className="font-mono text-[13px]">{dateTimeFormatter.format(new Date(s.created_at))}</TableCell>
                  <TableCell>{s.operator_name}</TableCell>
                  <TableCell className="text-right font-mono text-[13px]">{s.items_count}</TableCell>
                  <TableCell className="text-right font-mono text-[13px] font-medium">{formatCurrency(Number(s.total))}</TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
