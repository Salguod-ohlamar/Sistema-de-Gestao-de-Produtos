import { useState, type FormEvent } from 'react'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ApiError, resetPassword } from '@/lib/api'

interface PasswordResetViewProps {
  token: string
  onBack: () => void
  onCompleted: () => void
}

// Componente React responsável por renderizar password reset view.
export function PasswordResetView({ token, onBack, onCompleted }: PasswordResetViewProps) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Processa a ação ou o evento associado a handle submit.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    if (password !== confirmation) {
      setError('As senhas informadas não coincidem.')
      return
    }

    setIsSubmitting(true)
    try {
      await resetPassword(token, password)
      onCompleted()
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Não foi possível redefinir a senha.'
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
          <LockKeyhole className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-2xl font-bold">Criar nova senha</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
            Nova senha
            <Input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
            Confirmar nova senha
            <Input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
          </label>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
          </Button>
        </form>
      </section>
    </main>
  )
}
