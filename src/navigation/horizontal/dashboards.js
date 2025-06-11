// ** Icons Import
import { Home, Circle, PhoneCall, BarChart2, Users, CheckSquare, User } from "react-feather";

export default [
  {
    id: "contact",
    title: "Contact",
    icon: <PhoneCall size={20} />,
    navLink: "/dashboard/contact",
    roles: ["admin", "user"],
  },
  {
    id: "lead",
    title: "Lead",
    icon: <BarChart2 size={20} />,
    navLink: "/dashboard/lead",
    roles: ["admin", "user"],
  },
  {
    id: "customer",
    title: "Customer",
    icon: <User size={20} />,
    navLink: "/dashboard/customer",
    roles: ["admin", "user"],
  },
  {
    id: "task",
    title: "Task",
    icon: <CheckSquare size={20} />,
    navLink: "/dashboard/task",
    roles: ["admin", "user"],
  },
  {
    id: "team",
    title: "Team",
    icon: <Users size={12} />,
    navLink: "/dashboard/team",
    roles: ["admin", "user"],
  },
];
