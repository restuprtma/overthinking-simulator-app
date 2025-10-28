import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { storageService } from './storageService';
import { ROUTES } from '../constants/router';

/**
 * API Service
 * HTTP client with automatic token injection, refresh logic, and 401 handling
 */

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
}

class ApiService {
  private api: AxiosInstance;
  private apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    this.api = axios.create({
      baseURL: this.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = storageService.get<string>('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Don't auto-logout for company endpoints - let component handle error
          const isCompanyEndpoint = originalRequest.url?.includes('/auth/companies') ||
                                     originalRequest.url?.includes('/auth/switch-company');

          if (isCompanyEndpoint) {
            // Let component handle company endpoint errors
            return Promise.reject(error);
          }

          // For other endpoints, logout as before
          this.handleAuthFailure();
          return Promise.reject(error);
        }

        return Promise.reject(error);
      },
    );
  }

  private handleAuthFailure(): void {
    // Clear all auth data
    storageService.remove('access_token');
    storageService.remove('token_expiry');
    storageService.remove('last_activity');

    const currentPath = window.location.pathname;
    const isAuthPage = currentPath.includes('/auth/');

    // Redirect to login if not already on auth page
    if (!isAuthPage) {
      window.location.href = ROUTES.AUTH.LOGIN;
    }
  }

  private buildUrl(url: string): string {
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `${this.apiUrl}${url}`;
    const [path, query] = fullUrl.split('?');
    const cleanPath = path.replace(/\/$/, '');
    return query ? `${cleanPath}?${query}` : cleanPath;
  }

  /** GET request with automatic query param filtering */
  async get<T = unknown>(url: string, params: Record<string, unknown> | object = {}): Promise<AxiosResponse<T>> {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '',
      ),
    );

    return this.api.get<T>(this.buildUrl(url), { params: queryParams });
  }

  /** POST request with JSON body */
  async post<T = unknown>(url: string, payloads: unknown = {}): Promise<AxiosResponse<T>> {
    return this.api.post<T>(this.buildUrl(url), payloads);
  }

  /** POST with URL-encoded form data */
  async postForm<T = unknown>(
    url: string,
    payloads: Record<string, unknown> | object = {},
  ): Promise<AxiosResponse<T>> {
    const formData = new URLSearchParams();

    Object.entries(payloads).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    return this.api.post<T>(this.buildUrl(url), formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /** PUT request with JSON body */
  async put<T = unknown>(url: string, payloads: unknown = {}): Promise<AxiosResponse<T>> {
    return this.api.put<T>(this.buildUrl(url), payloads);
  }

  /** PATCH request with JSON body */
  async patch<T = unknown>(url: string, payloads: unknown = {}): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(this.buildUrl(url), payloads);
  }

  /** DELETE request */
  async delete<T = unknown>(url: string): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(this.buildUrl(url));
  }
}

export const apiService = new ApiService();
export default apiService;
