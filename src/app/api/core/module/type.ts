/** Module Management types */

export interface Module {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  sort_order: number;
  is_active: boolean;
  parent_id?: string | null;
  depth: number;
  heading?: string | null;
  to?: string | null;
  url?: string | null;
  permission?: string | null;
  tooltip?: string | null;
  is_menu_visible: boolean;
  permissions_count?: number;
  created_at?: string;
  created_by?: string | null;
  updated_at?: string;
  updated_by?: string | null;
}

export interface CreateModuleData {
  code: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
  parent_id?: string | null;
  heading?: string | null;
  to?: string | null;
  url?: string | null;
  permission?: string | null;
  tooltip?: string | null;
  is_menu_visible?: boolean;
}

export interface UpdateModuleData {
  code?: string;
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
  parent_id?: string | null;
  heading?: string | null;
  to?: string | null;
  url?: string | null;
  permission?: string | null;
  tooltip?: string | null;
  is_menu_visible?: boolean;
}

export interface ListModulesParams {
  search?: string;
  is_active?: boolean;
  parent_id?: string;
  depth?: number;
  is_menu_visible?: boolean;
}

/** Nested Resource: Module Permissions */
export interface ListModulePermissionsParams {
  page?: number;
  page_size?: number;
  search?: string;
  resource?: string;
  action?: string;
}

export interface ApplyCRUDTemplateRequest {
  resource: string;
}

export interface CRUDTemplateResponse {
  created: Permission[];
  skipped: string[];
  total: number;
}

/** Permission type (reference from permission API) */
export interface Permission {
  id: string;
  module_id: string;
  resource: string;
  action: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Module Tree Response */
export interface ModuleGroup {
  module: Module;
  sub_modules: Module[];
}

export interface ModuleTreeData {
  data: ModuleGroup[];
}
