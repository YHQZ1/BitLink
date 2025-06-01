import './App.css'
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/app-layout'
import Dashboard from './pages/Dashboard'
import Link from './pages/Link'
import Redirect from './pages/Redirect'
import Auth from './pages/Auth'
import LandingPage from './pages/LandingPage'


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/auth',
        element: <Auth />
      },
      {
        path: '/link:id',
        element: <Link />
      },
      {
        path: '/:id',
        element: <Redirect />
      },
      
    ]
  }
])

function App() {
  return(
    <URLProvider>
      <RouterProvider router={router} />;
    </URLProvider>
  );
}

export default App
