import * as React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from '@/components/ui/command'
import { Toaster } from '@/components/ui/sonner'
import { LayoutDashboard, Package, PlusSquare, Users } from 'lucide-react'
import { toast } from 'sonner'

interface AppLayoutProps {
  currentView: string
  onNavigate: (view: string) => void
  children: React.ReactNode
}

export function AppLayout({ currentView, onNavigate, children }: AppLayoutProps) {
  const [commandOpen, setCommandOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelectNav = (viewId: string) => {
    onNavigate(viewId)
    setCommandOpen(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex">
      {/* Sidebar Fixa à Esquerda */}
      <Sidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Área Central Principal */}
      <div className="flex-1 pl-[248px] flex flex-col min-h-screen">
        <Header
          onOpenCommand={() => setCommandOpen(true)}
          onOpenNotifications={() =>
            toast.info('2 alertas de reposição pendentes no estoque')
          }
        />

        {/* Conteúdo com padding top para compensar o Header fixo de 64px */}
        <main className="flex-1 pt-16 bg-background">
          {children}
        </main>
      </div>

      {/* Command Palette (Ctrl+K) */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Digite um comando, tela ou SKU..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação Rápida">
            <CommandItem
              onSelect={() => handleSelectNav('dashboard')}
              className="cursor-pointer gap-2.5"
            >
              <LayoutDashboard className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <span>Dashboard Executivo</span>
              <CommandShortcut>Ir para</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelectNav('produtos')}
              className="cursor-pointer gap-2.5"
            >
              <Package className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
              <span>Consulta de Produtos</span>
              <CommandShortcut>Ir para</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelectNav('novo-produto')}
              className="cursor-pointer gap-2.5"
            >
              <PlusSquare className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
              <span>Cadastrar Novo Produto</span>
              <CommandShortcut>Novo</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelectNav('usuarios')}
              className="cursor-pointer gap-2.5"
            >
              <Users className="h-4 w-4 text-cyan-accent" strokeWidth={1.5} />
              <span>Gestão de Usuários</span>
              <CommandShortcut>Atalho</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Sonner Toasts */}
      <Toaster />
    </div>
  )
}
