import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './authContext';
import { authApi } from '../api/core/auth/authApi';
import { useGetProfile } from '../api/core/auth/useAuthApi';
import { authService } from '../services/authService';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import type { User } from '../api/core/auth/type';

/**
 * Auth Provider
 * Manages authentication state and provides auth methods
 */

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize user from storage to prevent redirect loop
  const [user, setUser] = useState<User | null>(() => {
    return authService.getUser();
  });

  // Fetch user profile from API if token exists
  const {
    data: profileData,
    isLoading,
    refetch: refetchProfile,
  } = useGetProfile();

  // Session timeout handler
  useSessionTimeout({
    enabled: !!user,
    onTimeout: () => {
      setUser(null);
      console.log('Session timed out, user logged out');
    },
  });

  // Sync user state with profile query data
  useEffect(() => {
    if (profileData?.data?.data) {
      const userData = profileData.data.data;
      setUser(userData);
    } else if (!authService.getToken()) {
      // Clear user if no token
      setUser(null);
    }
  }, [profileData]);

  // Listen for auth token changes (same-tab via custom event)
  useEffect(() => {
    const handleAuthTokenChange = (event: CustomEvent) => {
      const { token } = event.detail;
      console.log('Auth token changed event detected (same-tab)');

      if (token) {
        // Extract user from token
        const userData = authService.getUser();
        setUser(userData);
        console.log('User authenticated via custom event');
      } else {
        setUser(null);
        console.log('User logged out via custom event');
      }
    };

    window.addEventListener('auth-token-changed' as any, handleAuthTokenChange);

    return () => {
      window.removeEventListener('auth-token-changed' as any, handleAuthTokenChange);
    };
  }, []);

  // Listen for storage events to sync auth state across tabs (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Only react to token changes from other tabs
      if (event.key === 'access_token') {
        console.log('Storage event detected (cross-tab), token changed:', event.newValue ? 'added/updated' : 'removed');

        if (event.newValue) {
          // Token added - user logged in in another tab
          const userData = authService.getUser();
          if (userData) {
            setUser(userData);
            console.log('User authenticated via storage event (cross-tab)');
          }
        } else {
          // Token removed - user logged out in another tab
          setUser(null);
          console.log('User logged out via storage event (cross-tab)');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /**
   * Login user
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { access_token } = response.data.data;

      // Store only token (user data extracted from token)
      authService.setToken(access_token);

      // Extract user from token and set state
      const userData = authService.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // Clear auth data
      authService.clearAuth();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Refresh user data
   * Uses React Query refetch for automatic cache update
   */
  const refreshUser = async () => {
    try {
      await refetchProfile();
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails, clear auth
      authService.clearAuth();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    // Check token first to prevent redirect loop during initial load
    isAuthenticated: !!authService.getToken(),
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
