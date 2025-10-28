/** Permission Management types */

export interface Permission {
  id: string;
  module_id: string;
  module?: ModuleInfo;
  resource: string;
  action: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface ModuleInfo {
  id: string;
  code: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface CreatePermissionData {
  module_id: string;
  resource: string;
  action: string;
  description?: string;
}

export interface UpdatePermissionData {
  module_id?: string;
  resource?: string;
  action?: string;
  description?: string;
}

export interface ListPermissionsParams {
  page?: number;
  page_size?: number;
  search?: string;
  module_id?: string;
  resource?: string;
  action?: string;
}

/** Module information */
export interface Module {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  sort_order: number;
}
