/** Auth types */

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  permissions?: string[];
}

export interface User {
  id: string;
  company_id: string;
  company_name: string;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_email_verified: boolean;
  last_login_at: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface UpdateAccountData {
  name?: string;
  email?: string;
}

export interface LoginData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface DecodedToken {
  user_id: string;
  company_id: string;
  company_name: string;
  email: string;
  username: string;
  full_name: string;
  roles: string[];
  permissions: string[];
  iss: string;
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  new_password: string;
}

// Company Management types
export interface CompanyBasic {
  id: string;
  name: string;
  code: string;
  logo_url?: string | null;
}

export interface SwitchCompanyRequest {
  company_id: string;
}

export interface SwitchCompanyResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  company: CompanyBasic;
}

export interface GetUserCompaniesResponse {
  companies: CompanyBasic[];
}
