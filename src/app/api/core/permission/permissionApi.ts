import { apiService } from '@/app/services/apiService';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import type {
  CreatePermissionData,
  ListPermissionsParams,
  Permission,
  UpdatePermissionData,
} from './type';

/** Permission API endpoints */

export const permissionApi = {
  createPermission: (data: CreatePermissionData) =>
    apiService.post<ResponseApi<Permission>>('/core/v1/permissions', data),

  listPermissions: (params?: ListPermissionsParams) =>
    apiService.get<ResponseApiWithMeta<Permission[]>>(
      '/core/v1/permissions',
      params || {}
    ),

  getPermissionById: (id: string) =>
    apiService.get<ResponseApi<Permission>>(`/core/v1/permissions/${id}`),

  updatePermission: (id: string, data: UpdatePermissionData) =>
    apiService.put<ResponseApi<Permission>>(
      `/core/v1/permissions/${id}`,
      data
    ),

  deletePermission: (id: string) =>
    apiService.delete<ResponseApi<void>>(`/core/v1/permissions/${id}`),

  getActions: () =>
    apiService.get<ResponseApi<string[]>>('/core/v1/permissions/actions'),
};
