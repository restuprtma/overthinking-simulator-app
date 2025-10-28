/** Sales Person API types based on backend OpenAPI spec */

export interface SalesPerson {
  id: string;
  company_user_id: string;
  sales_code: string;
  sales_name: string | null;
  sales_area: string | null;
  sales_target: number | null;
  commission_rate: number | null;
  whatsapp: string | null;
  is_whatsapp_connected: boolean;
  is_active: boolean;
  notes: string | null;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
  audit: {
    created_at: string;
    created_by: string | null;
    created_by_name?: string | null;
    updated_at: string;
    updated_by: string | null;
    updated_by_name?: string | null;
    deleted_at?: string | null;
    deleted_by?: string | null;
    deleted_by_name?: string | null;
  };
}

export interface CreateSalesPersonData {
  company_user_id: string;
  sales_code: string;
  sales_name?: string | null;
  sales_area?: string | null;
  sales_target?: number | null;
  commission_rate?: number | null;
  whatsapp?: string | null;
  is_whatsapp_connected?: boolean | null;
  is_active?: boolean | null;
  notes?: string | null;
}

export interface UpdateSalesPersonData {
  sales_code?: string;
  sales_name?: string | null;
  sales_area?: string | null;
  sales_target?: number | null;
  commission_rate?: number | null;
  whatsapp?: string | null;
  is_whatsapp_connected?: boolean | null;
  is_active?: boolean | null;
  notes?: string | null;
}

export interface ListSalesPersonsParams {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  is_whatsapp_connected?: boolean;
  sales_area?: string;
}

/** WhatsApp Integration Types */

export type WhatsAppSessionStatus = 'STARTING' | 'SCAN_QR_CODE' | 'WORKING' | 'FAILED' | 'STOPPED';

export interface WhatsAppConnectData {
  sales_person_id: string;
  session_name: string;
  whatsapp_number: string;
  pairing_code: string;
  status: WhatsAppSessionStatus;
  expires_at: string;
}

export interface WhatsAppConnectResponse {
  data: WhatsAppConnectData;
  message: string;
}

export interface WhatsAppStatusData {
  sales_person_id: string;
  session_name?: string | null;
  whatsapp_number: string;
  status: WhatsAppSessionStatus | null;
  is_connected: boolean;
  pairing_code?: string | null;
  pairing_code_expires_at?: string | null;
  connected_at?: string | null;
  disconnected_at?: string | null;
  last_seen_at?: string | null;
}

export interface WhatsAppStatusResponse {
  data: WhatsAppStatusData;
  message: string;
}

export interface WhatsAppActionResponse {
  message: string;
}
