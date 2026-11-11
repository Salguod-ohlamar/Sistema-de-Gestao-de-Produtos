import { useState } from 'react'
import {
  Package,
  Sliders,
  FilePenLine,
  RotateCcw,
  Barcode,
  ChevronDown,
  CircleDollarSign,
  Percent,
  Warehouse,
  AlertCircle,
  BellRing,
  ImagePlus,
  UploadCloud,
  Trash2,
  Plus,
  Eye,
  Store,
  Wallet,
  CheckCircle2,
  Save,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils/formatters'
import { toast } from 'sonner'

interface NewProductViewProps {
  onBack?: () => void
}

export function NewProductView({ onBack }: NewProductViewProps) {
  // Estado do Formulário
  const [name, setName] = useState('Teclado Mecânico ErgoPro')
  const [sku, setSku] = useState('KBD-ERG-99')
  const [barcode, setBarcode] = useState('7898956421034')
  const [category, setCategory] = useState('Eletrônicos & Periféricos')
  const [brand, setBrand] = useState('Nexora Gear')
  const [description, setDescription] = useState(
    'Teclado mecânico com layout ergonômico dividido, switches táteis silenciosos com lubrificação de fábrica, iluminação per-key customizável e conectividade dual wireless 2.4GHz e Bluetooth 5.2 de ultra-baixa latência.'
  )
  const [salePrice, setSalePrice] = useState<number>(540.0)
  const [costPrice, setCostPrice] = useState<number>(310.0)
  const [allowDiscount, setAllowDiscount] = useState<boolean>(true)
  const [currentStock, setCurrentStock] = useState<number>(25)
  const [minStock, setMinStock] = useState<number>(30)
  const [unit, setUnit] = useState('un (Unidade)')
  const [alertMinStock, setAlertMinStock] = useState<boolean>(true)
  const [status, setStatus] = useState<'ativo' | 'rascunho' | 'inativo'>('ativo')
  const [publicCatalog, setPublicCatalog] = useState<boolean>(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  // Imagens da galeria
  const [images, setImages] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBOQ92dPaHASDQEhNOTlBeSbLP1joS8-zBnfgHg-qr9nuKciL7HASe3WTpJy9xJSAR2aorXLbfx5nE5fb2b6hM02zuOE39x20Y6rKY54TuiWJmE_tRt3vhyGX1hA1YjMvXHErjVoUvEp7Y-yRDrBI55wIcjvXavXLllhT5WbwkqYk2R2NjthZRbtOqnGlfQkacVEtoSbSbZULulRkrQqlf3sPneCo6a3B5HlVI-GX2j7fBCb99v0evJ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDWhf4zdgilhsa0cnfyX-9Sdv6CCfmCY39RdjmX9798e-CZtQsKU5zvCb8Ei-cbavdn61k3vklui5aTsSmCcRjuFTPvAYLydxIHAHt9XJEXoEWJMGnIZphXUDMsnLWw9qJsOq2ODHkfX73PEMhe2f5xiDtE91nY_VZO2vCxIGQFovK6NMKZ3BF68CjwnRnxfPq-rp5cs96ct5s452kCrwI1aSJMVHmA1PHf9VX2k27ESKxb4dX0qI0R',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDHNJ9Jv-oKdXnELEfsAFURhIT_5AX0Q-f-oA8jU6r6PaPqY4QRgl4X4JQoSSiOuEIT500xs0yCs213ODXIBLUgczT7bjYx1xyIxTScD9-LIIQGnZCOwqctLlQ2481oCt7J7mwf8EJnKRfa2_DP14m762D_tTYMkVL-3QENpjer2Opp-zzfGnrHrhPL1zfqdKLdOnxrtykUixDtMz-HlybbkQIMI4GosCPiq1OJp3lFG3tBqnIp2Lx1',
  ])

  // Cálculos financeiros e de estoque
  const marginPercent =
    salePrice > 0 ? (((salePrice - costPrice) / salePrice) * 100).toFixed(1) : '0,0'
  const markup = costPrice > 0 ? (salePrice / costPrice).toFixed(2) : '0,00'
  const totalStockValue = currentStock * salePrice
  const projectedProfit = currentStock * (salePrice - costPrice)
  const isStockMinError = minStock > currentStock

  // Contador de campos mandatórios (6 campos obrigatórios)
  const mandatoryCount = [
    name.trim().length > 0,
    sku.trim().length > 0,
    category.trim().length > 0,
    salePrice > 0,
    currentStock >= 0,
    minStock >= 0,
  ].filter(Boolean).length

  // Geração automática de SKU
  const handleGenerateSku = () => {
    const randomSuffix = Math.floor(10 + Math.random() * 90)
    const prefix = name
      .split(' ')
      .slice(0, 2)
      .map((w) => w.substring(0, 3).toUpperCase())
      .join('-')
    const generated = `${prefix || 'PRD'}-${randomSuffix}`
    setSku(generated)
    toast.info(`Novo SKU gerado: ${generated}`)
  }

  // Deletar imagem da galeria
  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      toast.warning('O produto deve manter ao menos uma imagem principal.')
      return
    }
    setImages(images.filter((_, i) => i !== index))
    toast.info('Imagem removida da galeria.')
  }

  const handleSaveDraft = () => {
    toast.success('Rascunho salvo com sucesso!')
  }

  const handleSaveProduct = () => {
    if (isStockMinError) {
      toast.error('Corrija os erros de validação antes de salvar o produto.')
      return
    }
    toast.success('Produto salvo e sincronizado com sucesso no catálogo!')
  }

  const handleDeleteConfirm = () => {
    setIsDeleteDialogOpen(false)
    toast.success(`Produto ${sku} excluído permanentemente.`)
    onBack?.()
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background pb-32">
      {/* Cabeçalho Cockpit */}
      <div className="px-8 pt-8 pb-6 max-w-[1192px] mx-auto w-full">
        {/* Breadcrumb e Metadados de Auditoria */}
        <div className="flex items-center justify-between mb-3">
          <nav className="flex items-center gap-2 text-xs text-text-muted">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="h-3.5 w-3.5 text-text-muted" />
              <span>Produtos</span>
            </button>
            <span className="text-border-highlight font-mono text-[11px]">/</span>
            <span className="text-text-secondary font-medium">Novo produto</span>
          </nav>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-elevated text-text-muted font-mono text-[11px] border border-border">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-accent shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
              SYS-INVENTORY v1.4.2
            </span>
          </div>
        </div>

        {/* Título Operacional e Indicador */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline text-2xl lg:text-[28px] text-text-primary tracking-tight font-bold flex items-center gap-3">
              <span>Novo produto</span>
              <span className="px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/25 font-mono text-[11px] uppercase tracking-wider font-semibold">
                SKU Cockpit
              </span>
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Preencha as informações para cadastrar o item no estoque e sincronizar catálogos.
            </p>
          </div>

          {/* Mini Indicador de Produtividade */}
          <div className="flex items-center gap-2 text-text-muted font-mono text-xs">
            <Sliders className="h-4 w-4 text-primary" />
            <span>
              Campos mandatórios:{' '}
              <strong className="text-text-primary font-semibold">
                {mandatoryCount} de 6
              </strong>{' '}
              preenchidos
            </span>
          </div>
        </div>
      </div>

      {/* Grid Principal em 12 Colunas */}
      <div className="px-8 max-w-[1192px] mx-auto w-full">
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* ========================================== */}
          {/* COLUNA ESQUERDA (8 COLUNAS ~ 744px)        */}
          {/* ========================================== */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            {/* CARD 1: Informações Básicas */}
            <section className="rounded-xl bg-surface-2 p-6 border border-border shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/80 via-primary/30 to-transparent" />
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <FilePenLine className="h-5 w-5 text-primary" strokeWidth={1.75} />
                  <h2 className="font-headline text-base text-text-primary font-semibold tracking-tight">
                    Informações básicas
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-text-muted uppercase">
                  Módulo 01
                </span>
              </div>

              <div className="flex flex-col gap-5">
                {/* Nome do Produto */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="product-name"
                      className="text-xs text-text-secondary font-medium"
                    >
                      Nome do produto <span className="text-destructive">*</span>
                    </label>
                    <span className="font-mono text-[11px] text-text-muted">
                      Identificador primário no PDV
                    </span>
                  </div>
                  <input
                    id="product-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-1 rounded-lg text-text-primary text-sm placeholder:text-text-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                {/* SKU e Código de Barras */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* SKU */}
                  <div>
                    <label
                      htmlFor="product-sku"
                      className="block text-xs text-text-secondary font-medium mb-1.5"
                    >
                      SKU (Unidade de Manutenção) <span className="text-destructive">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="product-sku"
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full h-11 pl-3.5 pr-20 bg-surface-1 rounded-lg text-text-primary font-mono text-sm tracking-wide border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateSku}
                        className="absolute right-2 px-2.5 py-1.5 rounded-md bg-surface-elevated hover:bg-surface-elevated/80 text-primary font-medium text-xs transition-all flex items-center gap-1 cursor-pointer border border-border"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Gerar</span>
                      </button>
                    </div>
                  </div>

                  {/* EAN-13 */}
                  <div>
                    <label
                      htmlFor="product-barcode"
                      className="block text-xs text-text-secondary font-medium mb-1.5"
                    >
                      Código de barras (EAN-13)
                    </label>
                    <div className="relative flex items-center">
                      <Barcode className="absolute left-3 text-text-muted h-4 w-4" />
                      <input
                        id="product-barcode"
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="w-full h-11 pl-10 pr-3.5 bg-surface-1 rounded-lg text-text-primary font-mono text-sm tracking-wider border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Categoria e Marca */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Categoria */}
                  <div>
                    <label
                      htmlFor="product-category"
                      className="block text-xs text-text-secondary font-medium mb-1.5"
                    >
                      Categoria <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="product-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-11 pl-3.5 pr-10 bg-surface-1 rounded-lg text-text-primary text-sm appearance-none border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                      >
                        <option value="Eletrônicos & Periféricos">Eletrônicos & Periféricos</option>
                        <option value="Hardware & Componentes">Hardware & Componentes</option>
                        <option value="Acessórios de Ergonomia">Acessórios de Ergonomia</option>
                        <option value="Cabos & Conectividade">Cabos & Conectividade</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4" />
                    </div>
                  </div>

                  {/* Marca */}
                  <div>
                    <label
                      htmlFor="product-brand"
                      className="block text-xs text-text-secondary font-medium mb-1.5"
                    >
                      Marca / Fabricante
                    </label>
                    <input
                      id="product-brand"
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full h-11 px-3.5 bg-surface-1 rounded-lg text-text-primary text-sm placeholder:text-text-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="product-desc"
                      className="text-xs text-text-secondary font-medium"
                    >
                      Descrição técnica
                    </label>
                    <span className="font-mono text-[11px] text-text-muted">
                      HTML limpo suportado
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      id="product-desc"
                      rows={4}
                      value={description}
                      maxLength={500}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full min-h-[120px] p-3.5 pb-8 bg-surface-1 rounded-lg text-text-primary text-sm placeholder:text-text-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none leading-relaxed"
                    />
                    <div className="absolute bottom-2.5 right-3 px-1.5 py-0.5 rounded bg-surface-elevated font-mono text-[11px] text-text-muted select-none border border-border">
                      <span className="text-text-secondary">{description.length}</span>/500
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CARD 2: Preço e Custo */}
            <section className="rounded-xl bg-surface-2 p-6 border border-border shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <CircleDollarSign className="h-5 w-5 text-cyan-accent" strokeWidth={1.75} />
                  <h2 className="font-headline text-base text-text-primary font-semibold tracking-tight">
                    Preço e custo
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-text-muted uppercase">
                  Módulo 02
                </span>
              </div>

              <div className="flex flex-col gap-5">
                {/* Grid de Valores e Margem */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Preço de Venda */}
                  <div>
                    <label
                      htmlFor="sale-price"
                      className="block text-xs text-text-secondary font-medium mb-1.5"
                    >
                      Preço de venda <span className="text-destructive">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-mono text-xs text-text-muted font-semibold select-none">
                        R$
                      </span>
                      <input
                        id="sale-price"
                        type="number"
                        step="0.01"
                        value={salePrice}
                        onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                        className="w-full h-11 pl-11 pr-3.5 bg-surface-1 rounded-lg text-text-primary font-mono text-[15px] font-semibold tracking-wide border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Custo de Aquisição */}
                  <div>
                    <label
                      htmlFor="cost-price"
                      className="block text-xs text-text-secondary font-medium mb-1.5"
                    >
                      Custo de aquisição
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-mono text-xs text-text-muted font-semibold select-none">
                        R$
                      </span>
                      <input
                        id="cost-price"
                        type="number"
                        step="0.01"
                        value={costPrice}
                        onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                        className="w-full h-11 pl-11 pr-3.5 bg-surface-1 rounded-lg text-text-primary font-mono text-[15px] font-semibold tracking-wide border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Margem de Lucro (Somente Leitura) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs text-text-secondary font-medium">
                        Margem de lucro
                      </label>
                      <span className="font-mono text-[11px] text-cyan-accent">
                        Lucro líquido
                      </span>
                    </div>
                    <div className="h-11 px-3.5 bg-surface-elevated rounded-lg flex items-center justify-between border border-border">
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-[16px] font-bold text-primary tabular-nums">
                          {marginPercent}%
                        </span>
                        <span className="font-mono text-[11px] text-text-muted">margem</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-[11px] font-semibold tracking-wider border border-primary/25">
                        {markup}x Markup
                      </span>
                    </div>
                  </div>
                </div>

                {/* Linha Divisória Tonal */}
                <div className="h-px bg-border my-1" />

                {/* Toggle de Desconto PDV */}
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-1 border border-border">
                  <div className="flex items-start gap-3">
                    <Percent className="h-5 w-5 text-cyan-accent mt-0.5 shrink-0" />
                    <div>
                      <label
                        htmlFor="toggle-discount"
                        className="text-sm text-text-primary font-semibold cursor-pointer block"
                      >
                        Permitir desconto no PDV
                      </label>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Permite que vendedores apliquem até 10% de desconto na tela de venda sem autorização de gerente.
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="toggle-discount"
                    checked={allowDiscount}
                    onCheckedChange={setAllowDiscount}
                    className="ml-4"
                  />
                </div>
              </div>
            </section>

            {/* CARD 3: Estoque e Parâmetros de Reposição */}
            <section className="rounded-xl bg-surface-2 p-6 border border-border shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <Warehouse className="h-5 w-5 text-primary" strokeWidth={1.75} />
                  <h2 className="font-headline text-base text-text-primary font-semibold tracking-tight">
                    Estoque
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-text-muted uppercase">
                  Módulo 03
                </span>
              </div>

              <div className="flex flex-col gap-5">
                {/* 3 Campos de Quantidade e Unidade */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Quantidade Atual */}
                  <div>
                    <label
                      htmlFor="stock-qty"
                      className="block text-xs text-text-secondary font-medium mb-1.5"
                    >
                      Quantidade atual <span className="text-destructive">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="stock-qty"
                        type="number"
                        value={currentStock}
                        onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                        className="w-full h-11 pl-3.5 pr-8 bg-surface-1 rounded-lg text-text-primary font-mono text-[15px] font-semibold tracking-wide border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all tabular-nums"
                      />
                      <span className="absolute right-3 font-mono text-[11px] text-text-muted">
                        un
                      </span>
                    </div>
                  </div>

                  {/* Estoque Mínimo (Com Erro Intencional do Stitch) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="stock-min"
                        className={`block text-xs font-medium ${
                          isStockMinError ? 'text-destructive' : 'text-text-secondary'
                        }`}
                      >
                        Estoque mínimo <span className="text-destructive">*</span>
                      </label>
                      {isStockMinError && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <input
                        id="stock-min"
                        type="number"
                        value={minStock}
                        onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                        className={`w-full h-11 pl-3.5 pr-8 rounded-lg font-mono text-[15px] font-semibold tracking-wide transition-all tabular-nums ${
                          isStockMinError
                            ? 'bg-destructive/10 text-destructive border-2 border-destructive focus:ring-destructive focus:outline-none'
                            : 'bg-surface-1 text-text-primary border border-border focus:ring-1 focus:ring-primary focus:border-primary'
                        }`}
                      />
                      <span
                        className={`absolute right-3 font-mono text-[11px] ${
                          isStockMinError ? 'text-destructive' : 'text-text-muted'
                        }`}
                      >
                        un
                      </span>
                    </div>
                    {isStockMinError && (
                      <p className="mt-1.5 text-xs text-destructive flex items-start gap-1 leading-tight font-medium">
                        <span>O estoque mínimo deve ser menor que a quantidade atual</span>
                      </p>
                    )}
                  </div>

                  {/* Unidade de Medida */}
                  <div>
                    <label
                      htmlFor="stock-unit"
                      className="block text-xs text-text-secondary font-medium mb-1.5"
                    >
                      Unidade de medida
                    </label>
                    <div className="relative">
                      <select
                        id="stock-unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full h-11 pl-3.5 pr-10 bg-surface-1 rounded-lg text-text-primary text-sm appearance-none border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                      >
                        <option value="un (Unidade)">un (Unidade)</option>
                        <option value="cx (Caixa c/ 10)">cx (Caixa c/ 10)</option>
                        <option value="pct (Pacote)">pct (Pacote)</option>
                        <option value="kg (Quilograma)">kg (Quilograma)</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Linha Divisória Tonal */}
                <div className="h-px bg-border my-1" />

                {/* Toggle de Alerta de Estoque Mínimo */}
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-1 border border-border">
                  <div className="flex items-start gap-3">
                    <BellRing className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <label
                        htmlFor="toggle-alert"
                        className="text-sm text-text-primary font-semibold cursor-pointer block"
                      >
                        Alertar quando atingir o estoque mínimo
                      </label>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Envia um alerta prioritário ao cockpit de compras e gera sugestão de ordem de reposição.
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="toggle-alert"
                    checked={alertMinStock}
                    onCheckedChange={setAlertMinStock}
                    className="ml-4"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ========================================== */}
          {/* COLUNA DIREITA (4 COLUNAS ~ 360px)         */}
          {/* ========================================== */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* CARD 1: Imagem do Produto */}
            <section className="rounded-xl bg-surface-2 p-5 border border-border shadow-xl">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-primary" />
                  <h3 className="font-headline text-sm text-text-primary font-semibold">
                    Imagem do produto
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-text-muted">
                  {images.length} / 8 slots
                </span>
              </div>

              {/* Área de Upload Tracejada */}
              <div className="w-full h-44 rounded-xl bg-surface-1 p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-elevated/50 transition-all group relative overflow-hidden border border-dashed border-border-highlight">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary mb-2.5 group-hover:scale-105 group-hover:bg-primary/25 transition-all shadow-[0_0_16px_rgba(47,107,255,0.25)]">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm text-text-primary font-semibold leading-snug">
                  Arraste uma imagem ou{' '}
                  <span className="text-primary underline underline-offset-2">clique</span>
                </p>
                <p className="text-[11px] text-text-muted mt-1 font-mono">
                  PNG ou JPG, até 5 MB (1200×1200px rec.)
                </p>
              </div>

              {/* Miniaturas (56px) */}
              <div className="mt-4 flex items-center gap-3">
                {images.map((imgSrc, index) => {
                  const isPrimary = index === 0
                  return (
                    <div
                      key={index}
                      className={`relative w-14 h-14 rounded-lg bg-surface-1 overflow-hidden shadow-md shrink-0 group ${
                        isPrimary
                          ? 'ring-2 ring-primary'
                          : 'border border-border'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`Foto do produto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isPrimary ? (
                        <div className="absolute bottom-0 inset-x-0 bg-primary text-text-primary font-mono text-[8px] text-center uppercase tracking-tight py-0.5 font-bold">
                          Principal
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          aria-label="Remover imagem"
                          className="absolute inset-0 bg-background/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center text-destructive transition-opacity cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )
                })}

                {/* Botão Adicionar Mais */}
                {images.length < 8 && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.info('Selecione uma imagem do computador para upload.')
                    }}
                    title="Adicionar outra imagem"
                    className="w-14 h-14 rounded-lg bg-surface-1 hover:bg-surface-elevated text-text-muted hover:text-text-primary flex items-center justify-center transition-all shrink-0 border border-border cursor-pointer"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                )}
              </div>
            </section>

            {/* CARD 2: Status e Visibilidade */}
            <section className="rounded-xl bg-surface-2 p-5 border border-border shadow-xl">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cyan-accent" />
                  <h3 className="font-headline text-sm text-text-primary font-semibold">
                    Status e visibilidade
                  </h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-cyan-accent shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
              </div>

              {/* Segmented Control de 3 opções */}
              <div className="p-1 rounded-lg bg-surface-1 flex items-center gap-1 mb-4 border border-border">
                <button
                  type="button"
                  onClick={() => setStatus('ativo')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    status === 'ativo'
                      ? 'bg-surface-elevated text-text-primary shadow-sm ring-1 ring-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Ativo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('rascunho')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    status === 'rascunho'
                      ? 'bg-surface-elevated text-text-primary shadow-sm ring-1 ring-status-warning'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span>Rascunho</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('inativo')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    status === 'inativo'
                      ? 'bg-surface-elevated text-text-primary shadow-sm ring-1 ring-destructive'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span>Inativo</span>
                </button>
              </div>

              {/* Switch: Exibir no catálogo público */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-1 border border-border">
                <div className="flex items-center gap-2.5">
                  <Store className="h-4 w-4 text-primary" />
                  <label
                    htmlFor="toggle-catalog"
                    className="text-xs text-text-primary font-medium cursor-pointer"
                  >
                    Exibir no catálogo público
                  </label>
                </div>
                <Switch
                  id="toggle-catalog"
                  checked={publicCatalog}
                  onCheckedChange={setPublicCatalog}
                />
              </div>
            </section>

            {/* CARD 3: Resumo ao Vivo (Cockpit HUD) */}
            <section className="rounded-xl p-5 shadow-2xl relative overflow-hidden bg-gradient-to-b from-surface-2 to-surface-elevated border border-border ring-1 ring-primary/30">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-primary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  Pré-visualização em tempo real
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-1 font-mono text-[10px] text-text-muted border border-border">
                  LIVE FEED
                </span>
              </div>

              {/* Card do Produto Simulado */}
              <div className="p-3.5 rounded-lg bg-surface-1/90 backdrop-blur-md mb-4 border border-border">
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-lg bg-surface-elevated overflow-hidden shrink-0 border border-border">
                    <img
                      src={
                        images[0] ||
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuDsUyTzo-198ukN88n6g0Xqk5tmBCJLwwQJFBZ0yTxvls6Z6gh124ukxrD0EGuluucxhsfBcIdXVUTFUTzGRVqYQpiwx6I5Suk5X9xdKFr3T7xQ7TNihKucT_ktnuwasnmb7Wo319EDIQi5Jo_C0qJ6dr_4-i_Mk7fHxyxZA67Awd8ycxHqs8EOFwaQy_km4356vpJ4atnKF5cu9X9yyGKGf17bmMERCd8AvN1ObJ6RJCbzmxLyqeZx'
                      }
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-mono text-[11px] text-cyan-accent truncate">
                      {sku || 'SKU-000'}
                    </span>
                    <span className="font-headline text-sm text-text-primary font-semibold truncate leading-snug">
                      {name || 'Nome do Produto'}
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-[15px] font-bold text-text-primary tabular-nums">
                        {formatCurrency(salePrice)}
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-cyan-accent/15 text-cyan-accent border-cyan-accent/30 font-mono text-[10px] font-semibold px-2 py-0.5"
                      >
                        {currentStock > 0 ? 'Em estoque' : 'Esgotado'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Destaque Estatístico Financeiro */}
              <div className="p-4 rounded-lg bg-surface-1/70 border border-border flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary font-medium">
                    Valor total em estoque
                  </span>
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
                <div className="font-headline text-2xl lg:text-[26px] font-bold text-text-primary tracking-tight mt-0.5 tabular-nums">
                  {formatCurrency(totalStockValue)}
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] font-mono text-text-muted pt-2 border-t border-border">
                  <span>
                    {currentStock} un. × {formatCurrency(salePrice)}
                  </span>
                  <span className="text-cyan-accent">
                    Lucro proj.: {formatCurrency(projectedProfit)}
                  </span>
                </div>
              </div>

              {/* Mini Sparkline Decorativo em SVG */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-text-muted">
                <span className="font-mono text-[10px] uppercase">
                  Giro estimado (30d)
                </span>
                <div className="w-24 h-5">
                  <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 100 20">
                    <path
                      d="M0 16 L20 13 L40 15 L60 8 L80 10 L100 2"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <circle cx="100" cy="2" fill="currentColor" r="2.5" />
                  </svg>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* BARRA DE AÇÕES FIXA NO RODAPÉ              */}
      {/* ========================================== */}
      <div className="fixed bottom-0 left-[248px] right-0 h-[72px] bg-surface-1/95 backdrop-blur-md z-40 px-8 flex items-center justify-between shadow-[0_-8px_24px_rgba(0,0,0,0.6)] border-t border-border">
        {/* Indicador Esquerdo de Modificações */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-accent opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-accent" />
          </div>
          <span className="text-sm text-text-primary font-medium">
            Alterações não salvas
          </span>
          <span className="hidden sm:inline-block font-mono text-[11px] text-text-muted ml-1">
            · Última sincronização há 4 min
          </span>
        </div>

        {/* Botões de Ação Direita */}
        <div className="flex items-center gap-3">
          {/* Botão Excluir Produto (Destructive) */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="h-10 px-3.5 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/30 hover:border-destructive/60 text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Excluir produto</span>
          </Button>

          {/* Botão Cancelar */}
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="h-10 px-4 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 text-sm transition-all cursor-pointer"
          >
            Cancelar
          </Button>

          {/* Botão Salvar Rascunho */}
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            className="h-10 px-4 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 text-text-primary border-border text-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4 text-text-muted" />
            <span>Salvar rascunho</span>
          </Button>

          {/* Botão Primário: Salvar Produto */}
          <Button
            type="button"
            onClick={handleSaveProduct}
            className="h-10 px-6 rounded-lg bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold shadow-[0_0_16px_rgba(47,107,255,0.4)] hover:shadow-[0_0_20px_rgba(47,107,255,0.6)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Salvar produto</span>
          </Button>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-surface-2 border border-border p-6 shadow-2xl">
          <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
            <div className="w-11 h-11 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="font-headline text-lg font-bold text-text-primary">
                Excluir este produto?
              </DialogTitle>
              <DialogDescription className="text-xs text-text-secondary mt-0.5">
                Esta ação não pode ser desfeita no catálogo.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="p-3.5 rounded-lg bg-surface-1 border border-border my-2 text-xs text-text-secondary leading-relaxed">
            <p>
              O produto <strong className="text-text-primary">{name}</strong> (
              <span className="font-mono text-primary">{sku}</span>) e seus vínculos com o
              estoque serão permanentemente removidos de todos os canais de venda.
            </p>
          </div>

          <DialogFooter className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="h-10 px-4 rounded-lg bg-surface-elevated text-text-primary border-border hover:bg-surface-elevated/80 text-sm cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfirm}
              className="h-10 px-5 rounded-lg bg-destructive hover:bg-destructive/90 text-text-primary text-sm font-semibold shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Sim, excluir</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
