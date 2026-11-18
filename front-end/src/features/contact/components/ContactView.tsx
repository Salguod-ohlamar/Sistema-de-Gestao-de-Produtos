import { useState, type FormEvent } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ApiError, submitContact } from '@/lib/api'

interface ContactViewProps {
  onBack: () => void
}

// Componente React responsável por renderizar contact view.
export function ContactView({ onBack }: ContactViewProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company_name: '',
    website: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Atualiza ou altera update, aplicando os dados recebidos.
  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError(null)
  }

  // Processa a ação ou o evento associado a handle submit.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await submitContact({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        company_name: form.company_name.trim(),
      })
      setSubmitted(true)
    } catch (submitError) {
      setError(
        submitError instanceof ApiError
          ? submitError.message
          : 'Não foi possível enviar sua mensagem.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-text-primary">
      <section className="mx-auto max-w-lg">
        <Button type="button" variant="ghost" onClick={onBack} className="mb-5 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao login
        </Button>
        <div className="rounded-2xl border border-border bg-surface-1 p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-headline text-2xl font-bold">Fale com a equipe</h1>
              <p className="mt-1 text-sm text-text-muted">
                Envie seus dados e retornaremos pelo contato informado.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="space-y-4" role="status">
              <p className="rounded-lg border border-cyan-accent/30 bg-cyan-accent/10 p-4 text-sm text-text-primary">
                Mensagem enviada. Obrigado pelo contato.
              </p>
              <Button type="button" onClick={onBack}>Voltar ao login</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                Nome
                <Input
                  required
                  minLength={2}
                  maxLength={120}
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                />
              </label>
              <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                Empresa
                <Input
                  required
                  minLength={2}
                  maxLength={160}
                  value={form.company_name}
                  onChange={(event) => update('company_name', event.target.value)}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                  E-mail
                  <Input
                    type="email"
                    required
                    maxLength={160}
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => update('email', event.target.value)}
                  />
                </label>
                <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                  Telefone com DDD
                  <Input
                    type="tel"
                    required
                    maxLength={20}
                    value={form.phone}
                    onChange={(event) => update('phone', event.target.value)}
                  />
                </label>
              </div>
              <label className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                Site
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) => update('website', event.target.value)}
                />
              </label>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
