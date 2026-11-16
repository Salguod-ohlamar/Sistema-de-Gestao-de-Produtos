import { useState, type FormEvent } from 'react'
import { Loader2, UserPlus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/context'
import {
  useCreateCollaborator,
  useUpdateCollaborator,
} from '@/features/company/hooks/useCompanyWorkspace'
import { ApiError, type CollaboratorRole, type CompanyCollaborator } from '@/lib/api'
import { toast } from 'sonner'

interface UserDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collaborator?: CompanyCollaborator | null
  onSuccess?: () => void
}

function localDateString() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function roleLabel(role: CollaboratorRole) {
  if (role === 'administrator') return 'Administrador'
  if (role === 'manager') return 'Gerente'
  return 'Operador / Vendedor'
}

export function UserDrawer({
  open,
  onOpenChange,
  collaborator = null,
  onSuccess,
}: UserDrawerProps) {
  const { user } = useAuth()
  const companyId = user?.principalType === 'root' ? null : user?.id ?? null
  const createMutation = useCreateCollaborator(companyId)
  const updateMutation = useUpdateCollaborator(companyId)
  const isEditing = collaborator !== null
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const [name, setName] = useState(collaborator?.name ?? '')
  const [email, setEmail] = useState(collaborator?.email ?? '')
  const [cpf, setCpf] = useState(collaborator?.cpf ?? '')
  const [phone, setPhone] = useState(collaborator?.phone ?? '')
  const [hireDate, setHireDate] = useState(
    collaborator?.hire_date.slice(0, 10) ?? localDateString()
  )
  const [role, setRole] = useState<CollaboratorRole>(collaborator?.role ?? 'manager')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      if (collaborator) {
        await updateMutation.mutateAsync({
          id: collaborator.id,
          input: { name: name.trim(), role, phone: phone || null },
        })
        toast.success('Colaborador atualizado.')
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          email: email.trim(),
          cpf,
          phone: phone || null,
          hire_date: hireDate,
          role,
          is_admin: role === 'administrator',
          password,
        })
        toast.success('Colaborador cadastrado.')
      }
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Não foi possível ${isEditing ? 'atualizar' : 'cadastrar'} o colaborador.`
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[440px] bg-surface-2 border-l border-border p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-5 bg-surface-2 border-b border-border text-left">
          <SheetTitle className="font-headline text-lg font-bold text-text-primary">
            {isEditing ? 'Editar colaborador' : 'Novo colaborador'}
          </SheetTitle>
          <SheetDescription className="text-xs text-text-muted">
            {isEditing
              ? 'Atualize os dados permitidos para este acesso.'
              : 'Cadastre o acesso à equipe desta empresa.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
              Nome completo
              <Input
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={255}
              />
            </label>

            {!isEditing && (
              <>
                <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                  E-mail
                  <Input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    maxLength={100}
                  />
                </label>
                <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                  CPF
                  <Input
                    inputMode="numeric"
                    autoComplete="off"
                    required
                    value={cpf}
                    onChange={(event) => setCpf(event.target.value)}
                    maxLength={14}
                    placeholder="11 dígitos"
                  />
                </label>
                <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                  Data de contratação
                  <Input
                    type="date"
                    required
                    value={hireDate}
                    onChange={(event) => setHireDate(event.target.value)}
                  />
                </label>
              </>
            )}

            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
              Telefone
              <Input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                maxLength={20}
              />
            </label>

            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
              Perfil
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as CollaboratorRole)}
                className="h-10 w-full rounded-lg border border-border bg-surface-1 px-3 text-sm text-text-primary focus:outline-none focus:border-primary"
              >
                {(['administrator', 'manager', 'operator'] as const).map((value) => (
                  <option key={value} value={value}>
                    {roleLabel(value)}
                  </option>
                ))}
              </select>
            </label>

            {!isEditing && (
              <>
                <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                  Senha inicial
                  <Input
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </label>
                <p className="text-xs leading-relaxed text-text-muted">
                  A API atual cadastra o colaborador com uma senha inicial; ela não envia convite por e-mail.
                </p>
              </>
            )}

            {isEditing && (
              <label className="block space-y-1.5 text-xs font-medium text-text-secondary">
                E-mail
                <Input value={email} readOnly disabled />
              </label>
            )}
          </div>

          <SheetFooter className="px-6 py-4 bg-surface-2 border-t border-border flex-row justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || companyId === null} className="gap-2">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {isEditing ? 'Salvar alterações' : 'Cadastrar colaborador'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
