import { Mail, ShieldCheck, User } from 'lucide-react'
import type { UserProfile } from '@/features/auth/context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ProfileDialogProps {
  user: UserProfile | null
  initials: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Perfil do usuário logado, somente leitura, com os dados que já estão na sessão. */
export function ProfileDialog({ user, initials, open, onOpenChange }: ProfileDialogProps) {
  const rows = [
    { icon: User, label: 'Nome', value: user?.name },
    { icon: Mail, label: 'E-mail', value: user?.email },
    { icon: ShieldCheck, label: 'Perfil', value: user?.role },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
          <Avatar className="w-12 h-12 border border-border">
            <AvatarFallback className="bg-surface-elevated text-primary font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <DialogTitle className="font-headline text-lg">Meu perfil</DialogTitle>
            <DialogDescription className="text-xs text-text-secondary">
              Dados da sessão atual (somente leitura).
            </DialogDescription>
          </div>
        </DialogHeader>

        <dl className="mt-2 flex min-w-0 flex-col gap-2">
          {rows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex min-w-0 items-center gap-3 p-3 rounded-lg bg-surface-1 border border-border"
            >
              <Icon className="h-4 w-4 text-primary shrink-0" strokeWidth={1.75} />
              <dt className="w-16 shrink-0 text-xs text-text-muted">{label}</dt>
              <dd className="min-w-0 break-all text-sm text-text-primary font-medium">
                {value || '—'}
              </dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  )
}
