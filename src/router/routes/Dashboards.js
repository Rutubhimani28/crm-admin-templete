import { lazy } from 'react'

const DashboardAnalytics = lazy(() => import('../../views/dashboard/analytics'))

const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))
const Contact = lazy(() => import('../../views/dashboard/contact/contact'))
const ContactView = lazy(() => import('../../views/dashboard/contact/contactView'))
const Lead = lazy(() => import('../../views/dashboard/lead/lead'))
const LeadView = lazy(() => import('../../views/dashboard/lead/leadView'))
const Customer = lazy(() => import('../../views/dashboard/customer/customer'))
const CustomerView = lazy(() => import('../../views/dashboard/customer/customerView'))
const Task = lazy(() => import('../../views/dashboard/task/task'))
const TaskView = lazy(() => import('../../views/dashboard/task/taskview'))
const Team = lazy(() => import('../../views/dashboard/team/team'))
const TeamView = lazy(() => import('../../views/dashboard/team/teamView'))
const Profile = lazy(() => import('../../views/dashboard/profile/profile'))
const Todo = lazy(() => import('../../views/dashboard/todo'))
const Calendar = lazy(() => import('../../views/dashboard/calendar/Calendar'))
const Proposals = lazy(() => import('../../views/dashboard/proposals/proposals'))
const ProposalsView = lazy(() => import('../../views/dashboard/proposals/proposalsview'))
const Document = lazy(() => import('../../views/dashboard/documents/document'))
const Users = lazy(() => import('../../views/dashboard/users/users'))
const UsersView = lazy(() => import('../../views/dashboard/users/usersview'))
const RolesPermissions = lazy(() => import('../../views/dashboard/rolesPermissions/rolesPermissions'))
const Permissions = lazy(() => import('../../views/dashboard/rolesPermissions/permissions'))

const DashboardRoutes = [
  {
    path: '/dashboard',
    element: <DashboardAnalytics />
  },
  {
    path: '/ecommerce',
    element: <commerce />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/contact/contactView/:id',
    element: <ContactView />
  },
  {
    path: '/lead',
    element: <Lead />
  },
  {
    path: "/lead/leadView/:id",
    element: <LeadView />
  },
  {
    path: "/customer",
    element: <Customer />
  },
  {
    path: "/customer/customerView/:id",
    element: <CustomerView />
  },
  {
    path: '/task',
    element: <Task />
  },
  {
    path: '/task/taskView/:id',
    element: <TaskView />
  },
  {
    path: '/team',
    element: <Team />
  },
  {
    path: '/team/teamView/:id',
    element: <TeamView />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  // {
  //   path: '/todo',
  //   element: <Todo />
  // },
  {
    path: '/calendar',
    element: <Calendar />
  },
  {
    path: '/proposals',
    element: <Proposals />
  },
  {
    path: '/proposals/proposalsview/:id',
    element: <ProposalsView />
  },
  {
    path: '/document',
    element: <Document />
  },
  {
    path: '/users',
    element: <Users />
  },
  {
    path: '/profile/viewUser/:id',
    element: <UsersView />
  },
  {
    path: '/rolesPermissions',
    element: <RolesPermissions />
  },
  {
    path: '/rolesPermissions/permissions/:id',
    element: <Permissions />
  },

]

export default DashboardRoutes
