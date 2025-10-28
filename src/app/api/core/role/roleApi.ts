import { apiService } from '@/app/services/apiService';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import type {
  CreateRoleData,
  ListRolesParams,
  UpdateRoleData,
  Role,
  RoleWithPermissions,
  AssignPermissionsData,
} from './type';

/** Role API endpoints */

export const roleApi = {
  createRole: (data: CreateRoleData) =>
    apiService.post<ResponseApi<Role>>('/core/v1/roles', data),

  listRoles: (params?: ListRolesParams) =>
    apiService.get<ResponseApiWithMeta<Role[]>>('/core/v1/roles', params || {}),

  getRoleById: (id: string) =>
    apiService.get<ResponseApi<Role>>(`/core/v1/roles/${id}`),

  updateRole: (id: string, data: UpdateRoleData) =>
    apiService.put<ResponseApi<Role>>(`/core/v1/roles/${id}`, data),

  deleteRole: (id: string) =>
    apiService.delete<ResponseApi<void>>(`/core/v1/roles/${id}`),

  restoreRole: (id: string) =>
    apiService.post<ResponseApi<Role>>(`/core/v1/roles/${id}/restore`),

  // Permission management endpoints
  getRolePermissions: (id: string) =>
    apiService.get<ResponseApi<RoleWithPermissions>>(`/core/v1/roles/${id}/permissions`),

  assignPermissions: (id: string, data: AssignPermissionsData) =>
    apiService.put<ResponseApi<void>>(`/core/v1/roles/${id}/permissions`, data),

  addPermission: (id: string, permissionId: string) =>
    apiService.post<ResponseApi<void>>(`/core/v1/roles/${id}/permissions/${permissionId}`),

  removePermission: (id: string, permissionId: string) =>
    apiService.delete<ResponseApi<void>>(`/core/v1/roles/${id}/permissions/${permissionId}`),
};
