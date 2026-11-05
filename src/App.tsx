import { useState } from 'react'
import { AuthProvider, useAuth } from '@/features/auth/context'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardView } from '@/features/dashboard/components/DashboardView'
import { UsersView } from '@/features/users/components/UsersView'
import { ProductsView } from '@/features/products/components/ProductsView'
import { NewProductView } from '@/features/products/components/NewProductView'
import { PosView } from '@/features/sales/components/PosView'
import { SalesHistoryView } from '@/features/sales/components/SalesHistoryView'
import { LoginView } from '@/features/auth/components/LoginView'
import { toast } from 'sonner'

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth()
  const [currentView, setCurrentView] = useState('login') // Fluxo de Autenticação / Tela 7

  const handleNavigate = (view: string) => {
    if (view === 'login') {
      logout()
      setCurrentView('login')
      toast.info('Sessão encerrada. Redirecionando para login.')
      return
    }

    // Operadores só podem usar o PDV (a regra definitiva é do backend)
    if (user?.roleKey === 'operator' && view !== 'pdv') {
      toast.warning('Seu perfil de operador só tem acesso ao PDV.')
      setCurrentView('pdv')
      return
    }

    if (
      view === 'pdv' ||
      view === 'historico' ||
      view === 'dashboard' ||
      view === 'usuarios' ||
      view === 'produtos' ||
      view === 'novo-produto'
    ) {
      setCurrentView(view)
    } else {
      toast.info(`Navegando para: ${view}`)
      setCurrentView(view)
    }
  }

  // Fluxo de Autenticação / Tela 07: Split Screen Login ou Cockpit Autenticado
  if (!isAuthenticated || currentView === 'login') {
    return (
      <LoginView
        onLoginSuccess={() => setCurrentView(user?.roleKey === 'operator' ? 'pdv' : 'dashboard')}
        initialErrorState={false}
      />
    )
  }

  return (
    <AppLayout currentView={currentView} onNavigate={handleNavigate}>
      {currentView === 'pdv' ? (
        <PosView />
      ) : currentView === 'historico' ? (
        <SalesHistoryView />
      ) : currentView === 'dashboard' ? (
        <DashboardView onNavigate={handleNavigate} />
      ) : currentView === 'usuarios' ? (
        <UsersView />
      ) : currentView === 'produtos' ? (
        <ProductsView onNavigate={handleNavigate} />
      ) : currentView === 'novo-produto' ? (
        <NewProductView onBack={() => handleNavigate('produtos')} />
      ) : (
        <div className="p-8 text-center text-text-muted">
          <p className="text-lg">Visualizando tela: {currentView}</p>
          <button
            type="button"
            onClick={() => setCurrentView('dashboard')}
            className="mt-4 px-4 py-2 bg-primary text-text-primary rounded-lg text-sm cursor-pointer"
          >
            Voltar ao Dashboard
          </button>
        </div>
      )}
    </AppLayout>
  )
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
