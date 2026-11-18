import { useState, type FormEvent } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ApiError, requestPasswordReset } from '@/lib/api'

interface ForgotPasswordViewProps {
  onBack: () => void
}

// Componente React responsável por renderizar forgot password view.
export function ForgotPasswordView({ onBack }: ForgotPasswordViewProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Processa a ação ou o evento associado a handle submit.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await requestPasswordReset(email.trim())
      setSubmitted(true)
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Não foi possível solicitar a redefinição de senha.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-text-primary">
      <section className="mx-auto max-w-md rounded-2xl border border-border bg-surface-1 p-6 shadow-xl sm:p-8">
        <Button type="button" variant="ghost" onClick={onBack} className="mb-5 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao login
        </Button>
        <div className="mb-6 flex items-center gap-3">
          <Mail className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-2xl font-bold">Recuperar senha</h1>
        </div>
        {submitted ? (
          <p role="status" className="text-sm text-text-secondary">
            Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha. O link
            expira em 60 minutos.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-text-secondary">
              Informe o e-mail da conta. Enviaremos um link para criar uma nova senha.
            </p>
            {error && (
              <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}
            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
              E-mail
              <Input
                type="email"
                autoComplete="email"
                required
                maxLength={100}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Enviando solicitação...' : 'Enviar link de recuperação'}
            </Button>
          </form>
        )}
      </section>
    </main>
  )
}
