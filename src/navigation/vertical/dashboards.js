// ** Icons Import
import { Home, Circle, PhoneCall, BarChart2, Users } from "react-feather";

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
        icon: <Circle size={12} />,
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
      }
    ],
  },
];
