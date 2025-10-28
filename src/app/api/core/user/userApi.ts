import { apiService } from '@/app/services/apiService';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import type {
  CreateUserData,
  ListUsersParams,
  UpdateUserData,
  User,
} from './type';

/** User API endpoints */

export const userApi = {
  createUser: (data: CreateUserData) =>
    apiService.post<ResponseApi<User>>('/core/v1/users', data),

  listUsers: (params?: ListUsersParams) =>
    apiService.get<ResponseApiWithMeta<User[]>>('/core/v1/users', params || {}),

  getUserById: (id: string) =>
    apiService.get<ResponseApi<User>>(`/core/v1/users/${id}`),

  updateUser: (id: string, data: UpdateUserData) =>
    apiService.put<ResponseApi<User>>(`/core/v1/users/${id}`, data),

  deleteUser: (id: string) =>
    apiService.delete<ResponseApi<void>>(`/core/v1/users/${id}`),

  restoreUser: (id: string) =>
    apiService.post<ResponseApi<void>>(`/core/v1/users/${id}/restore`),
};
