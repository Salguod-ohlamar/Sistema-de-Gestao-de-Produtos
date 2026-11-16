import {
  SlidersHorizontal,
  Copy,
  Edit,
  Trash2,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils/formatters'
import type { ApiProduct } from '@/lib/api'

interface ProductDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  product?: ApiProduct | null
}

export function ProductDetailDrawer({
  open,
  onOpenChange,
  onEdit,
  onDuplicate,
  onDelete,
  product,
}: ProductDetailDrawerProps) {
  const stock = Number(product?.stock_quantity ?? 0)
  const minStock = Number(product?.min_stock_quantity ?? 0)
  const status = stock === 0 ? 'Esgotado' : stock <= minStock ? 'Estoque baixo' : 'Em estoque'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[420px] bg-surface-2 border-l border-border p-0 flex flex-col justify-between overflow-hidden shadow-2xl"
      >
        {/* Header do Drawer */}
        <SheetHeader className="h-16 px-6 bg-surface-1 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <SheetTitle className="font-headline text-base font-bold text-text-primary">
              Detalhes do produto
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Conteúdo com Scroll Suave */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Imagem Hero do Produto (200px) */}
          <div className="relative w-full h-48 rounded-xl bg-surface-1 overflow-hidden group border border-border">
            {product?.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-muted">
                Sem imagem cadastrada
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent opacity-80" />
          </div>

          {/* Título & Metadados */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-headline text-lg font-bold text-text-primary leading-tight">
                {product?.name ?? 'Produto'}
              </h3>
              <Badge
                variant={status === 'Em estoque' ? 'success' : status === 'Estoque baixo' ? 'warning' : 'destructive'}
                className="gap-1.5 font-mono text-xs px-2.5 py-0.5 shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-text-muted">SKU: {product?.sku ?? '—'}</span>
              <span className="text-text-muted">•</span>
              <span className="text-cyan-accent font-medium">
                {product?.category ?? 'Sem categoria'}
              </span>
            </div>
          </div>

          {/* Bloco de Métricas Financeiras */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-surface-1 border border-border">
            <div className="flex flex-col">
              <span className="text-xs text-text-muted">Preço Venda</span>
              <span className="font-mono text-sm text-text-primary font-bold mt-1 tabular-nums">
                {formatCurrency(Number(product?.sale_price ?? 0))}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-text-muted">Custo Médio</span>
              <span className="font-mono text-sm text-text-secondary font-medium mt-1 tabular-nums">
                {formatCurrency(Number(product?.cost_price ?? 0))}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs text-text-muted">Margem Bruta</span>
              <span className="font-mono text-sm text-primary font-bold mt-1 tabular-nums">
                {Number(product?.sale_price) > 0
                  ? `${(((Number(product?.sale_price) - Number(product?.cost_price)) / Number(product?.sale_price)) * 100).toFixed(1)}%`
                  : '—'}
              </span>
            </div>
          </div>

          {/* Bloco de Estoque & Capacidade */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">
                Níveis de Estoque
              </span>
              <span className="font-mono text-xs text-cyan-accent font-bold tabular-nums">
                {stock} un
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-1 overflow-hidden border border-border/50">
              <div
                className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(47,107,255,0.7)] transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((stock / Math.max(stock, minStock, 1)) * 100))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>
                Mínimo operacional: <strong className="text-text-primary">{minStock} un</strong>
              </span>
              <span>
                Código de barras: <strong className="text-text-primary">{product?.barcode || 'Não informado'}</strong>
              </span>
            </div>
          </div>

          {/* Mini Timeline: Movimentações Recentes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-text-primary">Movimentações</h4>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                INDISPONÍVEL
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              A API ainda não disponibiliza o histórico de movimentações deste produto.
            </p>
          </div>
        </div>

        {/* Rodapé Fixo do Drawer */}
        <div className="p-4 bg-surface-1 border-t border-border flex items-center gap-2.5 shrink-0">
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="h-10 px-3 bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 cursor-pointer"
            title="Excluir produto"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-xs">Excluir</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onDuplicate}
            className="flex-1 h-10 gap-1.5 text-xs bg-surface-2 border-border hover:bg-surface-elevated text-text-primary cursor-pointer"
          >
            <Copy className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
            <span>Duplicar</span>
          </Button>

          <Button
            onClick={onEdit}
            className="flex-1 h-10 gap-1.5 text-xs font-semibold shadow-[0_0_12px_rgba(47,107,255,0.35)] cursor-pointer"
          >
            <Edit className="h-4 w-4" strokeWidth={1.5} />
            <span>Editar produto</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
