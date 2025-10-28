/**
 * Permission Constants
 * Centralized permission definitions
 * Format: {module}.{resource}:{action}
 */

export const PERMISSIONS = {
  // ============================================
  // CORE MODULE PERMISSIONS
  // ============================================

  // User permissions
  USER_VIEW: 'core.users:read',
  USER_CREATE: 'core.users:create',
  USER_EDIT: 'core.users:update',
  USER_DELETE: 'core.users:delete',
  USER_RESTORE: 'core.users:restore',

  // Role permissions
  ROLE_VIEW: 'core.roles:read',
  ROLE_CREATE: 'core.roles:create',
  ROLE_EDIT: 'core.roles:update',
  ROLE_DELETE: 'core.roles:delete',
  ROLE_RESTORE: 'core.roles:restore',

  // Profile permissions
  PROFILE_VIEW: 'core.profile:read',
  PROFILE_UPDATE: 'core.profile:update',

  // Company permissions
  COMPANY_VIEW: 'core.companies:read',
  COMPANY_CREATE: 'core.companies:create',
  COMPANY_EDIT: 'core.companies:update',
  COMPANY_DELETE: 'core.companies:delete',
  COMPANY_MANAGE_USERS: 'core.companies:manage_users',

  // Permission permissions
  PERMISSION_VIEW: 'core.permissions:read',
  PERMISSION_CREATE: 'core.permissions:create',
  PERMISSION_EDIT: 'core.permissions:update',
  PERMISSION_DELETE: 'core.permissions:delete',

  // Permission Template permissions
  PERMISSION_TEMPLATE_VIEW: 'core.permission_templates:read',
  PERMISSION_TEMPLATE_CREATE: 'core.permission_templates:create',
  PERMISSION_TEMPLATE_EDIT: 'core.permission_templates:update',
  PERMISSION_TEMPLATE_DELETE: 'core.permission_templates:delete',
  PERMISSION_TEMPLATE_RESTORE: 'core.permission_templates:restore',

  // ============================================
  // CRM MODULE PERMISSIONS
  // ============================================

  // Lead permissions
  LEAD_VIEW: 'crm.leads:read',
  LEAD_CREATE: 'crm.leads:create',
  LEAD_EDIT: 'crm.leads:update',
  LEAD_DELETE: 'crm.leads:delete',
  LEAD_ASSIGN: 'crm.leads:assign',
  LEAD_CONVERT: 'crm.leads:convert',

  // Deal permissions
  DEAL_VIEW: 'crm.deals:read',
  DEAL_CREATE: 'crm.deals:create',
  DEAL_EDIT: 'crm.deals:update',
  DEAL_DELETE: 'crm.deals:delete',
  DEAL_CLOSE: 'crm.deals:close',

  // Activity permissions
  ACTIVITY_VIEW: 'crm.activities:read',
  ACTIVITY_CREATE: 'crm.activities:create',
  ACTIVITY_EDIT: 'crm.activities:update',
  ACTIVITY_DELETE: 'crm.activities:delete',

  // Chat permissions
  CHAT_VIEW: 'crm.chats:read',
  CHAT_CREATE: 'crm.chats:create',
  CHAT_EDIT: 'crm.chats:update',
  CHAT_DELETE: 'crm.chats:delete',
  CHAT_RESTORE: 'crm.chats:restore',

  // Sales Person permissions
  SALES_PERSON_VIEW: 'crm.sales_persons:read',
  SALES_PERSON_CREATE: 'crm.sales_persons:create',
  SALES_PERSON_EDIT: 'crm.sales_persons:update',
  SALES_PERSON_DELETE: 'crm.sales_persons:delete',
  SALES_PERSON_RESTORE: 'crm.sales_persons:restore',
  SALES_PERSON_WHATSAPP_MANAGE: 'crm.sales_persons:manage',

  // Sales Target permissions
  SALES_TARGET_VIEW: 'crm.sales_targets:read',
  SALES_TARGET_CREATE: 'crm.sales_targets:create',
  SALES_TARGET_EDIT: 'crm.sales_targets:update',
  SALES_TARGET_DELETE: 'crm.sales_targets:delete',

  // Lead Source permissions
  LEAD_SOURCE_VIEW: 'crm.lead_sources:read',
  LEAD_SOURCE_CREATE: 'crm.lead_sources:create',
  LEAD_SOURCE_EDIT: 'crm.lead_sources:update',
  LEAD_SOURCE_DELETE: 'crm.lead_sources:delete',
  LEAD_SOURCE_RESTORE: 'crm.lead_sources:restore',

  // Auto Reply Rule permissions
  AUTO_REPLY_RULE_VIEW: 'crm.auto_reply_rules:read',
  AUTO_REPLY_RULE_CREATE: 'crm.auto_reply_rules:create',
  AUTO_REPLY_RULE_EDIT: 'crm.auto_reply_rules:update',
  AUTO_REPLY_RULE_DELETE: 'crm.auto_reply_rules:delete',
  AUTO_REPLY_RULE_RESTORE: 'crm.auto_reply_rules:restore',

  // Company Settings permissions
  COMPANY_SETTINGS_VIEW: 'crm.company_settings:read',
  COMPANY_SETTINGS_UPDATE: 'crm.company_settings:update',

  // Report permissions
  REPORT_VIEW: 'crm.reports:read',
  REPORT_EXPORT: 'crm.reports:export',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
