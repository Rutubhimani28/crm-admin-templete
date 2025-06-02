import { lazy } from 'react'

const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))
const Contact = lazy(() => import('../../views/dashboard/contact/contact'))
const ContactView = lazy(() => import('../../views/dashboard/contact/contactView'))
const Lead = lazy(() => import('../../views/dashboard/lead/lead'))
const LeadView = lazy(() => import('../../views/dashboard/lead/leadView'))
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
  },
  {
    path: '/dashboard/lead',
    element: <Lead />
  },
  {
    path:"/lead/leadView/:id",
    element: <LeadView />
  }
]

export default DashboardRoutes
