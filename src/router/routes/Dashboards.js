import { lazy } from 'react'

const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))

const DashboardRoutes = [
  {
    path: '/dashboard/ecommerce',
    element: <DashboardEcommerce />
  }
]

export default DashboardRoutes
