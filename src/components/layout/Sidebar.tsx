import {
  LayoutDashboard,
  Package,
  PlusSquare,
  Users,
  Settings,
  MoreVertical,
  LogOut,
  UserCheck,
} from 'lucide-react'
import { NexoraBrand } from '@/components/common/NexoraLogo'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SidebarProps {
  currentView?: string
  onNavigate?: (view: string) => void
}

export function Sidebar({ currentView = 'dashboard', onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'produtos', label: 'Produtos (Consulta)', icon: Package },
    { id: 'novo-produto', label: 'Novo produto', icon: PlusSquare },
    { id: 'usuarios', label: 'Usuários', icon: Users },
  ]

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[248px] bg-surface-1 border-r border-border z-40 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Header da Sidebar */}
        <div className="h-16 px-5 border-b border-border flex items-center justify-between">
          <NexoraBrand />
          <Badge
            variant="outline"
            className="text-[11px] font-mono uppercase tracking-wider text-text-muted bg-surface-2 border-border/80 px-2 py-0.5"
          >
            v1.0
          </Badge>
        </div>

        {/* Itens de Navegação */}
        <div className="px-3 pt-4">
          <span className="px-3 font-mono text-[11px] uppercase tracking-wider text-text-muted font-semibold">
            Navegação do Sistema
          </span>
          <nav className="mt-2.5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate?.(item.id)}
                  className={`w-full flex items-center h-11 px-3.5 rounded-lg transition-all gap-3 text-sm cursor-pointer text-left ${
                    isActive
                      ? 'bg-primary/10 text-text-primary font-semibold border-l-[3px] border-primary pl-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'
                      : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive ? 'text-primary' : 'text-text-muted'
                    }`}
                    strokeWidth={1.5}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}

            <div className="my-3 border-t border-border mx-2" />

            <button
              type="button"
              onClick={() => onNavigate?.('configuracoes')}
              className="w-full flex items-center h-11 px-3.5 rounded-lg transition-all gap-3 text-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary cursor-pointer text-left"
            >
              <Settings className="h-5 w-5 text-text-muted shrink-0" strokeWidth={1.5} />
              <span className="truncate">Configurações</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Widget do Usuário no rodapé */}
      <div className="p-3 border-t border-border bg-surface-1">
        <DropdownMenu>
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-2/60 border border-border hover:border-border-highlight transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="w-9 h-9 border border-border">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                    alt="Rodrigo Silveira"
                  />
                  <AvatarFallback className="bg-surface-elevated text-primary font-semibold text-xs">
                    RS
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cyan-accent rounded-full ring-2 ring-surface-1" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-text-primary truncate">
                  Rodrigo Silveira
                </span>
                <span className="text-xs text-text-muted truncate">
                  Gerente de Operações
                </span>
              </div>
            </div>

            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer"
                aria-label="Menu do usuário"
              >
                <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent
            side="top"
            align="start"
            className="w-56 mb-2 border-border-highlight bg-surface-elevated"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-text-primary leading-none">
                  Rodrigo Silveira
                </p>
                <p className="text-xs text-text-muted leading-none font-mono">
                  rodrigo@nexora.com.br
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer gap-2.5 text-text-secondary hover:text-text-primary">
              <UserCheck className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <span>Ver meu perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onNavigate?.('login')}
              className="cursor-pointer gap-2.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              <span>Sair / Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
