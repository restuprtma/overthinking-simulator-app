import { apiService } from '@/app/services/apiService';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import type {
  CreateModuleData,
  ListModulesParams,
  Module,
  UpdateModuleData,
  ListModulePermissionsParams,
  Permission,
  ApplyCRUDTemplateRequest,
  CRUDTemplateResponse,
  ModuleTreeData,
} from './type';

/** Module API endpoints */

export const moduleApi = {
  createModule: (data: CreateModuleData) =>
    apiService.post<ResponseApi<Module>>('/core/v1/modules', data),

  listModules: (params?: ListModulesParams) =>
    apiService.get<ResponseApi<Module[]>>(
      '/core/v1/modules',
      params || {}
    ),

  getModuleTree: () =>
    apiService.get<ModuleTreeData>('/core/v1/modules/tree'),

  getModuleById: (id: string) =>
    apiService.get<ResponseApi<Module>>(`/core/v1/modules/${id}`),

  updateModule: (id: string, data: UpdateModuleData) =>
    apiService.put<ResponseApi<Module>>(`/core/v1/modules/${id}`, data),

  deleteModule: (id: string) =>
    apiService.delete<ResponseApi<void>>(`/core/v1/modules/${id}`),

  restoreModule: (id: string) =>
    apiService.post<ResponseApi<void>>(`/core/v1/modules/${id}/restore`),

  /** Nested Resource: Module Permissions */
  getModulePermissions: (moduleId: string, params?: ListModulePermissionsParams) =>
    apiService.get<ResponseApiWithMeta<Permission[]>>(
      `/core/v1/modules/${moduleId}/permissions`,
      params || {}
    ),

  applyCRUDTemplate: (moduleId: string, data: ApplyCRUDTemplateRequest) =>
    apiService.post<ResponseApi<CRUDTemplateResponse>>(
      `/core/v1/modules/${moduleId}/permissions/apply-crud-template`,
      data
    ),
};
