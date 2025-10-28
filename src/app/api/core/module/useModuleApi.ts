import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import { moduleApi } from './moduleApi';
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

/** Module API React Query hooks */

export const moduleKeys = {
  all: ['modules'] as const,
  lists: () => [...moduleKeys.all, 'list'] as const,
  list: (params?: ListModulesParams) => [...moduleKeys.lists(), params] as const,
  tree: () => [...moduleKeys.all, 'tree'] as const,
  details: () => [...moduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...moduleKeys.details(), id] as const,
  permissions: (moduleId: string) => [...moduleKeys.all, moduleId, 'permissions'] as const,
  permissionList: (moduleId: string, params?: ListModulePermissionsParams) =>
    [...moduleKeys.permissions(moduleId), 'list', params] as const,
};

export const usePostModules = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<Module>>,
    AxiosError,
    CreateModuleData
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateModuleData) => moduleApi.createModule(data),
    onSuccess: async (response, ...args) => {
      // Invalidate all module lists
      await queryClient.invalidateQueries({
        queryKey: moduleKeys.lists(),
      });
      // Also invalidate the entire modules cache to be safe
      await queryClient.invalidateQueries({ queryKey: moduleKeys.all });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const usePutModules = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<Module>>,
    AxiosError,
    { id: string; data: UpdateModuleData }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModuleData }) =>
      moduleApi.updateModule(id, data),
    onSuccess: async (response, variables, ...args) => {
      // Invalidate specific module detail
      await queryClient.invalidateQueries({
        queryKey: moduleKeys.detail(variables.id),
      });
      // Invalidate all module lists
      await queryClient.invalidateQueries({
        queryKey: moduleKeys.lists(),
      });
      // Also invalidate the entire modules cache to be safe
      await queryClient.invalidateQueries({ queryKey: moduleKeys.all });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeleteModules = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => moduleApi.deleteModule(id),
    onSuccess: (response, id, ...args) => {
      queryClient.invalidateQueries({
        queryKey: moduleKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: moduleKeys.lists() });
      options?.onSuccess?.(response, id, ...args);
    },
    ...options,
  });
};

export const useRestoreModule = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => moduleApi.restoreModule(id),
    onSuccess: (response, id, ...args) => {
      queryClient.invalidateQueries({
        queryKey: moduleKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: moduleKeys.lists() });
      options?.onSuccess?.(response, id, ...args);
    },
    ...options,
  });
};

export const useGetListModules = (
  params?: ListModulesParams,
  options?: Omit<
    UseQueryOptions<AxiosResponse<ResponseApi<Module[]>>, AxiosError>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: moduleKeys.list(params),
    queryFn: () => moduleApi.listModules(params),
    ...options,
  });
};

export const useGetModule = (
  id: string,
  options?: Omit<
    UseQueryOptions<AxiosResponse<ResponseApi<Module>>, AxiosError>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: moduleKeys.detail(id),
    queryFn: () => moduleApi.getModuleById(id),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

/** Nested Resource: Module Permissions Hooks */

export const useGetModulePermissions = (
  moduleId: string,
  params?: ListModulePermissionsParams,
  options?: Omit<
    UseQueryOptions<AxiosResponse<ResponseApiWithMeta<Permission[]>>, AxiosError>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: moduleKeys.permissionList(moduleId, params),
    queryFn: () => moduleApi.getModulePermissions(moduleId, params),
    enabled: !!moduleId && (options?.enabled ?? true),
    ...options,
  });
};

export const useApplyCRUDTemplate = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<CRUDTemplateResponse>>,
    AxiosError,
    { moduleId: string; data: ApplyCRUDTemplateRequest }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: string; data: ApplyCRUDTemplateRequest }) =>
      moduleApi.applyCRUDTemplate(moduleId, data),
    onSuccess: async (response, variables, ...args) => {
      // Invalidate module permissions
      await queryClient.invalidateQueries({
        queryKey: moduleKeys.permissions(variables.moduleId),
      });
      // Invalidate module detail (for permissions_count update)
      await queryClient.invalidateQueries({
        queryKey: moduleKeys.detail(variables.moduleId),
      });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useGetModuleTree = (
  options?: Omit<
    UseQueryOptions<AxiosResponse<ModuleTreeData>, AxiosError>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: moduleKeys.tree(),
    queryFn: () => moduleApi.getModuleTree(),
    ...options,
  });
};
