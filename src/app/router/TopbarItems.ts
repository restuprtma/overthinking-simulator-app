import { uniqueId } from 'lodash';
import { ROUTES } from '@/app/constants/router';
import { PERMISSIONS } from '@/app/constants/permission';

interface TopbarChildItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  permission?: string;
  children?: TopbarChildItem[];
}

interface TopbarMenuItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  column: number;
  children: TopbarChildItem[];
}

const Menuitems: TopbarMenuItem[] = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: 'solar:widget-line-duotone',
    href: ROUTES.CRM.DASHBOARD,
    column: 1,
    children: [],
  },
  {
    id: uniqueId(),
    title: 'Chats',
    icon: 'solar:chat-round-line-line-duotone',
    href: ROUTES.CRM.CHATS,
    column: 1,
    children: [],
  },
  {
    id: uniqueId(),
    title: 'Leads',
    icon: 'solar:user-speak-rounded-line-duotone',
    href: ROUTES.CRM.LEADS,
    column: 1,
    children: [],
  },
  {
    id: uniqueId(),
    title: 'Deals',
    icon: 'solar:hand-shake-line-duotone',
    href: ROUTES.CRM.DEALS,
    column: 1,
    children: [],
  },
  {
    id: uniqueId(),
    title: 'Reports',
    icon: 'solar:chart-2-line-duotone',
    href: '',
    column: 1,
    children: [
      {
        id: uniqueId(),
        title: 'Revenue vs Target',
        icon: 'solar:graph-up-line-duotone',
        href: ROUTES.CRM.REPORTS.REVENUE_VS_TARGET,
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Core',
    icon: 'solar:database-line-duotone',
    href: '',
    column: 1,
    children: [
      {
        id: uniqueId(),
        title: 'User',
        icon: 'solar:user-rounded-outline',
        href: ROUTES.USERS,
        permission: PERMISSIONS.USER_VIEW,
      },
      {
        id: uniqueId(),
        title: 'Roles',
        icon: 'solar:shield-check-line-duotone',
        href: ROUTES.ROLES,
        permission: PERMISSIONS.ROLE_VIEW,
      },
      {
        id: uniqueId(),
        title: 'Companies',
        icon: 'solar:buildings-2-line-duotone',
        href: ROUTES.CORE.COMPANIES,
        permission: PERMISSIONS.COMPANY_VIEW,
      },
    ],
  },
];
export default Menuitems;
