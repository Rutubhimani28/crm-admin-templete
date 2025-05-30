import { lazy } from 'react'

const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))
const Contact = lazy(() => import('../../views/dashboard/contact/contact'))
const ContactView = lazy(() => import('../../views/dashboard/contact/contactView'))

const DashboardRoutes = [
  {
    path: '/dashboard/ecommerce',
    element: <DashboardEcommerce />
  },
  {
    path: '/dashboard/contact',
    element: <Contact />
  },
  {
    path: '/contact/contactView/:id',
    element: <ContactView />
  }
]

export default DashboardRoutes
