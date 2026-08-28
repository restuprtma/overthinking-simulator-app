import type { ApiEnvelope } from 'src/module/core/features/auth/types';

// ----------------------------------------------------------------------

export type User = {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  is_email_verified: boolean;
  role_name?: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserListParams = {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
};

export type CreateUserPayload = {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  phone?: string;
  role_id?: string;
};

export type UpdateUserPayload = {
  email?: string;
  username?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
  role_id?: string;
};

export type UserListEnvelope = ApiEnvelope<User[]>;

