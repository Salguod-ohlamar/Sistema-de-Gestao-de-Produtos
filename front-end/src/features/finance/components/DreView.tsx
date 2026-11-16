import { useState, type FormEvent } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError, type Dre, type ExpenseCategory } from '@/lib/api'
import { formatCurrency } from '@/lib/utils/formatters'
import { useCreateExpense, useDeleteExpense, useDre, useExpenses } from '../hooks/useFinance'
import { CATEGORY_LABELS, CATEGORY_OPTIONS, currentMonthRange, formatDateBr, toDateInput } from '../dreFormat'

const selectClass =
  'h-11 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40'

function Line({
  label,
  value,
  kind = 'plain',
  hint,
}: {
  label: string
  value: number
  kind?: 'plain' | 'minus' | 'subtotal' | 'result'
  hint?: string
}) {
  const isTotal = kind === 'subtotal' || kind === 'result'
  const tone =
    kind === 'result' ? (value < 0 ? 'text-status-error' : 'text-status-success') : 'text-text-primary'
  return (
    <div
      className={`flex items-baseline justify-between gap-4 px-5 ${
        isTotal ? 'border-t border-border bg-surface-elevated/60 py-3.5' : 'py-2.5'
      } ${kind === 'result' ? 'py-4' : ''}`}
    >
      <span className={`text-sm ${isTotal ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
        {kind === 'minus' ? '(−) ' : ''}
        {label}
        {hint && <span className="ml-2 font-mono text-xs text-text-muted">{hint}</span>}
      </span>
      <span className={`font-mono ${kind === 'result' ? 'text-xl' : 'text-sm'} ${isTotal ? 'font-semibold' : ''} ${tone}`}>
        {kind === 'minus' ? '−' : ''}
        {formatCurrency(value)}
      </span>
    </div>
  )
}

function DreStatement({ dre }: { dre: Dre }) {
  const n = (v: string) => Number(v)
  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-surface-2">
      <Line label="Receita bruta" value={n(dre.gross_revenue)} hint={`${dre.sales_count} venda(s)`} />
      <Line label="Impostos" value={n(dre.taxes)} kind="minus" hint={`${dre.tax_rate}%`} />
      <Line label="Receita líquida" value={n(dre.net_revenue)} kind="subtotal" />
      <Line label="Custo das mercadorias vendidas" value={n(dre.cmv)} kind="minus" />
      <Line
        label="Lucro bruto"
        value={n(dre.gross_profit)}
        kind="subtotal"
        hint={dre.gross_margin_pct !== null ? `margem ${dre.gross_margin_pct}%` : undefined}
      />
      {dre.expenses.map((e) => (
        <Line key={e.category} label={CATEGORY_LABELS[e.category]} value={n(e.total)} kind="minus" />
      ))}
      {dre.expenses.length === 0 && (
        <div className="px-5 py-2.5 text-sm text-text-muted">Nenhuma despesa lançada no período.</div>
      )}
      <Line label="Resultado do período" value={n(dre.net_result)} kind="result" />
    </div>
  )
}

function ExpensesPanel({ from, to }: { from: string; to: string }) {
  const { data: expenses, isLoading } = useExpenses(from, to)
  const createMutation = useCreateExpense()
  const deleteMutation = useDeleteExpense()
  const [category, setCategory] = useState<ExpenseCategory>('rent')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(toDateInput(new Date()))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const value = Number(amount.replace(',', '.'))
    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Informe um valor maior que zero.')
      return
    }
    createMutation.mutate(
      { category, description: description.trim() || undefined, amount: value, incurred_on: date },
      {
        onSuccess: () => {
          setDescription('')
          setAmount('')
          toast.success('Despesa lançada.')
        },
        onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Não foi possível lançar a despesa.'),
      }
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-headline text-lg font-semibold text-text-primary">Despesas</h2>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 gap-3 rounded-[14px] border border-border bg-surface-2 p-4 md:grid-cols-[180px_1fr_130px_150px_auto]"
      >
        <label className="flex flex-col gap-1.5 text-xs text-text-secondary">
          Categoria
          <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-text-secondary">
          Descrição (opcional)
          <Input value={description} maxLength={255} onChange={(e) => setDescription(e.target.value)} className="h-11" />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-text-secondary">
          Valor (R$)
          <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" className="h-11" />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-text-secondary">
          Data
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11" />
        </label>
        <Button type="submit" disabled={createMutation.isPending} className="h-11 self-end">
          Lançar
        </Button>
      </form>

      <div className="overflow-hidden rounded-[14px] border border-border bg-surface-2">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4"><Skeleton className="h-9" /><Skeleton className="h-9" /></div>
        ) : !expenses?.length ? (
          <p className="p-6 text-center text-sm text-text-muted">Nenhuma despesa neste período.</p>
        ) : (
          <ul className="divide-y divide-border">
            {expenses.map((x) => (
              <li key={x.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-text-primary">{x.description || CATEGORY_LABELS[x.category]}</span>
                  <span className="font-mono text-xs text-text-muted">
                    {CATEGORY_LABELS[x.category]} · {formatDateBr(x.incurred_on)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-text-primary">{formatCurrency(Number(x.amount))}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Excluir despesa"
                    disabled={deleteMutation.isPending}
                    onClick={() =>
                      deleteMutation.mutate(x.id, {
                        onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Não foi possível excluir.'),
                      })
                    }
                    className="text-text-muted hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export function DreView() {
  const initial = currentMonthRange()
  const [from, setFrom] = useState(initial.from)
  const [to, setTo] = useState(initial.to)
  const [taxInput, setTaxInput] = useState('0')

  const taxRate = Math.min(100, Math.max(0, Number(taxInput.replace(',', '.')) || 0))
  const rangeValid = from !== '' && to !== '' && from <= to
  const { data: dre, isLoading, isError, error, refetch } = useDre({ from, to, taxRate })

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <h1 className="font-headline text-[28px] font-bold leading-tight text-text-primary">DRE</h1>
        <p className="text-[13px] text-text-secondary">
          Demonstração do resultado do período, com as vendas concluídas e as despesas lançadas.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-[14px] border border-border bg-surface-2 p-4">
        <label className="flex flex-col gap-1.5 text-xs text-text-secondary">
          De
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-11 w-[170px]" />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-text-secondary">
          Até
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-11 w-[170px]" />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-text-secondary">
          Alíquota de impostos (%)
          <Input inputMode="decimal" value={taxInput} onChange={(e) => setTaxInput(e.target.value)} className="h-11 w-[170px]" />
        </label>
        {!rangeValid && <span className="pb-3 text-xs text-status-error">A data inicial deve ser anterior à final.</span>}
      </div>

      {dre && dre.warnings.length > 0 && (
        <div role="status" className="flex items-start gap-2.5 rounded-[14px] border border-status-warning/40 bg-status-warning/10 p-4 text-sm text-text-primary">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-warning" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            {dre.warnings.map((w) => <span key={w}>{w}</span>)}
          </div>
        </div>
      )}

      {!rangeValid ? null : isLoading ? (
        <div className="flex flex-col gap-2" aria-busy="true">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-10" />)}</div>
      ) : isError ? (
        <div role="alert" className="flex flex-col items-center gap-3 rounded-[14px] border border-border bg-surface-2 p-10 text-center">
          <AlertTriangle className="h-6 w-6 text-status-error" aria-hidden="true" />
          <p className="text-sm text-text-primary">{error instanceof ApiError ? error.message : 'Não foi possível calcular o DRE.'}</p>
          <Button variant="outline" onClick={() => void refetch()}>Tentar novamente</Button>
        </div>
      ) : dre ? (
        <DreStatement dre={dre} />
      ) : null}

      {rangeValid && <ExpensesPanel from={from} to={to} />}
    </div>
  )
}
