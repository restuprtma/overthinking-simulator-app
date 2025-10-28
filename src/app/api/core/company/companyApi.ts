import { apiService } from '@/app/services/apiService';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import type {
  AddUserToCompanyData,
  Company,
  CompanyUser,
  CreateCompanyData,
  ListCompaniesParams,
  ListCompanyUsersParams,
  UpdateCompanyData,
  UpdateCompanyUserData,
} from './type';

/** Company API endpoints */

export const companyApi = {
  // Company CRUD
  createCompany: (data: CreateCompanyData) =>
    apiService.post<ResponseApi<Company>>('/core/v1/companies', data),

  listCompanies: (params?: ListCompaniesParams) =>
    apiService.get<ResponseApiWithMeta<Company[]>>('/core/v1/companies', params || {}),

  getCompanyById: (id: string) =>
    apiService.get<ResponseApi<Company>>(`/core/v1/companies/${id}`),

  updateCompany: (id: string, data: UpdateCompanyData) =>
    apiService.put<ResponseApi<Company>>(`/core/v1/companies/${id}`, data),

  deleteCompany: (id: string) =>
    apiService.delete<ResponseApi<void>>(`/core/v1/companies/${id}`),

  // Company Users Management
  listCompanyUsers: (companyId: string, params?: ListCompanyUsersParams) =>
    apiService.get<ResponseApiWithMeta<CompanyUser[]>>(
      `/core/v1/companies/${companyId}/users`,
      params || {}
    ),

  addUserToCompany: (companyId: string, data: AddUserToCompanyData) =>
    apiService.post<ResponseApi<CompanyUser>>(
      `/core/v1/companies/${companyId}/users`,
      data
    ),

  updateCompanyUser: (companyId: string, userId: string, data: UpdateCompanyUserData) =>
    apiService.put<ResponseApi<CompanyUser>>(
      `/core/v1/companies/${companyId}/users/${userId}`,
      data
    ),

  removeUserFromCompany: (companyId: string, userId: string) =>
    apiService.delete<ResponseApi<void>>(
      `/core/v1/companies/${companyId}/users/${userId}`
    ),
};
