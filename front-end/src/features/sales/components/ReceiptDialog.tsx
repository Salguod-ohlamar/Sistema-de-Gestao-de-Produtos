import { Check, Printer } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils/formatters'
import type { CreatedSale } from '@/lib/api'


interface ReceiptDialogProps {
  sale: CreatedSale | null
  lineNames: Record<number, string>
  operatorName: string
  onClose: () => void
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

function Divider() {
  return <div className="border-t border-dashed border-text-muted/60" />
}

export function ReceiptDialog({ sale, lineNames, operatorName, onClose }: ReceiptDialogProps) {
  const itemsCount = sale?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <Dialog open={sale !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[520px] max-h-[92vh] overflow-y-auto">
        {sale && (
          <>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-[10px] bg-status-success/12 text-status-success flex items-center justify-center">
                <Check className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <DialogTitle className="font-headline text-xl">Venda registrada</DialogTitle>
                <DialogDescription className="text-[13px] text-text-secondary">
                  O estoque foi atualizado.
                </DialogDescription>
              </div>
            </div>

            <div
              id="receipt-paper"
              className="rounded-[10px] bg-paper text-paper-foreground p-6 font-mono text-[13px] leading-5 flex flex-col gap-3.5"
            >
              <div className="text-center flex flex-col gap-0.5">
                <strong className="text-[15px] tracking-wider">COMPROVANTE DE VENDA</strong>
                <span className="text-[11px] text-paper-muted">DOCUMENTO NÃO FISCAL</span>
              </div>
              <Divider />
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between"><span>Venda</span><strong>VENDA-{sale.id}</strong></div>
                <div className="flex justify-between"><span>Data</span><span>{dateFormatter.format(new Date(sale.created_at))}</span></div>
                <div className="flex justify-between"><span>Operador</span><span>{operatorName}</span></div>
              </div>
              <Divider />
              <div className="flex flex-col gap-2.5">
                {sale.items.map((item) => (
                  <div key={item.product_id} className="flex flex-col">
                    <strong className="font-semibold">{lineNames[item.product_id] ?? `Produto ${item.product_id}`}</strong>
                    <div className="flex justify-between text-paper-muted">
                      <span>{item.quantity} x {formatCurrency(Number(item.unit_price))}</span>
                      <span className="text-paper-foreground">{formatCurrency(Number(item.unit_price) * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Divider />
              <div className="flex justify-between"><span>Itens</span><span>{itemsCount}</span></div>
              <div className="flex justify-between items-baseline">
                <strong className="text-[15px]">TOTAL</strong>
                <strong className="text-xl">{formatCurrency(Number(sale.total))}</strong>
              </div>
              <Divider />
              <div className="text-center text-paper-muted">Obrigado pela compra.</div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" size="lg" onClick={onClose}>Nova venda</Button>
              <Button size="lg" onClick={() => window.print()}>
                <Printer className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                Imprimir comprovante
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
