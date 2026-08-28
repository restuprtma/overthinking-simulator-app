export type ApiEnvelope<T> = {
  data: T | null;
  message: string;
  meta: unknown | null;
  errors: string | null;
};

export type User = {
  id: string;
  email: string;
  username: string;
  full_name: string;
};

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
};

export type SignInResponse = TokenPair & {
  user: User;
  roles: string[];
  permissions: string[];
};

export type SignUpResponse = {
  message: string;
  user: User;
};

export type GoogleSignInParams = {
  id_token: string;
};

export type GoogleSignInResponse = SignInResponse & {
  is_new_user: boolean;
};

export type MeResponse = {
  user: User;
  roles: string[];
  permissions: string[];
  is_super_admin: boolean;
};

export type AuthState = {
  loading: boolean;
  user: User | null;
  roles: string[];
  permissions: string[];
  isSuperAdmin: boolean;
};

export type SignInParams = {
  login: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  phone?: string;
  company_name?: string;
};

export type AuthContextValue = AuthState & {
  authenticated: boolean;
  unauthenticated: boolean;
  signIn: (params: SignInParams) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<void>;
  signInWithGoogle: () => Promise<{ isNewUser: boolean }>;
  signOut: (options?: { allDevices?: boolean }) => Promise<void>;
  checkUserSession: () => Promise<void>;
};

