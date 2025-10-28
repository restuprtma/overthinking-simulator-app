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

      if (token) {
        // Extract user from token
        const userData = authService.getUser();
        setUser(userData);
      } else {
        setUser(null);
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
        if (event.newValue) {
          // Token added - user logged in in another tab
          const userData = authService.getUser();
          if (userData) {
            setUser(userData);
          }
        } else {
          // Token removed - user logged out in another tab
          setUser(null);
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
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    // Clear auth data
    authService.clearAuth();
    setUser(null);
  };

  /**
   * Refresh user data
   * Uses React Query refetch for automatic cache update
   */
  const refreshUser = async () => {
    try {
      await refetchProfile();
    } catch (error) {
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
