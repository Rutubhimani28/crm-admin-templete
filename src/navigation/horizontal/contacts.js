// ** Icons Import
import { Circle, PhoneCall } from "react-feather";

export default [
    {
        id: 'contact',
        title: 'Contact',
        icon: <PhoneCall size={20} />,
        children: [
            {
                id: 'contactList',
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
