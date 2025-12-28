import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Language, PaginatedResponse } from '../types';

export interface CreateLanguageRequest {
  name: string;
  name_en?: string;
  name_ar?: string;
  name_es?: string;
  code: string;
  flag_url?: string;
  is_active?: boolean;
}

export interface UpdateLanguageRequest extends Partial<CreateLanguageRequest> {}

export interface LanguageFilters {
  search?: string;
  is_active?: boolean;
  code?: string;
}

export class LanguageService {
  /**
   * Get all languages with pagination and filtering
   */
  static async getAll(
    page: number = 1,
    perPage: number = 15,
    filters?: LanguageFilters
  ): Promise<PaginatedResponse<Language>> {
    return await apiClient.getPaginated<Language>(
      API_ENDPOINTS.LANGUAGES,
      page,
      perPage,
      filters
    );
  }

  /**
   * Get all active languages (no pagination)
   */
  static async getAllActive(): Promise<Language[]> {
    const response = await apiClient.get<Language[]>(API_ENDPOINTS.LANGUAGES, {
      params: { is_active: true, per_page: 100 }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch languages');
  }

  /**
   * Get language by ID
   */
  static async getById(id: number): Promise<Language> {
    const response = await apiClient.get<Language>(
      API_ENDPOINTS.languageById(id)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch language');
  }

  /**
   * Create new language
   */
  static async create(data: CreateLanguageRequest): Promise<Language> {
    const response = await apiClient.post<Language>(
      API_ENDPOINTS.LANGUAGES,
      data
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create language');
  }

  /**
   * Update language
   */
  static async update(id: number, data: UpdateLanguageRequest): Promise<Language> {
    const response = await apiClient.put<Language>(
      API_ENDPOINTS.languageById(id),
      data
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update language');
  }

  /**
   * Delete language
   */
  static async delete(id: number): Promise<void> {
    const response = await apiClient.delete(API_ENDPOINTS.languageById(id));
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete language');
    }
  }

  /**
   * Toggle language active status
   */
  static async toggleActive(id: number): Promise<Language> {
    const response = await apiClient.patch<Language>(
      `${API_ENDPOINTS.languageById(id)}/toggle-active`
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to toggle language status');
  }

  /**
   * Search languages
   */
  static async search(
    query: string,
    filters?: LanguageFilters
  ): Promise<Language[]> {
    const params = {
      q: query,
      ...filters,
    };

    const response = await apiClient.get<Language[]>(
      `${API_ENDPOINTS.LANGUAGES}/search`,
      { params }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to search languages');
  }

  /**
   * Get language statistics
   */
  static async getStats(id: number): Promise<{
    total_users: number;
    total_quizzes: number;
    total_courses: number;
    active_users: number;
  }> {
    const response = await apiClient.get<{
      total_users: number;
      total_quizzes: number;
      total_courses: number;
      active_users: number;
    }>(`${API_ENDPOINTS.languageById(id)}/stats`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch language statistics');
  }

  /**
   * Upload language flag
   */
  static async uploadFlag(
    id: number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<Language> {
    const response = await apiClient.uploadFile<Language>(
      `${API_ENDPOINTS.languageById(id)}/flag`,
      file,
      'flag',
      undefined,
      onProgress
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to upload flag');
  }

  /**
   * Get popular languages (by user count)
   */
  static async getPopular(limit: number = 10): Promise<Language[]> {
    const response = await apiClient.get<Language[]>(
      `${API_ENDPOINTS.LANGUAGES}/popular`,
      { params: { limit } }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch popular languages');
  }
}

export default LanguageService;