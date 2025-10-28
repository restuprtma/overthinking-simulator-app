import { apiService } from '@/app/services/apiService';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import type {
  CreateSalesPersonData,
  ListSalesPersonsParams,
  SalesPerson,
  UpdateSalesPersonData,
  WhatsAppConnectResponse,
  WhatsAppStatusResponse,
  WhatsAppActionResponse,
} from './type';

/** Sales Person API endpoints */

export const salesPersonApi = {
  createSalesPerson: (data: CreateSalesPersonData) =>
    apiService.post<ResponseApi<SalesPerson>>('/crm/v1/sales-persons', data),

  listSalesPersons: (params?: ListSalesPersonsParams) =>
    apiService.get<ResponseApiWithMeta<SalesPerson[]>>('/crm/v1/sales-persons', params || {}),

  getSalesPersonById: (id: string) =>
    apiService.get<ResponseApi<SalesPerson>>(`/crm/v1/sales-persons/${id}`),

  updateSalesPerson: (id: string, data: UpdateSalesPersonData) =>
    apiService.put<ResponseApi<SalesPerson>>(`/crm/v1/sales-persons/${id}`, data),

  deleteSalesPerson: (id: string) =>
    apiService.delete<ResponseApi<void>>(`/crm/v1/sales-persons/${id}`),

  restoreSalesPerson: (id: string) =>
    apiService.post<ResponseApi<void>>(`/crm/v1/sales-persons/${id}/restore`),

  /** WhatsApp Integration endpoints */

  connectWhatsApp: (id: string) =>
    apiService.post<WhatsAppConnectResponse>(`/crm/v1/sales-persons/${id}/whatsapp/connect`),

  getWhatsAppStatus: (id: string) =>
    apiService.get<WhatsAppStatusResponse>(`/crm/v1/sales-persons/${id}/whatsapp/status`),

  disconnectWhatsApp: (id: string) =>
    apiService.post<WhatsAppActionResponse>(`/crm/v1/sales-persons/${id}/whatsapp/disconnect`),

  restartWhatsApp: (id: string) =>
    apiService.post<WhatsAppActionResponse>(`/crm/v1/sales-persons/${id}/whatsapp/restart`),
};
