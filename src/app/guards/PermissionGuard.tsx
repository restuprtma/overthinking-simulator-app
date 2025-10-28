import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../auth';
import { ROUTES } from '../constants/router';
import { authService } from '../services/authService';

/**
 * Permission Guard Component
 * Checks if user has required permission(s)
 */

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user must have AT LEAST ONE
  fallbackPath?: string; // Where to redirect if permission check fails (default: "/")
}

export const PermissionGuard = ({
  children,
  permission,
  permissions = [],
  requireAll = true,
  fallbackPath = ROUTES.ERROR.FORBIDDEN,
}: PermissionGuardProps) => {
  const { isLoading, isAuthenticated } = useAuth();

  // Build permissions array
  const permissionsToCheck = permission ? [permission] : permissions;

  // No permissions specified, allow access
  if (permissionsToCheck.length === 0) {
    return <>{children}</>;
  }

  // Wait for user data to load before checking permissions
  if (isLoading) {
    return null;
  }

  // Must be authenticated to check permissions
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  // Get user permissions from JWT token
  const userPermissions = authService.getUserPermissions();

  // Check permissions
  const hasPermission = requireAll
    ? permissionsToCheck.every((perm) => userPermissions.includes(perm))
    : permissionsToCheck.some((perm) => userPermissions.includes(perm));

  // Redirect if permission check fails
  if (!hasPermission) {
    return <Navigate to={fallbackPath} replace />;
  }

  // User has required permissions
  return <>{children}</>;
};

