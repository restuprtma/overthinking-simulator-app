/**
 * Core Module Exports
 * Centralized exports for all core business features
 *
 * This module is organized by sub-features for better code splitting:
 * - auth/  - Authentication pages (login, register, forgot password, etc.)
 * - user/  - User management
 * - role/  - Role management
 *
 * Each sub-feature is bundled separately for optimal lazy loading.
 */

// Re-export all sub-modules
export * from './auth';
export * from './user';
export * from './role';
