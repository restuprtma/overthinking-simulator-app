import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../auth';

/**
 * Guest Guard Component
 * Redirects authenticated users away from guest-only pages (login, register, etc.)
 */

interface GuestGuardProps {
  children: ReactNode;
}

export const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't render anything while checking authentication
  if (isLoading) {
    return null;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is not authenticated, allow access to guest pages
  return <>{children}</>;
};
