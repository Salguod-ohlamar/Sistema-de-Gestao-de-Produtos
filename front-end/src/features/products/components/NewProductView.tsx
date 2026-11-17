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
  Eye,
  Store,
  Wallet,
  CheckCircle2,
  Save,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { formatCurrency } from '@/lib/utils/formatters'
import { ApiError } from '@/lib/api'
import { toast } from 'sonner'
import { useCreateProduct } from '../hooks/useCreateProduct'
import {
  BARCODE_MAX_LENGTH,
  EMPTY_PRODUCT_FORM,
  buildCreateProductPayload,
  parseNumber,
  validateNewProduct,
  type NewProductForm,
} from '../newProductForm'

interface NewProductViewProps {
  onBack?: () => void
}

const NOT_AVAILABLE = 'ainda não está disponível'

function notAvailable(feature: string) {
  toast.info(`${feature} ${NOT_AVAILABLE}.`)
}

/** Número do input para os cálculos ao vivo (inválido/vazio conta como 0). */
function toNumber(value: string): number {
  const n = parseNumber(value)
  return Number.isFinite(n) ? n : 0
}

export function NewProductView({ onBack }: NewProductViewProps) {
  const createProduct = useCreateProduct()
  const isSaving = createProduct.isPending

  // Estado do Formulário (começa vazio)
  const [name, setName] = useState(EMPTY_PRODUCT_FORM.name)
  const [sku, setSku] = useState(EMPTY_PRODUCT_FORM.sku)
  const [barcode, setBarcode] = useState(EMPTY_PRODUCT_FORM.barcode)
  const [category, setCategory] = useState(EMPTY_PRODUCT_FORM.category)
  const [brand, setBrand] = useState(EMPTY_PRODUCT_FORM.brand)
  const [salePriceInput, setSalePriceInput] = useState(EMPTY_PRODUCT_FORM.salePrice)
  const [costPriceInput, setCostPriceInput] = useState(EMPTY_PRODUCT_FORM.costPrice)
  const [currentStockInput, setCurrentStockInput] = useState(EMPTY_PRODUCT_FORM.currentStock)
  const [minStockInput, setMinStockInput] = useState(EMPTY_PRODUCT_FORM.minStock)
  const [unit, setUnit] = useState(EMPTY_PRODUCT_FORM.unit)

  const salePrice = toNumber(salePriceInput)
  const costPrice = toNumber(costPriceInput)
  const currentStock = toNumber(currentStockInput)
  const minStock = toNumber(minStockInput)

  // Cálculos financeiros e de estoque
  const marginPercent =
    salePrice > 0 ? (((salePrice - costPrice) / salePrice) * 100).toFixed(1) : '0,0'
  const markup = costPrice > 0 ? (salePrice / costPrice).toFixed(2) : '0,00'
  const totalStockValue = currentStock * salePrice
  const projectedProfit = currentStock * (salePrice - costPrice)
  // Aviso (não bloqueia): o produto já entraria com estoque baixo
  const isStockMinError = minStockInput !== '' && minStock > currentStock

  // Contador de campos mandatórios (6 campos obrigatórios)
  const mandatoryCount = [
    name.trim().length > 0,
    sku.trim().length > 0,
    category.trim().length > 0,
    salePrice > 0,
    currentStockInput.trim() !== '' && currentStock >= 0,
    minStockInput.trim() !== '' && minStock >= 0,
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

  const handleSaveProduct = () => {
    if (isSaving) return

    const form: NewProductForm = {
      name,
      sku,
      category,
      brand,
      barcode,
      unit,
      salePrice: salePriceInput,
      costPrice: costPriceInput,
      currentStock: currentStockInput,
      minStock: minStockInput,
    }
    const validationError = validateNewProduct(form)
    if (validationError) {
      toast.error(validationError)
      return
    }

    createProduct.mutate(buildCreateProductPayload(form), {
      onSuccess: (product) => {
        toast.success(`Produto ${product?.name ?? form.name.trim()} cadastrado com sucesso.`)
        onBack?.()
      },
      onError: (error) => {
        toast.error(
          error instanceof ApiError ? error.message : 'Não foi possível salvar o produto.'
        )
      },
    })
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
                    placeholder="Ex.: Caneta esferográfica azul"
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
                      Código de barras (até {BARCODE_MAX_LENGTH} dígitos)
                    </label>
                    <div className="relative flex items-center">
                      <Barcode className="absolute left-3 text-text-muted h-4 w-4" />
                      <input
                        id="product-barcode"
                        type="text"
                        inputMode="numeric"
                        maxLength={BARCODE_MAX_LENGTH}
                        placeholder="Opcional"
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
                        <option value="" disabled>
                          Selecione a categoria
                        </option>
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
                      placeholder="Opcional"
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
                      {NOT_AVAILABLE}
                    </span>
                  </div>
                  <textarea
                    id="product-desc"
                    rows={3}
                    disabled
                    placeholder={`A descrição do produto ${NOT_AVAILABLE}.`}
                    className="w-full min-h-[88px] p-3.5 bg-surface-1 rounded-lg text-text-primary text-sm placeholder:text-text-muted border border-border resize-none leading-relaxed opacity-60 cursor-not-allowed"
                  />
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
                        min="0"
                        placeholder="0,00"
                        value={salePriceInput}
                        onChange={(e) => setSalePriceInput(e.target.value)}
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
                        min="0"
                        placeholder="0,00"
                        value={costPriceInput}
                        onChange={(e) => setCostPriceInput(e.target.value)}
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
                        Desconto por produto no PDV {NOT_AVAILABLE}.
                      </p>
                    </div>
                  </div>
                  <Switch id="toggle-discount" checked={false} disabled className="ml-4" />
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
                        step="1"
                        min="0"
                        placeholder="0"
                        value={currentStockInput}
                        onChange={(e) => setCurrentStockInput(e.target.value)}
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
                        step="1"
                        min="0"
                        placeholder="0"
                        value={minStockInput}
                        onChange={(e) => setMinStockInput(e.target.value)}
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
                        <span>Estoque atual abaixo do mínimo: o produto entra como estoque baixo</span>
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
                        <option value="UN">un (Unidade)</option>
                        <option value="CX">cx (Caixa)</option>
                        <option value="PCT">pct (Pacote)</option>
                        <option value="KG">kg (Quilograma)</option>
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
                        O produto aparece como “Estoque baixo” em Produtos e no Dashboard ao
                        atingir o mínimo. Notificações automáticas {NOT_AVAILABLE}.
                      </p>
                    </div>
                  </div>
                  <Switch id="toggle-alert" checked={false} disabled className="ml-4" />
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
              </div>

              {/* Upload de imagem: sem suporte no backend */}
              <button
                type="button"
                onClick={() => notAvailable('O envio de imagem')}
                aria-disabled="true"
                className="w-full h-36 rounded-xl bg-surface-1 p-4 flex flex-col items-center justify-center text-center relative overflow-hidden border border-dashed border-border-highlight opacity-60 cursor-not-allowed"
              >
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary mb-2.5">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm text-text-primary font-semibold leading-snug">
                  Envio de imagem
                </p>
                <p className="text-[11px] text-text-muted mt-1 font-mono">{NOT_AVAILABLE}</p>
              </button>
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

              {/* O backend cadastra todo produto como ativo e disponível no PDV */}
              <div className="p-3 rounded-lg bg-surface-1 flex items-center gap-2 mb-4 border border-border text-xs">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-text-primary font-semibold">Ativo</span>
                <span className="text-text-muted">· disponível no PDV após salvar</span>
              </div>

              {/* Switch: Exibir no catálogo público (sem suporte no backend) */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-1 border border-border opacity-60">
                <div className="flex items-center gap-2.5">
                  <Store className="h-4 w-4 text-primary" />
                  <label htmlFor="toggle-catalog" className="text-xs text-text-primary font-medium">
                    Catálogo público{' '}
                    <span className="text-text-muted font-normal">({NOT_AVAILABLE})</span>
                  </label>
                </div>
                <Switch id="toggle-catalog" checked={false} disabled />
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
                  <div className="w-14 h-14 rounded-lg bg-surface-elevated overflow-hidden shrink-0 border border-border flex items-center justify-center text-text-muted">
                    <Package className="h-6 w-6" strokeWidth={1.5} />
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
            </section>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* BARRA DE AÇÕES FIXA NO RODAPÉ              */}
      {/* ========================================== */}
      <div className="fixed bottom-0 left-[248px] right-0 h-[72px] bg-surface-1/95 backdrop-blur-md z-40 px-8 flex items-center justify-between shadow-[0_-8px_24px_rgba(0,0,0,0.6)] border-t border-border">
        {/* Indicador Esquerdo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-accent" />
          </div>
          <span className="text-sm text-text-primary font-medium">
            {isSaving ? 'Salvando produto…' : 'Produto ainda não salvo'}
          </span>
        </div>

        {/* Botões de Ação Direita */}
        <div className="flex items-center gap-3">
          {/* Botão Cancelar */}
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={isSaving}
            className="h-10 px-4 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 text-sm transition-all cursor-pointer"
          >
            Cancelar
          </Button>

          {/* Botão Salvar Rascunho (sem suporte no backend) */}
          <Button
            type="button"
            variant="outline"
            onClick={() => notAvailable('Salvar rascunho')}
            aria-disabled="true"
            title={`Salvar rascunho ${NOT_AVAILABLE}`}
            className="h-10 px-4 rounded-lg bg-surface-elevated text-text-primary border-border text-sm transition-all flex items-center gap-1.5 opacity-60 cursor-not-allowed"
          >
            <Save className="h-4 w-4 text-text-muted" />
            <span>Salvar rascunho</span>
          </Button>

          {/* Botão Primário: Salvar Produto */}
          <Button
            type="button"
            onClick={handleSaveProduct}
            disabled={isSaving}
            className="h-10 px-6 rounded-lg bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold shadow-[0_0_16px_rgba(47,107,255,0.4)] hover:shadow-[0_0_20px_rgba(47,107,255,0.6)] transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <span>{isSaving ? 'Salvando…' : 'Salvar produto'}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
