import { useState, type FormEvent } from 'react'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  X,
  ShieldCheck,
  CloudUpload,
  Users2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/context'
import { toast } from 'sonner'

interface LoginViewProps {
  onLoginSuccess?: () => void
  initialErrorState?: boolean
}

export function LoginView({
  onLoginSuccess,
  initialErrorState = false,
}: LoginViewProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState(
    initialErrorState ? 'rodrigo.silveira@nexora.io' : 'rodrigo.s@nexora.io'
  )
  const [password, setPassword] = useState(
    initialErrorState ? 'SenhaIncorreta123' : 'CockpitMaster2026!'
  )
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [hasError, setHasError] = useState(initialErrorState)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setHasError(true)
      toast.error('Preencha todos os campos obrigatórios.')
      return
    }

    setIsLoading(true)
    const success = await login(email, password)
    setIsLoading(false)

    if (!success) {
      setHasError(true)
      toast.error('Credenciais inválidas.')
      return
    }

    setHasError(false)
    toast.success('Autenticação realizada com sucesso! Bem-vindo ao Nexora.')
    onLoginSuccess?.()
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    toast.info('Autenticação via Google Workspace corporativo iniciada...')
    const success = await login('rodrigo.s@nexora.io', 'CockpitMaster2026!')
    setIsLoading(false)
    if (success) {
      toast.success('Acesso corporativo concedido via Google SSO.')
      onLoginSuccess?.()
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background font-sans text-text-primary antialiased select-none flex">
      {/* Botão de Toggle rápido de demonstração (Tela 5 Normal vs Tela 6 Erro) */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const next = !hasError
            setHasError(next)
            if (next) {
              setEmail('rodrigo.silveira@nexora.io')
              setPassword('SenhaIncorreta123')
              toast.error('Modo Tela 6: Erro de Validação ativado')
            } else {
              setEmail('rodrigo.s@nexora.io')
              setPassword('CockpitMaster2026!')
              toast.info('Modo Tela 5: Estado Normal ativado')
            }
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
            hasError
              ? 'bg-destructive/15 text-destructive border-destructive/40 shadow-[0_0_12px_rgba(242,85,90,0.3)]'
              : 'bg-surface-elevated text-text-secondary border-border hover:text-text-primary'
          }`}
          title="Alternar entre Tela 5 (Normal) e Tela 6 (Erro de validação)"
        >
          {hasError ? '● Exibindo: Tela 6 (Erro)' : '○ Exibindo: Tela 5 (Normal)'}
        </button>
      </div>

      {/* ======================================================== */}
      {/* COLUNA ESQUERDA (40% - ~576px em 1440px)                */}
      {/* ======================================================== */}
      <section
        className="relative flex h-full w-full lg:w-[40%] lg:min-w-[480px] lg:max-w-[600px] flex-col justify-between px-8 sm:px-14 py-8 bg-background z-10 shrink-0"
        aria-label="Acesso à conta"
      >
        {/* Bloco Central do Formulário (400px de largura máxima) */}
        <div className="my-auto mx-auto w-full max-w-[400px]">
          {/* 1. Header do Bloco: Logo Nexora */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary shadow-[0_0_24px_rgba(47,107,255,0.35)] shrink-0">
              <svg
                className="h-5 w-5 text-text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 20V4l14 16V4" />
              </svg>
            </div>
            <span className="font-headline text-[20px] font-bold tracking-tight text-text-primary">
              Nexora
            </span>
            <span className="ml-2 rounded-full border border-border bg-surface-1 px-2 py-0.5 font-mono text-[11px] text-text-muted">
              v1.0
            </span>
          </div>

          {/* 2. Título & Subtítulo */}
          <div className={`${hasError ? 'mt-12 mb-6' : 'mt-14 mb-8'}`}>
            <h1 className="font-headline text-[32px] font-bold leading-tight tracking-[-0.02em] text-text-primary">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Entre com sua conta para acessar o painel
            </p>
          </div>

          {/* Banner de Erro em Destaque (Tela 6) */}
          {hasError && (
            <div
              className="flex items-start gap-3 rounded-[10px] border border-destructive/40 bg-destructive/10 p-3.5 mb-5"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
              <div className="text-[13px] leading-snug text-text-primary">
                E-mail ou senha incorretos. Verifique os dados e tente novamente.
              </div>
            </div>
          )}

          {/* Formulário de Login */}
          <form id="loginForm" className="space-y-4" onSubmit={handleSubmit}>
            {/* 3. Campo E-mail */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-text-secondary">
                E-mail corporativo
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted transition-colors duration-150 group-focus-within:text-primary">
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  tabIndex={1}
                  placeholder="voce@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-[10px] bg-surface-1 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted border border-border transition-all duration-150 focus:border-primary focus:bg-surface-1 focus:ring-4 focus:ring-primary/20 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* 4. Campo Senha */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className={`block text-xs font-medium ${
                    hasError ? 'text-destructive' : 'text-text-secondary'
                  }`}
                >
                  Senha de acesso
                </label>
                <a
                  href="#recuperar-senha"
                  tabIndex={4}
                  onClick={(e) => {
                    e.preventDefault()
                    toast.info('Instruções de recuperação enviadas para o e-mail.')
                  }}
                  className="text-xs font-medium text-primary hover:underline hover:text-cyan-accent transition-colors duration-150"
                >
                  Esqueci minha senha
                </a>
              </div>
              <div className="relative group">
                <div
                  className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors duration-150 ${
                    hasError ? 'text-destructive' : 'text-text-muted group-focus-within:text-primary'
                  }`}
                >
                  <Lock className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  tabIndex={2}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-12 rounded-[10px] bg-surface-1 pl-11 pr-11 text-sm text-text-primary placeholder:text-text-muted transition-all duration-150 focus:outline-none ${
                    hasError
                      ? 'border border-destructive ring-2 ring-destructive/20 focus:border-destructive focus:ring-4 focus:ring-destructive/25'
                      : 'border border-border focus:border-primary focus:bg-surface-1 focus:ring-4 focus:ring-primary/20'
                  }`}
                  required
                />
                <button
                  type="button"
                  tabIndex={3}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Alternar visibilidade da senha"
                  className={`absolute inset-y-0 right-0 flex items-center pr-3.5 transition-colors duration-150 cursor-pointer ${
                    hasError
                      ? 'text-destructive hover:text-text-primary'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={1.75} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={1.75} />
                  )}
                </button>
              </div>

              {/* Mensagem de Erro Específica da Senha (Tela 6) */}
              {hasError && (
                <p className="text-xs text-destructive flex items-center gap-1.5 pt-0.5 font-medium">
                  <X className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                  <span>A senha informada não confere com o cadastro deste usuário.</span>
                </p>
              )}
            </div>

            {/* 5. Manter conectado */}
            <div className="flex items-center pt-1 pb-1">
              <label className="relative flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  id="remember"
                  tabIndex={5}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-[18px] w-[18px] rounded-[5px] border border-border-highlight bg-surface-1 transition-all duration-150 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                  <svg
                    className={`h-3 w-3 text-text-primary transition-opacity duration-150 ${
                      rememberMe ? 'opacity-100' : 'opacity-0'
                    }`}
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="2.5 6 4.8 8.5 9.5 3.5" />
                  </svg>
                </div>
                <span className="text-[13px] text-text-secondary">
                  Manter conectado por 30 dias
                </span>
              </label>
            </div>

            {/* 6. Botão Primário "Entrar" */}
            <Button
              type="submit"
              id="submitBtn"
              tabIndex={6}
              disabled={isLoading}
              className="group relative flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-6 text-[15px] font-semibold text-text-primary shadow-[0_0_24px_rgba(47,107,255,0.35)] transition-all duration-150 hover:bg-primary-hover hover:shadow-[0_0_32px_rgba(76,130,255,0.5)] hover:-translate-y-0.5 active:scale-[0.98] active:bg-primary-pressed cursor-pointer"
            >
              <span>{isLoading ? 'Autenticando...' : 'Entrar no cockpit'}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>

            {/* 7. Divisor "ou" */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="absolute bg-background px-3 font-sans text-xs text-text-muted">
                ou
              </span>
            </div>

            {/* Botão Secundário Google Monocromático */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="group flex h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-border-highlight bg-transparent text-sm font-medium text-text-primary transition-all duration-150 hover:bg-surface-elevated hover:border-primary/40 active:scale-[0.98] cursor-pointer"
            >
              <svg
                className="h-4 w-4 text-text-secondary group-hover:text-text-primary transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              <span>Entrar com conta corporativa Google</span>
            </Button>
          </form>

          {/* 8. Fale com o Administrador */}
          <div className="mt-8 text-center">
            <p className="text-[13px] text-text-secondary">
              Não tem acesso?
              <a
                href="#suporte"
                onClick={(e) => {
                  e.preventDefault()
                  toast.info('Canal de suporte ao administrador aberto.')
                }}
                className="font-medium text-primary hover:underline hover:text-cyan-accent transition-colors ml-1"
              >
                Fale com o administrador
              </a>
            </p>
          </div>
        </div>

        {/* 9. Rodapé Fixo da Coluna Esquerda */}
        <footer className="mt-auto flex items-center justify-between pt-6 border-t border-border/60 text-xs text-text-muted">
          <div>© 2026 Nexora Tecnologia S.A.</div>
          <div className="flex items-center gap-4">
            <a href="#suporte" className="hover:text-text-secondary transition-colors">
              Suporte
            </a>
            <span className="text-border">•</span>
            <a href="#privacidade" className="hover:text-text-secondary transition-colors">
              Privacidade
            </a>
            <span className="text-border">•</span>
            <a href="#termos" className="hover:text-text-secondary transition-colors">
              Termos
            </a>
          </div>
        </footer>
      </section>

      {/* ======================================================== */}
      {/* COLUNA DIREITA — PAINEL DE MARCA (60% - ~864px em 1440px) */}
      {/* ======================================================== */}
      <section
        className="relative hidden lg:flex h-full w-[60%] flex-col justify-between overflow-hidden border-l border-border bg-gradient-to-tr from-[#0A1230] via-[#070B1A] to-background p-14 select-none"
        aria-label="Apresentação Nexora Cockpit"
      >
        {/* Grade de Pontos Discreta com Máscara Radial */}
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-75" />

        {/* Luz Difusa Azul Atmosférica */}
        <div className="pointer-events-none absolute right-[15%] top-[25%] h-[520px] w-[520px] rounded-full bg-primary/20 blur-[120px]" />

        {/* Topo do Painel de Marca: Tagline Status */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/80 px-3.5 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-status-success shadow-[0_0_8px_#34D399]" />
            <span className="font-mono text-[11px] font-medium tracking-wide text-text-secondary">
              SISTEMAS ONLINE · 99.98% UPTIME
            </span>
          </div>
          <div className="text-xs font-mono text-text-muted">ENC: AES-256 GCM</div>
        </div>

        {/* COMPOSIÇÃO CENTRAL: Fragmento do Dashboard em Perspectiva Suave */}
        <div className="perspective-container relative z-10 my-auto flex w-full items-center justify-center pl-6">
          <div className="tilted-dashboard relative w-[640px] rounded-[16px] border border-border bg-surface-2/95 p-6 backdrop-blur-xl">
            {/* Barra superior do mockup com window controls e breadcrumb */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-status-error/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-status-warning/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-status-success/60" />
                <span className="ml-2 font-mono text-[11px] text-text-muted">
                  dashboard.nexora.app / cockpit-live
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-surface-elevated px-2 py-0.5 font-mono text-[10px] text-cyan-accent">
                  LIVE FEED
                </span>
              </div>
            </div>

            {/* Linha de KPIs compactos */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {/* KPI 1: Faturamento */}
              <div className="rounded-[10px] border border-border bg-surface-1 p-3.5">
                <div className="flex items-center justify-between text-[11px] text-text-secondary">
                  <span>Faturamento Total</span>
                  <span className="text-cyan-accent">Hoje</span>
                </div>
                <div className="mt-1 font-headline text-[22px] font-bold tracking-tight text-text-primary tabular-nums">
                  R$ 148.920,50
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-status-success/10 px-1.5 py-0.5 text-[10px] font-medium text-status-success">
                    ↑ +12,4%
                  </span>
                  <span className="text-[10px] text-text-muted">vs. período anterior</span>
                </div>
              </div>

              {/* KPI 2: Vendas Realizadas */}
              <div className="rounded-[10px] border border-border bg-surface-1 p-3.5">
                <div className="flex items-center justify-between text-[11px] text-text-secondary">
                  <span>Vendas Realizadas</span>
                  <span className="text-status-success">1.284 un</span>
                </div>
                <div className="mt-1 font-headline text-[22px] font-bold tracking-tight text-text-primary tabular-nums">
                  1.284
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-status-success/10 px-1.5 py-0.5 text-[10px] font-medium text-status-success">
                    ↑ +8,1%
                  </span>
                  <span className="text-[10px] text-text-muted">conversão 4.2%</span>
                </div>
              </div>
            </div>

            {/* Mini Gráfico de Linha Vetorial com Gradiente Azul */}
            <div className="mt-4 rounded-[10px] border border-border bg-surface-1 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-text-secondary">
                  Fluxo de vendas (últimos 7 dias)
                </span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1 text-cyan-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-accent" /> Receita
                  </span>
                  <span className="flex items-center gap-1 text-text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-text-muted" /> Meta
                  </span>
                </div>
              </div>

              <div className="relative h-20 w-full">
                {/* SVG Sparkline & Area */}
                <svg
                  className="h-full w-full overflow-visible"
                  viewBox="0 0 560 80"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartGradAuth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  <line
                    x1="0"
                    y1="20"
                    x2="560"
                    y2="20"
                    stroke="#1B2540"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="0"
                    y1="50"
                    x2="560"
                    y2="50"
                    stroke="#1B2540"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  {/* Area */}
                  <polygon
                    points="0,65 70,55 140,58 210,40 280,48 350,30 420,38 490,15 560,8 560,80 0,80"
                    fill="url(#chartGradAuth)"
                  />
                  {/* Line */}
                  <polyline
                    points="0,65 70,55 140,58 210,40 280,48 350,30 420,38 490,15 560,8"
                    fill="none"
                    stroke="#2F6BFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Active dot */}
                  <circle
                    cx="490"
                    cy="15"
                    r="4"
                    fill="#38BDF8"
                    stroke="#0E1526"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Mini Tabela de Transações Recentes (3 linhas) */}
            <div className="mt-4 overflow-hidden rounded-[10px] border border-border bg-surface-1">
              <table className="w-full text-left text-[11px]">
                <thead className="border-b border-border bg-surface-2 text-text-muted">
                  <tr>
                    <th className="py-2 px-3 font-medium">SKU / Pedido</th>
                    <th className="py-2 px-3 font-medium">Item</th>
                    <th className="py-2 px-3 font-medium text-right">Valor</th>
                    <th className="py-2 px-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-text-secondary">
                  <tr>
                    <td className="py-2 px-3 font-mono text-text-primary">#10482</td>
                    <td className="py-2 px-3 text-text-primary">Fone Pulse X2 (2x)</td>
                    <td className="py-2 px-3 text-right font-mono text-text-primary tabular-nums">
                      R$ 499,80
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-status-success/10 px-2 py-0.5 text-[10px] font-medium text-status-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-status-success" /> Pago
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono text-text-primary">#10481</td>
                    <td className="py-2 px-3 text-text-primary">Teclado ErgoPro</td>
                    <td className="py-2 px-3 text-right font-mono text-text-primary tabular-nums">
                      R$ 540,00
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-status-success/10 px-2 py-0.5 text-[10px] font-medium text-status-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-status-success" /> Pago
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono text-text-primary">#10480</td>
                    <td className="py-2 px-3 text-text-primary">Hub USB-C 8 em 1</td>
                    <td className="py-2 px-3 text-right font-mono text-text-primary tabular-nums">
                      R$ 1.280,40
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-status-warning/10 px-2 py-0.5 text-[10px] font-medium text-status-warning">
                        <span className="h-1.5 w-1.5 rounded-full bg-status-warning" /> Pendente
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Highlight interno no topo do card */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* TEXTO DE MARCA & BADGES DE CONFIANÇA (Canto Inferior Esquerdo) */}
        <div className="relative z-10 max-w-[460px] pt-4">
          <h2 className="font-headline text-[28px] font-semibold leading-[1.25] tracking-[-0.02em] text-text-primary">
            Controle total do seu negócio, em um só lugar.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Vendas, estoque e equipe com clareza em tempo real.
          </p>

          {/* 3 Indicadores de Confiança separados por divisores */}
          <div className="mt-6 flex items-center gap-4 border-t border-border pt-5 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Dados criptografados</span>
            </div>

            <span className="h-3 w-[1px] bg-border" />

            <div className="flex items-center gap-2">
              <CloudUpload className="h-4 w-4 text-primary" />
              <span>Backup diário</span>
            </div>

            <span className="h-3 w-[1px] bg-border" />

            <div className="flex items-center gap-2">
              <Users2 className="h-4 w-4 text-primary" />
              <span>Acesso por perfil</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
