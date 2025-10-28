/**
 * Route Constants
 * Centralized route path definitions
 */

export const ROUTES = {
  // Root
  ROOT: '/',
  ROOT_PUBLIC: '/auth',

  // Dashboard
  DASHBOARD: '/dashboard',
  SAMPLE_PAGE: '/sample-page',

  // User Management
  USERS: '/users',
  ROLES: '/roles',

  // Core Management
  CORE: {
    USERS: '/users',
    ROLES: '/roles',
    PERMISSIONS: '/permissions',
    MODULES: '/modules',
    PERMISSION_TEMPLATES: '/permission-templates',
    COMPANIES: '/companies',
  },

  // CRM Routes
  CRM: {
    DASHBOARD: '/dashboard',
    CHATS: '/chats',
    LEADS: '/leads',
    DEALS: '/deals',
    REPORTS: {
      REVENUE_VS_TARGET: '/reports/revenue-vs-target',
    },
  },

  // Auth Routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    TWO_STEPS: '/auth/two-steps',
    MAINTENANCE: '/auth/maintenance',
    ERROR_404: '/auth/404',
  },

  // Error Routes
  ERROR: {
    FORBIDDEN: '/403',
    NOT_FOUND: '/404',
  },

  // Future routes can be added here
} as const;

/**
 * Convert absolute auth path to relative path for nested routing
 * Strips the ROOT_PUBLIC prefix to make path relative
 *
 * @example
 * publicUrl('/auth/login') // returns 'login'
 * publicUrl('/auth/register') // returns 'register'
 */
export const publicUrl = (path: string): string => {
  return path.replace(ROUTES.ROOT_PUBLIC + '/', '');
};
