import { useState } from 'react'
import {
  Download,
  Plus,
  Search,
  X,
  ChevronDown,
  ArrowUpDown,
  List,
  Grid,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  MoreVertical,
  Headphones,
  Mouse,
  Keyboard,
  Cpu,
  Video,
  Armchair,
  Laptop,
  HardDrive,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ProductDetailDrawer } from './ProductDetailDrawer'
import { FloatingActionBar } from './FloatingActionBar'
import { toast } from 'sonner'

interface ProductRow {
  id: string
  name: string
  sku: string
  category: string
  price: string
  stockUnits: number
  stockMax: number
  status: 'Em estoque' | 'Estoque baixo' | 'Esgotado'
  statusVariant: 'success' | 'warning' | 'destructive'
  updatedAt: string
  icon: React.ElementType
  image?: string
}

interface ProductsViewProps {
  onNavigate?: (view: string) => void
}

export function ProductsView({ onNavigate }: ProductsViewProps = {}) {
  const [drawerOpen, setDrawerOpen] = useState(true) // Aberto por padrão para coincidir com a tela Stitch
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2']) // Itens 1 e 2 selecionados conforme screenshot
  const [searchQuery, setSearchQuery] = useState('Pulse X2')
  const [categoryFilter, setCategoryFilter] = useState<string | null>('Eletrônicos')

  const products: ProductRow[] = [
    {
      id: '1',
      name: 'Fone Bluetooth Pulse X2',
      sku: 'PLS-X2-BLK',
      category: 'Eletrônicos',
      price: 'R$ 249,90',
      stockUnits: 42,
      stockMax: 50,
      status: 'Em estoque',
      statusVariant: 'success',
      updatedAt: 'Hoje, 14:20',
      icon: Headphones,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
    },
    {
      id: '2',
      name: 'Mouse Sem Fio Aero M3',
      sku: 'MOU-AER-M3',
      category: 'Eletrônicos',
      price: 'R$ 189,00',
      stockUnits: 18,
      stockMax: 50,
      status: 'Em estoque',
      statusVariant: 'success',
      updatedAt: 'Hoje, 11:05',
      icon: Mouse,
    },
    {
      id: '3',
      name: 'Teclado Mecânico Forge 75',
      sku: 'KBD-FRG-75',
      category: 'Eletrônicos',
      price: 'R$ 549,00',
      stockUnits: 8,
      stockMax: 40,
      status: 'Estoque baixo',
      statusVariant: 'warning',
      updatedAt: 'Ontem, 16:40',
      icon: Keyboard,
    },
    {
      id: '4',
      name: 'Hub USB-C 7 em 1',
      sku: 'HUB-7IN1-GRY',
      category: 'Acessórios',
      price: 'R$ 169,90',
      stockUnits: 0,
      stockMax: 30,
      status: 'Esgotado',
      statusVariant: 'destructive',
      updatedAt: 'Ontem, 09:12',
      icon: Cpu,
    },
    {
      id: '5',
      name: 'Webcam Full HD Vision',
      sku: 'CAM-FHD-VIS',
      category: 'Eletrônicos',
      price: 'R$ 215,00',
      stockUnits: 24,
      stockMax: 50,
      status: 'Em estoque',
      statusVariant: 'success',
      updatedAt: '10 out',
      icon: Video,
    },
    {
      id: '6',
      name: 'Cadeira Ergonômica Lumbar Pro',
      sku: 'CAD-LMB-PRO',
      category: 'Escritório',
      price: 'R$ 1.390,00',
      stockUnits: 12,
      stockMax: 20,
      status: 'Em estoque',
      statusVariant: 'success',
      updatedAt: '08 out',
      icon: Armchair,
    },
    {
      id: '7',
      name: 'Suporte para Notebook Alumínio',
      sku: 'SUP-NOT-ALM',
      category: 'Acessórios',
      price: 'R$ 129,00',
      stockUnits: 3,
      stockMax: 30,
      status: 'Estoque baixo',
      statusVariant: 'warning',
      updatedAt: '05 out',
      icon: Laptop,
    },
    {
      id: '8',
      name: 'SSD Externo 1TB Pro',
      sku: 'SSD-EXT-1TB',
      category: 'Eletrônicos',
      price: 'R$ 489,00',
      stockUnits: 32,
      stockMax: 50,
      status: 'Em estoque',
      statusVariant: 'success',
      updatedAt: '03 out',
      icon: HardDrive,
    },
  ]

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(products.map((p) => p.id))
    }
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-8 py-6 space-y-6">
      {/* Cabeçalho da Página (72px) */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 h-auto md:h-[72px]">
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
              Produtos
            </h1>
            <Badge
              variant="outline"
              className="px-2.5 py-0.5 text-[11px] font-mono tracking-wide uppercase text-cyan-accent bg-cyan-accent/10 border-cyan-accent/30 gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-pulse" />
              Catálogo Ativo
            </Badge>
          </div>
          <p className="text-sm text-text-muted mt-0.5">
            1.248 itens cadastrados no inventário central
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            onClick={() => toast.info('Iniciando importação de arquivo CSV...')}
            className="h-10 px-4 rounded-xl gap-2 text-sm bg-surface-1 border-border hover:bg-surface-elevated text-text-primary shadow-sm cursor-pointer"
          >
            <Download className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
            <span>Importar CSV</span>
          </Button>

          <Button
            onClick={() => {
              if (onNavigate) {
                onNavigate('novo-produto')
              } else {
                toast.info('Abrindo cadastro de novo produto...')
              }
            }}
            className="h-10 px-5 rounded-xl gap-2 font-medium shadow-[0_0_16px_rgba(47,107,255,0.35)] cursor-pointer"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            <span>Novo produto</span>
          </Button>
        </div>
      </header>

      {/* Barra de Ferramentas e Filtros (56px) */}
      <section className="min-h-[56px] py-2 px-3 rounded-xl bg-surface-1 border border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          {/* Input de busca */}
          <div className="relative w-full sm:w-[340px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4"
              strokeWidth={1.5}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou SKU..."
              className="h-9 pl-9 pr-14 rounded-lg bg-surface-elevated border-border text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-1 border border-border font-mono text-[10px] text-text-muted select-none">
              ⌘K
            </div>
          </div>

          <div className="h-5 w-px bg-border hidden sm:block" />

          {/* Filtro Ativo: Categoria */}
          {categoryFilter && (
            <div className="inline-flex items-center gap-1.5 h-9 pl-3 pr-2 rounded-lg bg-primary/15 text-text-primary text-xs border border-primary/30">
              <span className="text-text-muted">Cat:</span>
              <span className="font-semibold text-primary">{categoryFilter}</span>
              <button
                type="button"
                onClick={() => setCategoryFilter(null)}
                className="p-0.5 rounded hover:bg-primary/20 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Filtro Status Dropdown */}
          <Button
            variant="secondary"
            size="sm"
            className="h-9 px-3 gap-1.5 text-xs bg-surface-elevated border-border text-text-secondary hover:text-text-primary cursor-pointer"
          >
            <span>Status</span>
            <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
          </Button>

          {/* Filtro Faixa de estoque */}
          <Button
            variant="secondary"
            size="sm"
            className="h-9 px-3 gap-1.5 text-xs bg-surface-elevated border-border text-text-secondary hover:text-text-primary cursor-pointer"
          >
            <span>Faixa de estoque</span>
            <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
          </Button>

          {/* Filtro Preço */}
          <Button
            variant="secondary"
            size="sm"
            className="h-9 px-3 gap-1.5 text-xs bg-surface-elevated border-border text-text-secondary hover:text-text-primary cursor-pointer"
          >
            <span>Preço</span>
            <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
          </Button>
        </div>

        {/* Controles de Visualização e Ordenação */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="h-9 px-3 gap-2 text-xs bg-surface-elevated border-border text-text-secondary hover:text-text-primary cursor-pointer"
          >
            <span className="text-text-muted">Ordenar:</span>
            <span className="text-text-primary font-medium">Mais recentes</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-text-muted" />
          </Button>

          <div className="flex items-center p-0.5 rounded-lg bg-surface-elevated border border-border">
            <button
              type="button"
              aria-label="Visualização em Lista"
              className="h-8 w-8 rounded-md bg-surface-1 text-primary flex items-center justify-center shadow-inner cursor-pointer"
            >
              <List className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Visualização em Grade"
              className="h-8 w-8 rounded-md text-text-muted hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer"
            >
              <Grid className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </section>

      {/* Card da Tabela Principal */}
      <Card className="w-full bg-surface-2 rounded-xl border-border shadow-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse select-none min-w-[1020px]">
            {/* Cabeçalho da Tabela (44px) */}
            <thead>
              <tr className="h-11 bg-surface-1 border-b border-border text-text-muted text-xs uppercase tracking-wider font-mono">
                <th className="w-12 px-4 text-center">
                  <Checkbox
                    checked={
                      selectedIds.length === products.length
                        ? true
                        : selectedIds.length > 0
                        ? 'indeterminate'
                        : false
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="py-3 px-4 font-semibold">Produto</th>
                <th className="py-3 px-4 font-semibold">Categoria</th>
                <th className="py-3 px-4 font-semibold text-right">Preço</th>
                <th className="py-3 px-6 font-semibold">Estoque</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Atualizado em</th>
                <th className="w-20 py-3 px-4 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {products.map((p) => {
                const Icon = p.icon
                const isSelected = selectedIds.includes(p.id)
                const pct = Math.round((p.stockUnits / p.stockMax) * 100)

                return (
                  <tr
                    key={p.id}
                    onClick={() => {
                      setDrawerOpen(true)
                    }}
                    className={`h-16 transition-colors group cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 hover:bg-primary/15'
                        : 'hover:bg-surface-elevated/40'
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="px-4 text-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSelect(p.id)
                      }}
                    >
                      <Checkbox checked={isSelected} />
                    </td>

                    {/* Produto (Imagem/Ícone + Nome + SKU) */}
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border overflow-hidden shrink-0 flex items-center justify-center text-text-muted relative">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon className="h-5 w-5 text-text-muted" strokeWidth={1.5} />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-text-primary font-semibold truncate group-hover:text-primary transition-colors">
                            {p.name}
                          </span>
                          <span className="font-mono text-xs text-text-muted">
                            {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="py-2 px-4 text-text-secondary">{p.category}</td>

                    {/* Preço */}
                    <td className="py-2 px-4 text-right font-mono text-sm text-text-primary font-semibold tabular-nums">
                      {p.price}
                    </td>

                    {/* Estoque */}
                    <td className="py-2 px-6">
                      <div className="flex flex-col gap-1.5 w-24">
                        <span className="font-mono text-xs text-text-primary tabular-nums">
                          {p.stockUnits} un
                        </span>
                        <div className="w-full h-1 rounded-full bg-surface-1 overflow-hidden border border-border/50">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              p.statusVariant === 'success'
                                ? 'bg-cyan-accent'
                                : p.statusVariant === 'warning'
                                ? 'bg-status-warning'
                                : 'bg-destructive'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2 px-4">
                      <Badge
                        variant={p.statusVariant}
                        className="gap-1.5 font-mono text-[11px] px-2.5 py-0.5"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.statusVariant === 'success'
                              ? 'bg-status-success'
                              : p.statusVariant === 'warning'
                              ? 'bg-status-warning'
                              : 'bg-destructive'
                          }`}
                        />
                        {p.status}
                      </Badge>
                    </td>

                    {/* Atualizado em */}
                    <td className="py-2 px-4 font-mono text-xs text-text-muted tabular-nums">
                      {p.updatedAt}
                    </td>

                    {/* Ações */}
                    <td
                      className="py-2 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toast.info(`Editando ${p.name}`)}
                          className="text-text-muted hover:text-text-primary cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toast.error(`Item excluído: ${p.sku}`)}
                          className="text-text-muted hover:text-destructive cursor-pointer"
                          title="Excluir produto"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-text-muted hover:text-text-primary cursor-pointer"
                          title="Mais opções"
                        >
                          <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Paginação (56px) */}
        <footer className="h-14 px-6 bg-surface-1 border-t border-border flex items-center justify-between gap-4 text-xs">
          <span className="text-text-muted">
            Mostrando <strong className="text-text-primary font-semibold">1–8</strong> de{' '}
            <strong className="text-text-primary font-semibold">1.248</strong> produtos
          </span>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-text-muted hidden sm:inline">Exibir:</span>
              <select
                aria-label="Itens por página"
                className="h-8 px-2.5 rounded-md bg-surface-elevated border border-border text-xs text-text-primary cursor-pointer focus:outline-none"
              >
                <option>8 por página</option>
                <option>16 por página</option>
                <option>32 por página</option>
              </select>
            </div>

            <nav aria-label="Navegação da Tabela" className="flex items-center gap-1 font-mono">
              <Button
                variant="secondary"
                size="icon-sm"
                disabled
                className="h-8 w-8 opacity-40 bg-surface-elevated"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="h-8 w-8 text-xs font-bold bg-primary text-text-primary"
              >
                1
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 text-xs bg-surface-elevated text-text-muted hover:text-text-primary"
              >
                2
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 text-xs bg-surface-elevated text-text-muted hover:text-text-primary"
              >
                3
              </Button>
              <span className="text-text-muted px-1 text-xs">...</span>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 px-2 text-xs bg-surface-elevated text-text-muted hover:text-text-primary"
              >
                156
              </Button>
              <Button
                variant="secondary"
                size="icon-sm"
                className="h-8 w-8 bg-surface-elevated text-text-muted hover:text-text-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </footer>
      </Card>

      {/* Barra Flutuante de Ações em Lote */}
      <FloatingActionBar
        selectedCount={selectedIds.length}
        onBatchEdit={() => toast.info(`Editar em lote: ${selectedIds.length} itens`)}
        onExport={() => toast.success(`Exportando ${selectedIds.length} itens selecionados...`)}
        onDelete={() => {
          setSelectedIds([])
          toast.error('Produtos selecionados excluídos do catálogo.')
        }}
      />

      {/* Drawer Lateral de Detalhes do Produto */}
      <ProductDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onEdit={() => {
          if (onNavigate) {
            onNavigate('novo-produto')
          } else {
            toast.info('Abrindo editor para Fone Bluetooth Pulse X2')
          }
        }}
        onDuplicate={() => toast.success('Produto duplicado como rascunho!')}
        onDelete={() => {
          setDrawerOpen(false)
          toast.error('Produto excluído com sucesso.')
        }}
      />
    </div>
  )
}
