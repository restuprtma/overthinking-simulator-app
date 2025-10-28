/**
 * Common Module Exports
 * Centralized exports for common/shared features
 *
 * This module is organized by sub-features for better code splitting:
 * - errors/      - Error pages (403, 404)
 * - sample-page/ - Sample/demo pages
 *
 * Each sub-feature is bundled separately for optimal lazy loading.
 */

// Re-export all sub-modules
export * from './errors';
export * from './sample-page';
