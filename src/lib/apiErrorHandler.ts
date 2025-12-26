import { TFunction } from 'i18next';
import { toast } from 'sonner';

/**
 * API Error interface
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
  code?: string;
}

/**
 * Options for API error handling
 */
export interface ApiErrorHandlerOptions {
  showToast?: boolean;
  defaultMessage?: string;
  customMessages?: Record<number, string>;
}

/**
 * Handle API errors with translation support
 * @param error - Error object from API call
 * @param t - Translation function from useTranslation
 * @param options - Optional configuration for error handling
 * @returns Structured API error object
 */
export function handleApiError(
  error: any,
  t: TFunction,
  options?: ApiErrorHandlerOptions
): ApiError {
  const {
    showToast = true,
    defaultMessage = 'error.generic',
    customMessages = {},
  } = options || {};

  const apiError: ApiError = {
    message: t(defaultMessage),
    status: error?.response?.status,
  };

  // Handle validation errors (422)
  if (error?.response?.status === 422 && error?.response?.data?.errors) {
    apiError.errors = error.response.data.errors;
    apiError.message = t('validation.formErrors');
  }
  // Handle unauthorized errors (401)
  else if (error?.response?.status === 401) {
    apiError.message = t('error.unauthorized');
  }
  // Handle forbidden errors (403)
  else if (error?.response?.status === 403) {
    apiError.message = t('error.unauthorized');
  }
  // Handle not found errors (404)
  else if (error?.response?.status === 404) {
    apiError.message = t('error.notFound');
  }
  // Handle server errors (500+)
  else if (error?.response?.status >= 500) {
    apiError.message = t('error.serverError');
  }
  // Handle custom status code messages
  else if (error?.response?.status && customMessages[error.response.status]) {
    apiError.message = t(customMessages[error.response.status]);
  }
  // Handle specific error messages from backend
  else if (error?.response?.data?.message) {
    apiError.message = error.response.data.message;
  }
  // Handle network errors
  else if (error?.message === 'Network Error') {
    apiError.message = t('error.networkError');
  }
  // Handle timeout errors
  else if (error?.code === 'ECONNABORTED') {
    apiError.message = t('error.timeout');
  }

  // Show toast notification if enabled
  if (showToast) {
    toast.error(apiError.message);
  }

  return apiError;
}

/**
 * Handle API success with toast notification
 * @param message - Success message key or string
 * @param t - Translation function from useTranslation
 * @param showToast - Whether to show toast notification
 */
export function handleApiSuccess(
  message: string,
  t: TFunction,
  showToast: boolean = true
): void {
  if (showToast) {
    // Check if message is a translation key
    const translatedMessage = message.includes('.') ? t(message) : message;
    toast.success(translatedMessage);
  }
}

/**
 * Extract field-specific error messages from validation errors
 * @param errors - Validation errors object
 * @param field - Field name
 * @returns First error message for the field or undefined
 */
export function getFieldError(
  errors: Record<string, string[]> | undefined,
  field: string
): string | undefined {
  if (!errors || !errors[field]) {
    return undefined;
  }
  
  const fieldErrors = errors[field];
  return Array.isArray(fieldErrors) && fieldErrors.length > 0
    ? fieldErrors[0]
    : undefined;
}

/**
 * Check if error is a validation error
 * @param error - Error object
 * @returns True if error is a validation error
 */
export function isValidationError(error: any): boolean {
  return error?.response?.status === 422 && !!error?.response?.data?.errors;
}

/**
 * Check if error is an authentication error
 * @param error - Error object
 * @returns True if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  return error?.response?.status === 401;
}

/**
 * Check if error is a network error
 * @param error - Error object
 * @returns True if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return error?.message === 'Network Error' || !error?.response;
}

/**
 * Retry handler for failed API calls
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param delay - Delay between retries in milliseconds
 * @returns Promise that resolves with the function result
 */
export async function retryApiCall<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on validation or auth errors
      if (isValidationError(error) || isAuthError(error)) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
}

/**
 * Create error handler for React Query mutations
 * @param t - Translation function
 * @param defaultMessage - Default error message key
 * @returns Error handler function
 */
export function createMutationErrorHandler(
  t: TFunction,
  defaultMessage: string = 'error.generic'
) {
  return (error: any) => {
    handleApiError(error, t, { defaultMessage });
  };
}

/**
 * Create error handler for React Query queries
 * @param t - Translation function
 * @param defaultMessage - Default error message key
 * @param showToast - Whether to show toast notification
 * @returns Error handler function
 */
export function createQueryErrorHandler(
  t: TFunction,
  defaultMessage: string = 'error.loadingData',
  showToast: boolean = false
) {
  return (error: any) => {
    handleApiError(error, t, { defaultMessage, showToast });
  };
}
