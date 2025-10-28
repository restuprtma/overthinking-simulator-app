import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../auth';
import { ROUTES } from '../constants/router';
import Spinner from '../../shared/components/common/Spinner';

/**
 * Auth Guard Component
 * Protects routes that require authentication
 */

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <Spinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};
