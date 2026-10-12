import { Filter, SlidersHorizontal, MoreVertical, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SaleRecord {
  id: string
  client: string
  initials: string
  initialsBg: string
  initialsColor: string
  itemsCount: string
  itemsSummary: string
  totalPrice: string
  paymentType: string
  isPaymentBadge?: boolean
  status: 'Pago' | 'Pendente' | 'Cancelado'
  statusVariant: 'success' | 'warning' | 'destructive'
  datetime: string
}

export function RecentSalesTable() {
  const sales: SaleRecord[] = [
    {
      id: '#10482',
      client: 'Lucas Mendes Ferreira',
      initials: 'LM',
      initialsBg: 'bg-primary/20',
      initialsColor: 'text-primary',
      itemsCount: '3 produtos',
      itemsSummary: '(Fone Pulse X2 + 2)',
      totalPrice: 'R$ 689,70',
      paymentType: 'Pix',
      isPaymentBadge: true,
      status: 'Pago',
      statusVariant: 'success',
      datetime: '14/10 às 17:42',
    },
    {
      id: '#10481',
      client: 'Beatriz Carvalho Ramos',
      initials: 'BC',
      initialsBg: 'bg-cyan-accent/20',
      initialsColor: 'text-cyan-accent',
      itemsCount: '1 produto',
      itemsSummary: '(Teclado ErgoPro)',
      totalPrice: 'R$ 540,00',
      paymentType: 'Cartão de Crédito (3x)',
      isPaymentBadge: false,
      status: 'Pago',
      statusVariant: 'success',
      datetime: '14/10 às 16:15',
    },
    {
      id: '#10480',
      client: 'Guilherme Siqueira Rocha',
      initials: 'GS',
      initialsBg: 'bg-primary/20',
      initialsColor: 'text-primary',
      itemsCount: '4 produtos',
      itemsSummary: '(Hub USB-C + cabos)',
      totalPrice: 'R$ 1.280,40',
      paymentType: 'Boleto Bancário',
      isPaymentBadge: false,
      status: 'Pendente',
      statusVariant: 'warning',
      datetime: '14/10 às 15:08',
    },
    {
      id: '#10479',
      client: 'Mariana Duarte Prado',
      initials: 'MD',
      initialsBg: 'bg-primary/20',
      initialsColor: 'text-primary',
      itemsCount: '1 produto',
      itemsSummary: '(Mouse Precision MX)',
      totalPrice: 'R$ 329,90',
      paymentType: 'Pix',
      isPaymentBadge: true,
      status: 'Pago',
      statusVariant: 'success',
      datetime: '14/10 às 14:30',
    },
    {
      id: '#10478',
      client: 'Thiago Albuquerque Netto',
      initials: 'TA',
      initialsBg: 'bg-destructive/20',
      initialsColor: 'text-destructive',
      itemsCount: '2 produtos',
      itemsSummary: '(Webcam 4K + Mat)',
      totalPrice: 'R$ 899,00',
      paymentType: 'Cartão de Crédito (1x)',
      isPaymentBadge: false,
      status: 'Cancelado',
      statusVariant: 'destructive',
      datetime: '14/10 às 13:12',
    },
    {
      id: '#10477',
      client: 'Camila Fontes Medeiros',
      initials: 'CF',
      initialsBg: 'bg-primary/20',
      initialsColor: 'text-primary',
      itemsCount: '5 produtos',
      itemsSummary: '(Acessórios diversos)',
      totalPrice: 'R$ 412,50',
      paymentType: 'Pix',
      isPaymentBadge: true,
      status: 'Pago',
      statusVariant: 'success',
      datetime: '14/10 às 11:45',
    },
  ]

  return (
    <Card className="rounded-xl bg-surface-2 border-border shadow-md overflow-hidden mb-8">
      {/* Cabeçalho da Tabela */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="font-headline text-lg font-semibold text-text-primary">
            Vendas recentes
          </h2>
          <span className="text-xs text-text-muted">
            Últimas 6 transações processadas
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            className="h-9 px-3 gap-1.5 text-xs text-text-secondary hover:text-text-primary bg-surface-elevated border-border hover:border-border-highlight"
          >
            <Filter className="h-4 w-4" strokeWidth={1.5} />
            <span>Filtrar</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-9 px-3 gap-1.5 text-xs text-text-secondary hover:text-text-primary bg-surface-elevated border-border hover:border-border-highlight"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            <span>Colunas</span>
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="h-11 bg-surface-1 border-b border-border font-mono text-[11px] text-text-muted uppercase tracking-wider select-none">
              <th className="py-3 px-5 font-semibold">Pedido</th>
              <th className="py-3 px-4 font-semibold">Cliente</th>
              <th className="py-3 px-4 font-semibold">Itens</th>
              <th className="py-3 px-4 font-semibold text-right">Valor Total</th>
              <th className="py-3 px-4 font-semibold">Pagamento</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Data &amp; Hora</th>
              <th className="py-3 px-5 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {sales.map((sale) => (
              <tr
                key={sale.id}
                className="h-[60px] hover:bg-surface-elevated/60 transition-colors group"
              >
                {/* Pedido */}
                <td className="py-3 px-5 font-mono text-sm text-primary font-medium">
                  {sale.id}
                </td>

                {/* Cliente */}
                <td className="py-3 px-4 text-text-primary">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${sale.initialsBg} ${sale.initialsColor}`}
                    >
                      {sale.initials}
                    </div>
                    <span className="truncate font-medium">{sale.client}</span>
                  </div>
                </td>

                {/* Itens */}
                <td className="py-3 px-4">
                  <span className="text-text-primary font-medium block">
                    {sale.itemsCount}
                  </span>
                  <span className="text-text-muted truncate block text-[11px]">
                    {sale.itemsSummary}
                  </span>
                </td>

                {/* Valor Total */}
                <td className="py-3 px-4 text-right font-mono font-bold text-text-primary tabular-nums">
                  {sale.totalPrice}
                </td>

                {/* Pagamento */}
                <td className="py-3 px-4">
                  {sale.isPaymentBadge ? (
                    <Badge
                      variant="outline"
                      className="border-cyan-accent/30 text-cyan-accent bg-cyan-accent/10 font-mono text-[11px]"
                    >
                      {sale.paymentType}
                    </Badge>
                  ) : (
                    <span className="text-xs text-text-secondary">
                      {sale.paymentType}
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <Badge
                    variant={sale.statusVariant}
                    className="gap-1.5 font-mono text-[11px] px-2 py-0.5"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        sale.statusVariant === 'success'
                          ? 'bg-status-success'
                          : sale.statusVariant === 'warning'
                          ? 'bg-status-warning'
                          : 'bg-destructive'
                      }`}
                    />
                    {sale.status}
                  </Badge>
                </td>

                {/* Data & Hora */}
                <td className="py-3 px-4 font-mono text-xs text-text-muted tabular-nums">
                  {sale.datetime}
                </td>

                {/* Ações */}
                <td className="py-3 px-5 text-right">
                  <button
                    type="button"
                    aria-label={`Ações do pedido ${sale.id}`}
                    className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rodapé da Tabela */}
      <div className="p-4 px-5 flex items-center justify-between border-t border-border bg-surface-1 text-xs">
        <span className="text-text-muted">
          Mostrando 6 de 1.284 vendas processadas
        </span>
        <button
          type="button"
          className="text-primary hover:underline font-medium flex items-center gap-1 cursor-pointer"
        >
          Ver todas as vendas
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </Card>
  )
}
