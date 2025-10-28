/**
 * Generic API Response Wrapper
 * Standard response structure for all API endpoints
 */

export interface ResponseApi<T> {
  data: T;
  message: string;
  meta?: {
    pagination: {
      limit: number;
      page: number;
      total: number;
      total_pages: number;
    };
  };
  errors?: any;
}

/**
 * API Response with required meta (for paginated responses)
 */
export type ResponseApiWithMeta<T> = ResponseApi<T> & {
  meta: NonNullable<ResponseApi<T>['meta']>;
};

/**
 * API Error Response Structure
 * Standard error structure from backend API
 */
export interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
  message?: string;
  code?: string;
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'message' in error)
  );
}
