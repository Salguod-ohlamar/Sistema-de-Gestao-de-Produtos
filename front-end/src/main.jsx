
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Register from './pages/internal/Register'
import App from './pages/App'
import RegisterEmployee from './pages/internal/RegisterEmployee'
import RegisterProduct from './pages/internal/RegisterProduct'


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
        path: "/Colaborador",
        element: <RegisterEmployee />
    },
    {
        path:'/Produtos',
        element: <RegisterProduct />
    }
])



createRoot(document.getElementById('root')).render(

    <>

        {/*ativando o RouterProvider.*/}
        <RouterProvider router={routes} />

    </>

)
