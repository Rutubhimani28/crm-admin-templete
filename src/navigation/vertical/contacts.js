// ** Icons Import
import { Circle, PhoneCall } from "react-feather";

export default [
    {
        id: 'contact',
        title: 'Contact',
        navLink: '/apps/contact/list',
        icon: <PhoneCall size={20} />,
        children: [
            {
                id: 'invoiceList',
                title: 'List',
                icon: <Circle size={12} />,
                navLink: '/apps/contact/list'
            },
            {
                id: 'invoicePreview',
                title: 'Preview',
                icon: <Circle size={12} />,
                navLink: '/apps/invoice/preview'
            },
            {
                id: 'invoiceEdit',
                title: 'Edit',
                icon: <Circle size={12} />,
                navLink: '/apps/invoice/edit'
            },
            {
                id: 'invoiceAdd',
                title: 'Add',
                icon: <Circle size={12} />,
                navLink: '/apps/contact/add'
            }
        ]
      },
];
