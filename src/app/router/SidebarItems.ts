export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  permission?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
  permission?: string;
}

import { uniqueId } from "lodash";
import { ROUTES } from '@/app/constants/router';
import { PERMISSIONS } from '@/app/constants/permission';

const SidebarContent: MenuItem[] = [
  {
    id: 1,
    name: "CRM",
    items: [
      {
        heading: "CRM",
        children: [
          {
            name: "Dashboard",
            icon: "solar:widget-line-duotone",
            id: uniqueId(),
            url: ROUTES.CRM.DASHBOARD,
          },
          {
            name: "Chats",
            icon: "solar:chat-round-line-line-duotone",
            id: uniqueId(),
            url: ROUTES.CRM.CHATS,
          },
          {
            name: "Leads",
            icon: "solar:user-speak-rounded-line-duotone",
            id: uniqueId(),
            url: ROUTES.CRM.LEADS,
          },
          {
            name: "Deals",
            icon: "solar:hand-shake-line-duotone",
            id: uniqueId(),
            url: ROUTES.CRM.DEALS,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Reports",
    items: [
      {
        heading: "Reports",
        children: [
          {
            name: "Revenue vs Target",
            icon: "solar:graph-up-line-duotone",
            id: uniqueId(),
            url: ROUTES.CRM.REPORTS.REVENUE_VS_TARGET,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Core",
    items: [
      {
        heading: "Core",
        children: [
          {
            name: "User",
            icon: "solar:user-rounded-outline",
            id: uniqueId(),
            url: ROUTES.USERS,
            permission: PERMISSIONS.USER_VIEW,
          },
          {
            name: "Roles",
            icon: "solar:shield-check-line-duotone",
            id: uniqueId(),
            url: ROUTES.ROLES,
            permission: PERMISSIONS.ROLE_VIEW,
          },
          {
            name: "Permission Templates",
            icon: "solar:document-text-line-duotone",
            id: uniqueId(),
            url: ROUTES.CORE.PERMISSION_TEMPLATES,
            permission: PERMISSIONS.PERMISSION_TEMPLATE_VIEW,
          },
          {
            name: "Companies",
            icon: "solar:buildings-2-line-duotone",
            id: uniqueId(),
            url: ROUTES.CORE.COMPANIES,
            permission: PERMISSIONS.COMPANY_VIEW,
          },
        ],
      },
    ],
  },
];

export default SidebarContent;
