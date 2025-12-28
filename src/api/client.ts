import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError, PaginatedResponse, ProgressCallback } from './types';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'TalkAndSend-Web/1.0.0',
  },
};

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create(API_CONFIG);
    this.setupInterceptors();
    this.loadAuthToken();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Add locale
        const locale = localStorage.getItem('locale') || 'en';
        config.headers['Accept-Language'] = locale;

        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
          if (config.data) {
            console.log('📤 Request data:', config.data);
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ ${response.status} ${response.config.url}`);
        }
        return response;
      },
      async (error: AxiosError) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`❌ ${error.response?.status} ${error.config?.url}`);
          console.log('Error:', error.message);
          if (error.response?.data) {
            console.log('📥 Response data:', error.response.data);
          }
        }

        // Handle 401 unauthorized
        if (error.response?.status === 401) {
          this.clearAuthToken();
          // Redirect to login or emit auth error event
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private loadAuthToken(): void {
    this.authToken = localStorage.getItem('auth_token');
  }

  private handleError(error: AxiosError): ApiError {
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timeout',
        type: 'timeout',
      };
    }

    if (!error.response) {
      return {
        message: 'Network error',
        type: 'network',
      };
    }

    const { status, data } = error.response;
    const responseData = data as any;

    switch (status) {
      case 400:
        return {
          message: responseData?.message || 'Bad request',
          status_code: status,
          errors: responseData?.errors,
          type: 'validation',
        };
      case 401:
        return {
          message: 'Unauthorized',
          status_code: status,
          type: 'unauthorized',
        };
      case 403:
        return {
          message: 'Forbidden',
          status_code: status,
          type: 'forbidden',
        };
      case 404:
        return {
          message: 'Resource not found',
          status_code: status,
          type: 'not_found',
        };
      case 422:
        return {
          message: responseData?.message || 'Validation failed',
          status_code: status,
          errors: responseData?.errors,
          type: 'validation',
        };
      case 500:
        return {
          message: responseData?.message || 'Internal server error',
          status_code: status,
          type: 'server',
        };
      default:
        return {
          message: responseData?.message || 'Unknown error',
          status_code: status,
          type: 'server',
        };
    }
  }

  // Generic GET request
  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Generic POST request
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Generic PUT request
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Generic PATCH request
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Generic DELETE request
  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Paginated GET request
  async getPaginated<T>(
    url: string,
    page: number = 1,
    perPage: number = 15,
    params?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    try {
      const response = await this.get<PaginatedResponse<T>>(url, {
        params: {
          ...params,
          page,
          per_page: perPage,
        },
      });

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch paginated data');
      }
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Upload file with progress
  async uploadFile<T>(
    url: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, any>,
    onProgress?: ProgressCallback
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Download file with progress
  async downloadFile(
    url: string,
    filename: string,
    params?: Record<string, any>,
    onProgress?: ProgressCallback
  ): Promise<void> {
    try {
      const response = await this.client.get(url, {
        params,
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      // Create blob link to download
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // Auth methods
  setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('auth_token', token);
  }

  clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem('auth_token');
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  // Locale methods
  setLocale(locale: string): void {
    localStorage.setItem('locale', locale);
  }

  getLocale(): string {
    return localStorage.getItem('locale') || 'en';
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;