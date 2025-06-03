// ** Icons Import
import { Home, Circle, PhoneCall, BarChart2, Users, CheckSquare, User } from "react-feather";

export default [
  {
    id: "dashboards",
    title: "Dashboards",
    icon: <Home size={20} />,
    badge: "light-warning",
    badgeText: "1",
    children: [
      {
        id: "eCommerceDash",
        title: "eCommerce",
        icon: <Circle size={20} />,
        navLink: "/dashboard/ecommerce",
      },
      {
        id: "contact",
        title: "Contact",
        icon: <PhoneCall size={20} />,
        navLink: "/dashboard/contact",
      },
      {
        id: "lead",
        title: "Lead",
        icon: <BarChart2 size={20} />,
        navLink: "/dashboard/lead",
      },
      {
        id: "customer",
        title: "Customer",
        icon: <User size={20} />,
        navLink: "/dashboard/customer",
      },
      {
        id: "task",
        title: "Task",
        icon: <CheckSquare size={20} />,
        navLink: "/dashboard/task",
      },
      {
        id: "team",
        title: "Team",
        icon: <Users size={12} />,
        navLink: "/dashboard/team",
      }
    ],
  },
];
