import { Search, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface HeaderProps {
  onOpenCommand?: () => void
  onOpenNotifications?: () => void
}

export function Header({ onOpenCommand, onOpenNotifications }: HeaderProps) {
  return (
    <header className="fixed top-0 left-[248px] right-0 h-16 bg-surface-1/90 backdrop-blur-md border-b border-border z-30 px-8 flex items-center justify-between select-none">
      {/* Barra de Pesquisa Rápida */}
      <div className="relative w-[360px]">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
          strokeWidth={1.5}
        />
        <input
          type="text"
          readOnly
          onClick={onOpenCommand}
          placeholder="Buscar produtos, SKUs, usuários..."
          className="w-full h-10 pl-10 pr-16 bg-surface-2 rounded-lg border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-highlight focus:ring-1 focus:ring-primary transition-all cursor-pointer"
        />
        <button
          type="button"
          onClick={onOpenCommand}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-elevated border border-border font-mono text-[11px] text-text-muted select-none cursor-pointer hover:border-primary hover:text-text-primary transition-colors"
        >
          Ctrl K
        </button>
      </div>

      {/* Ações da Direita */}
      <div className="flex items-center gap-4">
        {/* Notificações */}
        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="Notificações"
          className="relative p-2 rounded-lg bg-surface-2 border border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
        >
          <Bell className="h-5 w-5" strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(47,107,255,0.7)]" />
        </button>

        {/* Separador */}
        <div className="h-6 w-px bg-border" />

        {/* Mini perfil do Header */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer">
          <div className="relative shrink-0">
            <Avatar className="w-8 h-8 border border-border">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                alt="Rodrigo Silveira"
              />
              <AvatarFallback className="bg-surface-elevated text-primary font-semibold text-xs">
                RS
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-accent rounded-full ring-2 ring-surface-1" />
          </div>
          <span className="text-sm font-medium text-text-primary hidden lg:inline-block">
            Rodrigo S.
          </span>
        </div>
      </div>
    </header>
  )
}
