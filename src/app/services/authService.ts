/**
 * Auth Service
 * Application-level authentication utilities with JWT token management
 */

import { jwtDecode } from 'jwt-decode';
import { storageService } from './storageService';
import type { User, DecodedToken } from '../api/core/auth/type';

// Storage keys
const TOKEN_KEY = 'access_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const LAST_ACTIVITY_KEY = 'last_activity';

export const authService = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = storageService.get<string>(TOKEN_KEY);
    if (!token) return false;

    // Check if token is expired
    return !authService.isTokenExpired(token);
  },

  /**
   * Store authentication token with expiry tracking
   */
  setToken: (token: string): void => {
    storageService.set(TOKEN_KEY, token);

    // Decode and store expiry time
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      storageService.set(TOKEN_EXPIRY_KEY, decoded.exp * 1000); // Convert to milliseconds
    } catch (error) {
      // Token decode failed, clear and return
      authService.clearAuth();
      return;
    }

    // Update last activity
    authService.updateLastActivity();
  },

  /**
   * Get authentication token
   */
  getToken: (): string | null => {
    const token = storageService.get<string>(TOKEN_KEY);
    if (!token) return null;

    // Return null if token is expired
    if (authService.isTokenExpired(token)) {
      authService.clearAuth();
      return null;
    }

    return token;
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: (token?: string): boolean => {
    try {
      const tokenToCheck = token || storageService.get<string>(TOKEN_KEY);
      if (!tokenToCheck) return true;

      const decoded = jwtDecode<DecodedToken>(tokenToCheck);
      const currentTime = Date.now();
      const expiryTime = decoded.exp * 1000;

      // Add 5 second buffer to prevent edge cases
      return currentTime >= expiryTime - 5000;
    } catch (error) {
      return true;
    }
  },

  /**
   * Get token expiry time in milliseconds
   */
  getTokenExpiry: (): number | null => {
    return storageService.get<number>(TOKEN_EXPIRY_KEY);
  },

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiry: (): number => {
    const expiry = authService.getTokenExpiry();
    if (!expiry) return 0;

    const timeLeft = expiry - Date.now();
    return Math.max(0, timeLeft);
  },

  /**
   * Get user data extracted from JWT token
   * No localStorage needed - all data from token
   */
  getUser: (): User | null => {
    const token = storageService.get<string>(TOKEN_KEY);
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        id: decoded.user_id,
        company_id: decoded.company_id,
        company_name: decoded.company_name,
        email: decoded.email,
        username: decoded.username,
        full_name: decoded.full_name,
        is_active: true,
        is_email_verified: true,
        last_login_at: null,
      };
    } catch (error) {
      return null;
    }
  },

  /**
   * Get user roles from token
   */
  getUserRoles: (): string[] => {
    const token = storageService.get<string>(TOKEN_KEY);
    if (!token) return [];

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.roles || [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Get user permissions from token
   */
  getUserPermissions: (): string[] => {
    const token = storageService.get<string>(TOKEN_KEY);
    if (!token) return [];

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.permissions || [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Store authentication data with synchronization
   * Only stores token - user data extracted from token when needed
   */
  setAuthData: async (token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Store only token (user data will be extracted from token)
        authService.setToken(token);

        // Verify token was stored correctly
        const storedToken = storageService.get<string>(TOKEN_KEY);

        if (!storedToken) {
          throw new Error('Failed to store authentication token');
        }

        // Dispatch custom event untuk same-tab sync
        window.dispatchEvent(
          new CustomEvent('auth-token-changed', {
            detail: { token },
          }),
        );

        // Also dispatch storage event for cross-tab sync
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: TOKEN_KEY,
            newValue: token,
            storageArea: localStorage,
          }),
        );

        // Beri waktu untuk React batch updates
        setTimeout(() => {
          resolve();
        }, 50);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Clear all authentication data
   */
  clearAuth: (): void => {
    storageService.remove(TOKEN_KEY);
    storageService.remove(TOKEN_EXPIRY_KEY);
    storageService.remove(LAST_ACTIVITY_KEY);
  },

  /**
   * Check if user has specific permission
   */
  hasPermission: (permission: string): boolean => {
    const permissions = authService.getUserPermissions();
    return permissions.includes(permission);
  },

  /**
   * Check if user has specific role
   */
  hasRole: (roleName: string): boolean => {
    const roles = authService.getUserRoles();
    return roles.includes(roleName);
  },

  /**
   * Update last activity timestamp
   */
  updateLastActivity: (): void => {
    storageService.set(LAST_ACTIVITY_KEY, Date.now());
  },

  /**
   * Get last activity timestamp
   */
  getLastActivity: (): number | null => {
    return storageService.get<number>(LAST_ACTIVITY_KEY);
  },

  /**
   * Check if session has timed out due to inactivity
   * @param timeoutMs - Session timeout in milliseconds
   */
  isSessionTimedOut: (timeoutMs: number): boolean => {
    const lastActivity = authService.getLastActivity();
    if (!lastActivity) return false;

    const timeSinceActivity = Date.now() - lastActivity;
    return timeSinceActivity > timeoutMs;
  },

  /**
   * Get session timeout from environment variable
   * Default: 24 hours (86400000 ms)
   */
  getSessionTimeout: (): number => {
    const envTimeout = import.meta.env.VITE_SESSION_TIMEOUT_HOURS;
    const hours = envTimeout ? parseInt(envTimeout, 10) : 24;
    return hours * 60 * 60 * 1000; // Convert hours to milliseconds
  },
};
