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

interface ProductDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
}

export function ProductDetailDrawer({
  open,
  onOpenChange,
  onEdit,
  onDuplicate,
  onDelete,
}: ProductDetailDrawerProps) {
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
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
              alt="Fone Bluetooth Pulse X2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent opacity-80" />
            <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-surface-1/90 backdrop-blur-md font-mono text-[10px] text-cyan-accent border border-border">
              IMG-01 • HD VIEW
            </span>
          </div>

          {/* Título & Metadados */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-headline text-lg font-bold text-text-primary leading-tight">
                Fone Bluetooth Pulse X2
              </h3>
              <Badge
                variant="success"
                className="gap-1.5 font-mono text-xs px-2.5 py-0.5 shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                Em estoque
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-text-muted">SKU: PLS-X2-BLK</span>
              <span className="text-text-muted">•</span>
              <span className="text-cyan-accent font-medium">
                Eletrônicos &gt; Áudio
              </span>
            </div>
          </div>

          {/* Bloco de Métricas Financeiras */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-surface-1 border border-border">
            <div className="flex flex-col">
              <span className="text-xs text-text-muted">Preço Venda</span>
              <span className="font-mono text-sm text-text-primary font-bold mt-1 tabular-nums">
                R$ 249,90
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-text-muted">Custo Médio</span>
              <span className="font-mono text-sm text-text-secondary font-medium mt-1 tabular-nums">
                R$ 120,00
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs text-text-muted">Margem Bruta</span>
              <span className="font-mono text-sm text-primary font-bold mt-1 tabular-nums">
                +52,0%
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
                42 de 50 un (84%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-1 overflow-hidden border border-border/50">
              <div
                className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(47,107,255,0.7)] transition-all duration-500"
                style={{ width: '84%' }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>
                Mínimo operacional: <strong className="text-text-primary">15 un</strong>
              </span>
              <span>
                Armazém: <strong className="text-text-primary">Setor B-04</strong>
              </span>
            </div>
          </div>

          {/* Mini Timeline: Movimentações Recentes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-text-primary">
                Movimentações Recentes
              </h4>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                AUDITORIA
              </span>
            </div>
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {/* Item 1: Entrada */}
              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-cyan-accent ring-4 ring-surface-2" />
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-accent">
                      +50 un
                    </span>
                    <span className="font-mono text-xs text-text-muted">10/10</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Recebimento NF-e #4921 (Fornecedor Matrix)
                  </p>
                </div>
              </div>

              {/* Item 2: Venda */}
              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-2" />
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">
                      -2 un
                    </span>
                    <span className="font-mono text-xs text-text-muted">Ontem</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Venda checkout (Pedido #10482)
                  </p>
                </div>
              </div>

              {/* Item 3: Ajuste */}
              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-destructive ring-4 ring-surface-2" />
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-destructive">
                      -1 un
                    </span>
                    <span className="font-mono text-xs text-text-muted">08/10</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Ajuste técnico (Avaria em expedição)
                  </p>
                </div>
              </div>
            </div>
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
