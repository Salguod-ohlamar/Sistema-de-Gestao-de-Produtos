import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from '@/features/auth/context'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardView } from '@/features/dashboard/components/DashboardView'
import { UsersView } from '@/features/users/components/UsersView'
import { CompanyWorkspaceView } from '@/features/company/components/CompanyWorkspaceView'
import { ProductsView } from '@/features/products/components/ProductsView'
import { NewProductView } from '@/features/products/components/NewProductView'
import { PosView } from '@/features/sales/components/PosView'
import { DreView } from '@/features/finance/components/DreView'
import { SalesHistoryView } from '@/features/sales/components/SalesHistoryView'
import { LoginView } from '@/features/auth/components/LoginView'
import { CompanyRegistrationView } from '@/features/auth/components/CompanyRegistrationView'
import { ForgotPasswordView } from '@/features/auth/components/ForgotPasswordView'
import { PasswordResetView } from '@/features/auth/components/PasswordResetView'
import { ContactView } from '@/features/contact/components/ContactView'
import { AdminView } from '@/features/admin/components/AdminView'
import { toast } from 'sonner'

// Implementa a operação relacionada a app content.
function AppContent() {
  const { user, isAuthenticated, logout } = useAuth()
  const [currentView, setCurrentView] = useState('login') // Fluxo de Autenticação / Tela 7
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [resetToken, setResetToken] = useState(() =>
    new URLSearchParams(window.location.hash.slice(1)).get('resetToken')
  )

  useEffect(() => {
    if (resetToken) window.history.replaceState(null, '', window.location.pathname)
  }, [resetToken])

  // Processa a ação ou o evento associado a handle navigate.
  const handleNavigate = (view: string, productId?: number) => {
    if (view === 'login') {
      logout()
      setCurrentView('login')
      toast.info('Sessão encerrada. Redirecionando para login.')
      return
    }

    if (user?.principalType === 'root' && view !== 'admin') {
      toast.warning('A administração central não pode acessar a área de uma empresa.')
      setCurrentView('admin')
      return
    }

    // Operadores só podem usar o PDV (a regra definitiva é do backend)
    if (user?.roleKey === 'operator' && view !== 'pdv') {
      toast.warning('Seu perfil de operador só tem acesso ao PDV.')
      setCurrentView('pdv')
      return
    }

    if (view === 'novo-produto') {
      setEditingProductId(productId ?? null)
    } else if (view === 'produtos') {
      setEditingProductId(null)
    }

    if (
      view === 'pdv' ||
      view === 'historico' ||
      view === 'dashboard' ||
      view === 'dre' ||
      view === 'usuarios' ||
      view === 'empresa' ||
      view === 'admin' ||
      view === 'produtos' ||
      view === 'novo-produto'
    ) {
      setCurrentView(view)
    } else {
      toast.info(`Navegando para: ${view}`)
      setCurrentView(view)
    }
  }

  if (resetToken) {
    return (
      <PasswordResetView
        token={resetToken}
        onBack={() => {
          window.history.replaceState(null, '', window.location.pathname)
          setResetToken(null)
          setCurrentView('login')
        }}
        onCompleted={() => {
          window.history.replaceState(null, '', window.location.pathname)
          setResetToken(null)
          setCurrentView('login')
          toast.success('Senha redefinida. Entre com sua nova senha.')
        }}
      />
    )
  }

  if (!isAuthenticated && currentView === 'register-company') {
    return (
      <CompanyRegistrationView
        onBack={() => setCurrentView('login')}
        onRegistered={() => {
          setCurrentView('login')
          toast.success('Cadastro enviado para aprovação. Você poderá acessar após a análise.')
        }}
      />
    )
  }

  if (!isAuthenticated && currentView === 'forgot-password') {
    return <ForgotPasswordView onBack={() => setCurrentView('login')} />
  }

  if (!isAuthenticated && currentView === 'contact') {
    return <ContactView onBack={() => setCurrentView('login')} />
  }

  if (!isAuthenticated || currentView === 'login') {
    return (
      <LoginView
        onLoginSuccess={(authenticatedUser) => {
          setCurrentView(
            authenticatedUser.principalType === 'root'
              ? 'admin'
              : authenticatedUser.roleKey === 'operator'
                ? 'pdv'
                : 'dashboard'
          )
        }}
        onCompanyRegistration={() => setCurrentView('register-company')}
        onContact={() => setCurrentView('contact')}
        onForgotPassword={() => setCurrentView('forgot-password')}
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
      ) : currentView === 'dre' ? (
        <DreView />
      ) : currentView === 'usuarios' ? (
        <UsersView />
      ) : currentView === 'empresa' ? (
        <CompanyWorkspaceView onNavigate={handleNavigate} />
      ) : currentView === 'admin' ? (
        <AdminView />
      ) : currentView === 'produtos' ? (
        <ProductsView onNavigate={handleNavigate} />
      ) : currentView === 'novo-produto' ? (
        <NewProductView
          productId={editingProductId}
          onBack={() => handleNavigate('produtos')}
        />
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

// Componente React responsável por renderizar app.
export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
