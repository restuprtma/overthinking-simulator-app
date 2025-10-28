/** Company Management types - based on OpenAPI spec */

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  code: string;
  tax_id?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  logo_url?: string | null;
  address?: string | null;
  village_id?: string | null;
  max_users: number;
  max_branches: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
}

export interface CreateCompanyData {
  name: string;
  code: string;
  tax_id?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  address?: string;
  village_id?: string;
  max_users?: number;
  max_branches?: number;
}

export interface UpdateCompanyData {
  name?: string;
  tax_id?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  address?: string;
  village_id?: string;
  max_users?: number;
  max_branches?: number;
  is_active?: boolean;
}

export interface ListCompaniesParams {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  owner_id?: string;
}

/**
 * @deprecated Use role_id instead. Kept for backward compatibility.
 */
export type CompanyRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface CompanyUser {
  id: string;
  company_id: string;
  user_id: string;
  /**
   * Company-specific role ID (UUID).
   * - UUID: User has company-specific role
   * - null: User inherits global roles
   */
  role_id?: string | null;
  /**
   * @deprecated Use role_id instead. Kept for backward compatibility.
   */
  role?: CompanyRole;
  is_primary: boolean;
  is_active: boolean;
  joined_at: string;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
  // User information fields
  user_email?: string | null;
  user_username?: string | null;
  user_full_name?: string | null;
}

export interface AddUserToCompanyData {
  user_id: string;
  /**
   * Company-specific role ID (UUID).
   * - Set to UUID: User gets company-specific role
   * - Set to null: User inherits global roles
   */
  role_id?: string | null;
  /**
   * @deprecated Use role_id instead. Kept for backward compatibility.
   */
  role?: CompanyRole;
}

export interface UpdateCompanyUserData {
  /**
   * Company-specific role ID (UUID).
   * - Set to UUID: Change to company-specific role
   * - Set to null: Change to use global roles
   */
  role_id?: string | null;
  /**
   * @deprecated Use role_id instead. Kept for backward compatibility.
   */
  role?: CompanyRole;
  is_active?: boolean;
}

export interface ListCompanyUsersParams {
  page?: number;
  page_size?: number;
  role?: CompanyRole;
  is_active?: boolean;
}
