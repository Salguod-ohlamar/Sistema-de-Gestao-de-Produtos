import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Ban,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/features/auth/context'
import { ApiError, type ApiProduct, type CreatedSale } from '@/lib/api'
import { formatCurrency } from '@/lib/utils/formatters'
import {
  addToCart,
  cartItemCount,
  cartTotalCents,
  changeQuantity,
  removeLine,
  type CartLine,
} from '../cart'
import { useCreateSale, useProducts } from '../hooks/useSales'
import { ReceiptDialog } from './ReceiptDialog'

type StockState = 'ok' | 'low' | 'out'

function stockState(product: ApiProduct): StockState {
  if (product.stock_quantity <= 0) return 'out'
  if (product.stock_quantity <= product.min_stock_quantity) return 'low'
  return 'ok'
}

function StockChip({ product }: { product: ApiProduct }) {
  const state = stockState(product)
  if (state === 'out') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-status-error/12 px-2 py-0.5 text-[11px] font-semibold text-status-error">
        <Ban className="h-3 w-3" aria-hidden="true" /> Sem estoque
      </span>
    )
  }
  if (state === 'low') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-status-warning/12 px-2 py-0.5 text-[11px] font-semibold text-status-warning">
        <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Restam {product.stock_quantity}
      </span>
    )
  }
  return (
    <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[11px] font-medium text-text-muted">
      {product.stock_quantity} em estoque
    </span>
  )
}

function ProductCard({ product, onAdd }: { product: ApiProduct; onAdd: () => void }) {
  const out = product.stock_quantity <= 0
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={out}
      aria-label={`Adicionar ${product.name} ao carrinho`}
      className="flex min-h-[200px] flex-col gap-3 rounded-[14px] border border-border bg-surface-2 p-3.5 text-left transition-colors hover:border-border-highlight hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      <div className="flex flex-1 items-center justify-center overflow-hidden rounded-[10px] bg-surface-1">
        {product.image_url ? (
          <img src={product.image_url} alt="" className="h-full max-h-28 w-full object-cover" />
        ) : (
          <Package className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-text-primary">{product.name}</span>
        <span className="font-mono text-[11px] text-text-muted">{product.sku}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-base font-medium text-text-primary">
          {formatCurrency(Number(product.sale_price))}
        </span>
        <StockChip product={product} />
      </div>
    </button>
  )
}

export function PosView() {
  const { user } = useAuth()
  const { data: products, isLoading, isError, error, refetch } = useProducts()
  const createSale = useCreateSale()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [lines, setLines] = useState<CartLine[]>([])
  const [receipt, setReceipt] = useState<{ sale: CreatedSale; names: Record<number, string> } | null>(null)

  const categories = useMemo(() => {
    const set = new Set<string>()
    products?.forEach((p) => p.category && set.add(p.category))
    return [...set].sort()
  }, [products])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (products ?? []).filter(
      (p) =>
        (!category || p.category === category) &&
        (!term || p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term))
    )
  }, [products, search, category])

  const totalCents = cartTotalCents(lines)
  const itemCount = cartItemCount(lines)

  const handleAdd = (product: ApiProduct) => {
    const current = lines.find((l) => l.productId === product.id)
    if (current && current.quantity >= current.maxQuantity) {
      toast.warning(`Estoque máximo de "${product.name}" já está no carrinho.`)
      return
    }
    setLines((prev) => addToCart(prev, product))
  }

  const handleFinish = () => {
    const names = Object.fromEntries(lines.map((l) => [l.productId, l.name]))
    createSale.mutate(
      lines.map((l) => ({ product_id: l.productId, quantity: l.quantity })),
      {
        onSuccess: (sale) => {
          setReceipt({ sale, names })
          setLines([])
        },
        onError: (err) =>
          toast.error(
            err instanceof ApiError && err.status === 409
              ? 'Estoque insuficiente para um ou mais produtos. Atualize a lista e tente de novo.'
              : `Venda não concluída: ${err.message}`
          ),
      }
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6 p-6">
      {/* Catálogo */}
      <section className="flex min-w-0 flex-1 flex-col gap-4" aria-label="Catálogo de produtos">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-headline text-[28px] font-bold leading-tight text-text-primary">Frente de caixa</h1>
            <p className="text-[13px] text-text-secondary">Toque em um produto para adicionar à venda.</p>
          </div>
          <div className="relative w-[300px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
            <Input
              aria-label="Buscar produto ou SKU"
              placeholder="Buscar produto ou SKU"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Categorias">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? 'todos'}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`h-10 rounded-full border px-4 text-[13px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                category === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface-2 text-text-secondary hover:border-border-highlight hover:text-text-primary'
              }`}
            >
              {c ?? 'Todos'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3" aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-[200px] rounded-[14px]" />
              ))}
            </div>
          ) : isError ? (
            <div role="alert" className="flex flex-col items-center gap-3 rounded-[14px] border border-status-error/30 bg-status-error/10 p-8 text-center">
              <AlertTriangle className="h-6 w-6 text-status-error" aria-hidden="true" />
              <p className="text-sm text-text-primary">
                {error instanceof ApiError ? error.message : 'Não foi possível carregar os produtos.'}
              </p>
              <Button variant="outline" onClick={() => void refetch()}>Tentar novamente</Button>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-[14px] border border-border bg-surface-2 p-10 text-center">
              <Package className="h-7 w-7 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-sm text-text-secondary">
                {products?.length ? 'Nenhum produto encontrado para essa busca.' : 'Nenhum produto cadastrado ainda.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={() => handleAdd(p)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Venda atual */}
      <aside
        aria-label="Venda atual"
        className="dark flex w-[380px] shrink-0 flex-col gap-4 rounded-[14px] border border-border-highlight bg-surface-elevated p-6 text-text-primary"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-xl font-bold text-text-primary">Venda atual</h2>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-text-secondary">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-text-muted">
              <ShoppingCart className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-sm">Nenhum item na venda.</p>
            </div>
          ) : (
            lines.map((line, index) => (
              <div key={line.productId} className={`flex flex-col gap-2.5 py-3.5 ${index > 0 ? 'border-t border-border' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold text-text-primary">{line.name}</span>
                    <span className="font-mono text-[11px] text-text-muted">{formatCurrency(line.unitPriceCents / 100)} un.</span>
                  </div>
                  <span className="font-mono text-sm font-medium text-text-primary">
                    {formatCurrency((line.unitPriceCents * line.quantity) / 100)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-[10px] bg-surface-2">
                    <button type="button" aria-label={`Diminuir quantidade de ${line.name}`} onClick={() => setLines((p) => changeQuantity(p, line.productId, -1))} className="flex h-10 w-10 items-center justify-center text-text-primary cursor-pointer rounded-[10px] hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <Minus className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center font-mono text-sm font-medium text-text-primary" aria-live="polite">{line.quantity}</span>
                    <button type="button" aria-label={`Aumentar quantidade de ${line.name}`} disabled={line.quantity >= line.maxQuantity} onClick={() => setLines((p) => changeQuantity(p, line.productId, 1))} className="flex h-10 w-10 items-center justify-center text-text-primary cursor-pointer rounded-[10px] hover:bg-surface-1 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <Plus className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    </button>
                  </div>
                  <button type="button" aria-label={`Remover ${line.name}`} onClick={() => setLines((p) => removeLine(p, line.productId))} className="flex h-10 w-10 items-center justify-center rounded-[10px] text-text-secondary cursor-pointer hover:bg-surface-2 hover:text-status-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Trash2 className="h-[17px] w-[17px]" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-baseline justify-between border-t border-border pt-4">
          <span className="font-headline text-base font-semibold text-text-primary">Total</span>
          <span className="font-mono text-[32px] font-medium leading-none text-text-primary">{formatCurrency(totalCents / 100)}</span>
        </div>

        <Button size="lg" className="h-14 text-base font-semibold" disabled={lines.length === 0 || createSale.isPending} onClick={handleFinish}>
          {createSale.isPending ? 'Registrando venda...' : 'Finalizar venda'}
        </Button>
        <Button variant="outline" size="lg" disabled={lines.length === 0 || createSale.isPending} onClick={() => setLines([])}>
          Cancelar venda
        </Button>
      </aside>

      <ReceiptDialog
        sale={receipt?.sale ?? null}
        lineNames={receipt?.names ?? {}}
        operatorName={user?.name ?? ''}
        onClose={() => setReceipt(null)}
      />
    </div>
  )
}
