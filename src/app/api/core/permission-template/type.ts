/** Permission Template Management types */

// Permission Template type
export interface PermissionTemplate {
  id: string;
  name: string;
  description?: string | null;
  is_system: boolean;
  actions: string[];
  created_at: string;
  created_by?: string | null;
  updated_at: string;
  updated_by?: string | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
}

// Create Permission Template Data
export interface CreatePermissionTemplateData {
  name: string;
  description?: string;
  actions: string[];
}

// Update Permission Template Data
export interface UpdatePermissionTemplateData {
  name?: string;
  description?: string;
  actions?: string[];
}

// List Permission Templates Params
export interface ListPermissionTemplatesParams {
  page?: number;
  page_size?: number;
  search?: string;
  include_system?: boolean;
}

// Permission Actions Response
export interface PermissionActionsResponse {
  actions: string[];
}
