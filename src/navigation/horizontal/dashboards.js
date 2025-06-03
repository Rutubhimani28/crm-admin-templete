// ** Icons Import
import { BarChart2, CheckSquare, Home, PhoneCall, ShoppingCart, Users } from "react-feather";

export default [
  {
    id: "dashboards",
    title: "Dashboards",
    icon: <Home />,
    children: [
      {
        id: "eCommerceDash",
        title: "eCommerce",
        icon: <ShoppingCart />,
        navLink: "/dashboard/ecommerce",
      },
      {
        id: "contact",
        title: "Contact",
        icon: <PhoneCall size={12} />,
        navLink: "/dashboard/contact",
      },
      {
        id: "lead",
        title: "Lead",
        icon: <BarChart2 size={12} />,
        navLink: "/dashboard/lead",
      },
      {
        id: "customer",
        title: "Customer",
        icon: <Users size={12} />,
        navLink: "/dashboard/customer",
      },
      {
        id: "task",
        title: "Task",
        icon: <CheckSquare size={12} />,
        navLink: "/dashboard/task",
      },
      {
        id: "team",
        title: "Team",
        icon: <CheckSquare size={12} />,
        navLink: "/dashboard/team",
      }
    ],
  },

];
