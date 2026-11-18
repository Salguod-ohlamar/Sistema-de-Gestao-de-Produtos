import { useState, type FormEvent } from 'react'
import { ArrowLeft, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/context'
import type { CompanyRegistrationInput } from '@/lib/api'

interface CompanyRegistrationViewProps {
  onBack: () => void
  onRegistered: () => void
}

const segments: { value: CompanyRegistrationInput['segment']; label: string }[] = [
  { value: 'technology', label: 'Tecnologia' },
  { value: 'retail', label: 'Varejo' },
  { value: 'services', label: 'Serviços' },
  { value: 'industry', label: 'Indústria' },
]

// Componente React responsável por renderizar company registration view.
export function CompanyRegistrationView({
  onBack,
  onRegistered,
}: CompanyRegistrationViewProps) {
  const { registerCompany, loginError } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    trade_name: '',
    legal_name: '',
    email: '',
    cnpj: '',
    phone: '',
    segment: '' as CompanyRegistrationInput['segment'] | '',
    password: '',
    passwordConfirmation: '',
  })

  // Atualiza ou altera update, aplicando os dados recebidos.
  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setFormError(null)
  }

  // Processa a ação ou o evento associado a handle submit.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cnpj = form.cnpj.replace(/\D/g, '')
    const phone = form.phone.replace(/\D/g, '')
    if (cnpj.length !== 14) {
      setFormError('O CNPJ deve conter 14 dígitos.')
      return
    }
    if (![10, 11].includes(phone.length)) {
      setFormError('Informe um telefone com DDD e 10 ou 11 dígitos.')
      return
    }
    if (form.password !== form.passwordConfirmation) {
      setFormError('As senhas informadas não coincidem.')
      return
    }
    if (!form.segment) {
      setFormError('Selecione o segmento da empresa.')
      return
    }

    setIsSubmitting(true)
    const success = await registerCompany({
      trade_name: form.trade_name.trim(),
      legal_name: form.legal_name.trim(),
      email: form.email.trim(),
      cnpj,
      phone,
      segment: form.segment,
      password: form.password,
    })
    setIsSubmitting(false)
    if (success) onRegistered()
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-text-primary">
      <section className="mx-auto max-w-xl">
        <Button type="button" variant="ghost" onClick={onBack} className="mb-5 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao login
        </Button>
        <div className="rounded-2xl border border-border bg-surface-1 p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-headline text-2xl font-bold">Cadastrar empresa</h1>
              <p className="mt-1 text-sm text-text-muted">
                Envie os dados da empresa para análise da administração central.
              </p>
            </div>
          </div>

          {(formError || loginError) && (
            <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
              {formError ?? loginError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
              Nome fantasia
              <Input
                required
                maxLength={255}
                value={form.trade_name}
                onChange={(event) => update('trade_name', event.target.value)}
              />
            </label>
            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
              Razão social
              <Input
                required
                maxLength={255}
                value={form.legal_name}
                onChange={(event) => update('legal_name', event.target.value)}
              />
            </label>
            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
              E-mail corporativo
              <Input
                required
                type="email"
                maxLength={100}
                autoComplete="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                CNPJ
                <Input
                  required
                  inputMode="numeric"
                  maxLength={18}
                  value={form.cnpj}
                  onChange={(event) => update('cnpj', event.target.value)}
                  placeholder="14 dígitos"
                />
              </label>
              <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                Telefone
                <Input
                  required
                  type="tel"
                  inputMode="tel"
                  maxLength={20}
                  value={form.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  placeholder="Com DDD"
                />
              </label>
            </div>
            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
              Segmento
              <select
                required
                value={form.segment}
                onChange={(event) => update('segment', event.target.value)}
                className="h-11 w-full rounded-[10px] border border-border bg-surface-1 px-3.5 text-sm text-text-primary"
              >
                <option value="" disabled>Selecione</option>
                {segments.map((segment) => (
                  <option key={segment.value} value={segment.value}>
                    {segment.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                Senha
                <Input
                  required
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={form.password}
                  onChange={(event) => update('password', event.target.value)}
                />
              </label>
              <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                Confirmar senha
                <Input
                  required
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={form.passwordConfirmation}
                  onChange={(event) => update('passwordConfirmation', event.target.value)}
                />
              </label>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Enviando cadastro...' : 'Enviar cadastro para aprovação'}
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
