import type { Role } from '../auth/type';

/** User Management types - for admin user CRUD operations */

// User type for user management (different from auth User)
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  phone?: string | null;
  is_active: boolean;
  is_email_verified: boolean;
  last_login_at?: string | null;
  roles: Role[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
}

export type { Role };

export interface CreateUserData {
  email: string;
  password: string;
  username: string;
  full_name?: string;
  phone?: string;
  role_ids?: string[];
}

export interface ListUsersParams {
  page?: number;
  page_size?: number;
  search?: string;
  full_name?: string;
  username?: string;
  email?: string;
  is_active?: boolean;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  full_name?: string;
  phone?: string;
  is_active?: boolean;
  role_ids?: string[];
}
