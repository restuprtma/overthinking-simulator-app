import { apiService } from '@/app/services/apiService';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import type {
  CreatePermissionTemplateData,
  ListPermissionTemplatesParams,
  UpdatePermissionTemplateData,
  PermissionTemplate,
} from './type';

/** Permission Template API endpoints */

export const permissionTemplateApi = {
  // Get all available permission actions
  getPermissionActions: () =>
    apiService.get<ResponseApi<string[]>>('/core/v1/permissions/actions'),

  // Create a new permission template
  createPermissionTemplate: (data: CreatePermissionTemplateData) =>
    apiService.post<ResponseApi<PermissionTemplate>>('/core/v1/permission-templates', data),

  // List permission templates with pagination and filters
  listPermissionTemplates: (params?: ListPermissionTemplatesParams) =>
    apiService.get<ResponseApiWithMeta<PermissionTemplate[]>>('/core/v1/permission-templates', params || {}),

  // Get permission template by ID
  getPermissionTemplateById: (id: string) =>
    apiService.get<ResponseApi<PermissionTemplate>>(`/core/v1/permission-templates/${id}`),

  // Update permission template
  updatePermissionTemplate: (id: string, data: UpdatePermissionTemplateData) =>
    apiService.put<ResponseApi<PermissionTemplate>>(`/core/v1/permission-templates/${id}`, data),

  // Delete permission template (soft delete)
  deletePermissionTemplate: (id: string) =>
    apiService.delete<ResponseApi<void>>(`/core/v1/permission-templates/${id}`),

  // Restore deleted permission template
  restorePermissionTemplate: (id: string) =>
    apiService.post<ResponseApi<void>>(`/core/v1/permission-templates/${id}/restore`),
};
