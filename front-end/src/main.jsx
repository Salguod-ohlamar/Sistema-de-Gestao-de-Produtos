
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Register from './pages/internal/Register'
import App from './pages/App'
import RegisterEmployee from './pages/internal/RegisterEmployee'
import RegisterProduct from './pages/internal/RegisterProduct'
import RegisterPOS from './pages/internal/RegisterPOS'
import AdminManagement from './pages/internal/AdminManagement'
import RequireAuth from './components/RequireAuth'
import SubscriptionPlans from './pages/SubscriptionPlans'


const routes = createBrowserRouter([
    {
        //Rotas das oaginas
        path: '/',
        element: <App />
    },
    {
        path: "/Register",
        element: <Register />

    },
    {
        path: "/Planos",
        element: <SubscriptionPlans />
    },
    {
        path: "/Colaborador",
        element: <RequireAuth allowedTypes={["company", "collaborator"]} requireCompanyAdmin><RegisterEmployee /></RequireAuth>
    },
    {
        path:'/Produtos',
        element: <RequireAuth allowedTypes={["company", "collaborator"]}><RegisterProduct /></RequireAuth>
    },
    {
        path: '/PDV',
        element: <RequireAuth allowedTypes={["company", "collaborator"]}><RegisterPOS /></RequireAuth>
    },
    {
        path: '/Gerenciamento',
        element: <RequireAuth allowedTypes={["root"]}><AdminManagement /></RequireAuth>
    }
])



createRoot(document.getElementById('root')).render(

    <>

        {/*ativando o RouterProvider.*/}
        <RouterProvider router={routes} />

    </>

)
