/** Role types */

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface RoleModuleTemplate {
  module_id: string;
  module_code: string;
  module_name: string;
  permission_template_id: string;
  permission_template_name: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
  module_templates?: RoleModuleTemplate[];
}

export interface CreateRoleData {
  name: string;
  description?: string;
  module_templates?: Record<string, string>; // Map of module ID to template ID
  permissions?: string[]; // Deprecated: use module_templates instead
}

export interface ListRolesParams {
  page?: number;
  page_size?: number;
  search?: string;
  include_system?: boolean;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  module_templates?: Record<string, string>; // Map of module ID to template ID
  permissions?: string[]; // Deprecated: use module_templates instead
}

export interface AssignPermissionsData {
  permission_ids: string[];
}
