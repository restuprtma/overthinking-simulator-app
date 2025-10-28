export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: string;
  children?: ChildItem[];
  item?: unknown;
  url?: string;
  color?: string;
  permission?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: string;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: string;
  permission?: string;
}

import { uniqueId } from "lodash";
import { ROUTES } from '@/app/constants/router';
import { PERMISSIONS } from '@/app/constants/permission';

const SidebarContent: MenuItem[] = [
  {
    id: 1,
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
