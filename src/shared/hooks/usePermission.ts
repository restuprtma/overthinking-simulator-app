import { useCallback, useMemo } from 'react';
import { useAuth } from '@/app/auth';
import { authService } from '@/app/services/authService';

/**
 * Permission Hook
 * Provides permission checking utilities for components
 * Permissions are extracted from JWT token
 */
export const usePermission = () => {
  const { isAuthenticated } = useAuth();

  /**
   * Get user permissions from JWT token
   * Memoized to avoid re-decoding token on every render
   */
  const userPermissions = useMemo(() => {
    if (!isAuthenticated) return [];
    return authService.getUserPermissions();
  }, [isAuthenticated]);

  /**
   * Get user roles from JWT token
   * Memoized to avoid re-decoding token on every render
   */
  const userRoles = useMemo(() => {
    if (!isAuthenticated) return [];
    return authService.getUserRoles();
  }, [isAuthenticated]);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      return userPermissions.includes(permission);
    },
    [userPermissions]
  );

  /**
   * Check if user has ALL specified permissions
   */
  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      return permissions.every((permission) =>
        userPermissions.includes(permission)
      );
    },
    [userPermissions]
  );

  /**
   * Check if user has AT LEAST ONE of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      return permissions.some((permission) =>
        userPermissions.includes(permission)
      );
    },
    [userPermissions]
  );

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (role: string): boolean => {
      return userRoles.includes(role);
    },
    [userRoles]
  );

  /**
   * Check if user has ALL specified roles
   */
  const hasAllRoles = useCallback(
    (roles: string[]): boolean => {
      return roles.every((role) => userRoles.includes(role));
    },
    [userRoles]
  );

  /**
   * Check if user has AT LEAST ONE of the specified roles
   */
  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      return roles.some((role) => userRoles.includes(role));
    },
    [userRoles]
  );

  return {
    // Permission checks
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,

    // Role checks
    hasRole,
    hasAllRoles,
    hasAnyRole,

    // Raw data (for advanced use cases)
    permissions: userPermissions,
    roles: userRoles,
  };
};
