// ** Icons Import
import { iconClasses } from "@mui/material";
import { PhoneCall, BarChart2, Users, CheckSquare, User, Activity, Calendar, Book, FolderPlus, Sliders } from "react-feather";

export default [
  {
    id: 'analyticsDash',
    title: 'Dashboard',
    icon: <Activity />,
    navLink: '/dashboard'
  },
  {
    id: "contact",
    title: "Contact",
    icon: <PhoneCall size={20} />,
    navLink: "/contact",
    roles: ["admin", "user", "contact", 'lead'],
  },
  {
    id: "lead",
    title: "Lead",
    icon: <BarChart2 size={20} />,
    navLink: "/lead",
    roles: ["admin", "user"],
  },
  {
    id: "customer",
    title: "Customer",
    icon: <User size={20} />,
    navLink: "/customer",
    roles: ["admin", "user"],
  },
  {
    id: "task",
    title: "Task",
    icon: <CheckSquare size={20} />,
    navLink: "/task",
    roles: ["admin", "user"],
  },
  {
    id: "team",
    title: "Team",
    icon: <Users size={12} />,
    navLink: "/team",
    roles: ["admin", "user"],
  },
  {
    id: "proposals",
    title: "Proposals",
    navLink: "/Proposals",
    icon: <Book size={12} />,
    roles: ["admin", "user"],
  },
  // {
  //   id: 'todo',
  //   title: 'Todo',
  //   icon: <CheckSquare />,
  //   navLink: '/todo'
  // },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: <Calendar />,
    navLink: '/calendar'
  },
  {
    id: 'document',
    title: 'Document',
    icon: <FolderPlus />,
    navLink: '/document'
  },
  {
    id: 'users',
    title: 'Users',
    icon: <Users />,
    navLink: '/users'
  },
  {
    id: 'rolesPermissions',
    title: 'Roles-Permissions',
    icon: <Sliders />,
    navLink: '/rolesPermissions',
    roles: ["admin"]
  }
]
