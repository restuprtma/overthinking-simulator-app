/**
 * Modules Root Exports
 * Centralized barrel export for all application modules
 *
 * This file serves as the single entry point for all module imports.
 * It enforces module boundaries and provides clear separation of concerns.
 *
 * Architecture:
 * - modules/core/    - Core business features (auth, user, role)
 * - modules/common/  - Shared pages and utilities (errors, samples)
 * - modules/finance/ - Finance domain features (future)
 *
 * Usage:
 * ```typescript
 * // ✅ Good - Import from module boundary
 * import { LoginPage, UserPage } from '@/modules';
 * import { ForbiddenPage } from '@/modules';
 *
 * // ❌ Bad - Direct import bypasses module boundary
 * import LoginPage from '@/modules/core/auth/LoginPage';
 * ```
 */

// Re-export all core module pages
export * from './core';

// Re-export all common module pages
export * from './common';

// Finance module (placeholder for future features)
// export * from './finance';
