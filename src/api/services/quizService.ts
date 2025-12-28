import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  Quiz,
  QuizQuestion,
  QuizAttempt,
  QuizStats,
  CreateQuizRequest,
  UpdateQuizRequest,
  QuizFilters,
  ImportQuizRequest,
  PaginatedResponse,
  ProgressCallback,
} from '../types';

export class QuizService {
  /**
   * Get all quizzes with pagination and filtering
   */
  static async getAll(
    page: number = 1,
    perPage: number = 15,
    filters?: QuizFilters
  ): Promise<PaginatedResponse<Quiz>> {
    return await apiClient.getPaginated<Quiz>(
      API_ENDPOINTS.QUIZZES,
      page,
      perPage,
      filters
    );
  }

  /**
   * Get quiz by ID
   */
  static async getById(id: number): Promise<Quiz> {
    const response = await apiClient.get<Quiz>(API_ENDPOINTS.quizById(id));
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch quiz');
  }

  /**
   * Create new quiz
   */
  static async create(data: CreateQuizRequest): Promise<Quiz> {
    const response = await apiClient.post<Quiz>(API_ENDPOINTS.QUIZZES, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create quiz');
  }

  /**
   * Update quiz
   */
  static async update(id: number, data: UpdateQuizRequest): Promise<Quiz> {
    const response = await apiClient.put<Quiz>(API_ENDPOINTS.quizById(id), data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update quiz');
  }

  /**
   * Delete quiz
   */
  static async delete(id: number): Promise<void> {
    const response = await apiClient.delete(API_ENDPOINTS.quizById(id));
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete quiz');
    }
  }

  /**
   * Toggle quiz active status
   */
  static async toggleActive(id: number): Promise<Quiz> {
    const response = await apiClient.patch<Quiz>(API_ENDPOINTS.quizToggleActive(id));
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to toggle quiz status');
  }

  /**
   * Get quiz questions
   */
  static async getQuestions(id: number): Promise<QuizQuestion[]> {
    const response = await apiClient.get<QuizQuestion[]>(API_ENDPOINTS.quizQuestions(id));
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch quiz questions');
  }

  /**
   * Get quiz attempts with pagination
   */
  static async getAttempts(
    id: number,
    page: number = 1,
    perPage: number = 15,
    filters?: Record<string, any>
  ): Promise<PaginatedResponse<QuizAttempt>> {
    return await apiClient.getPaginated<QuizAttempt>(
      API_ENDPOINTS.quizAttempts(id),
      page,
      perPage,
      filters
    );
  }

  /**
   * Get quiz statistics
   */
  static async getStats(id: number): Promise<QuizStats> {
    const response = await apiClient.get<QuizStats>(API_ENDPOINTS.quizStats(id));
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch quiz statistics');
  }

  /**
   * Search quizzes
   */
  static async search(
    query: string,
    filters?: QuizFilters
  ): Promise<Quiz[]> {
    const params = {
      q: query,
      ...filters,
    };

    const response = await apiClient.get<Quiz[]>(API_ENDPOINTS.QUIZZES_SEARCH, {
      params,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to search quizzes');
  }

  /**
   * Get popular quizzes
   */
  static async getPopular(
    limit?: number,
    languageId?: number
  ): Promise<Quiz[]> {
    const params: Record<string, any> = {};
    if (limit) params.limit = limit;
    if (languageId) params.language_id = languageId;

    const response = await apiClient.get<Quiz[]>(API_ENDPOINTS.QUIZZES_POPULAR, {
      params,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch popular quizzes');
  }

  /**
   * Get recent quizzes
   */
  static async getRecent(
    limit?: number,
    languageId?: number
  ): Promise<Quiz[]> {
    const params: Record<string, any> = {};
    if (limit) params.limit = limit;
    if (languageId) params.language_id = languageId;

    const response = await apiClient.get<Quiz[]>(API_ENDPOINTS.QUIZZES_RECENT, {
      params,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch recent quizzes');
  }

  /**
   * Get featured quizzes
   */
  static async getFeatured(
    limit?: number,
    languageId?: number
  ): Promise<Quiz[]> {
    const params: Record<string, any> = {};
    if (limit) params.limit = limit;
    if (languageId) params.language_id = languageId;

    const response = await apiClient.get<Quiz[]>(API_ENDPOINTS.QUIZZES_FEATURED, {
      params,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch featured quizzes');
  }

  /**
   * Get my quizzes (created by current user)
   */
  static async getMine(
    page: number = 1,
    perPage: number = 15,
    filters?: QuizFilters
  ): Promise<PaginatedResponse<Quiz>> {
    return await apiClient.getPaginated<Quiz>(
      API_ENDPOINTS.QUIZZES_MINE,
      page,
      perPage,
      filters
    );
  }

  /**
   * Duplicate quiz
   */
  static async duplicate(id: number, newTitle?: string): Promise<Quiz> {
    const data: Record<string, any> = {};
    if (newTitle) data.title = newTitle;

    const response = await apiClient.post<Quiz>(API_ENDPOINTS.quizDuplicate(id), data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to duplicate quiz');
  }

  /**
   * Get quizzes by language
   */
  static async getByLanguage(languageId: number): Promise<Quiz[]> {
    const response = await apiClient.get<Quiz[]>(API_ENDPOINTS.quizByLanguage(languageId));
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch quizzes by language');
  }

  /**
   * Import quizzes from file
   */
  static async import(
    file: File,
    languageId?: number,
    teacherId?: number,
    onProgress?: ProgressCallback
  ): Promise<{ message: string; imported_count: number; errors?: string[] }> {
    const additionalData: Record<string, any> = {};
    if (languageId) additionalData.language_id = languageId;
    if (teacherId) additionalData.teacher_id = teacherId;

    const response = await apiClient.uploadFile<{
      message: string;
      imported_count: number;
      errors?: string[];
    }>(
      API_ENDPOINTS.QUIZZES_IMPORT,
      file,
      'file',
      additionalData,
      onProgress
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to import quizzes');
  }

  /**
   * Export quizzes
   */
  static async export(
    filename: string = 'quizzes.csv',
    quizIds?: number[],
    onProgress?: ProgressCallback
  ): Promise<void> {
    const params: Record<string, any> = {};
    if (quizIds && quizIds.length > 0) {
      params.quiz_ids = quizIds.join(',');
    }

    await apiClient.downloadFile(
      API_ENDPOINTS.QUIZZES_EXPORT,
      filename,
      params,
      onProgress
    );
  }

  /**
   * Get public quiz (no authentication required)
   */
  static async getPublicQuiz(id: number): Promise<Quiz> {
    const response = await apiClient.get<Quiz>(API_ENDPOINTS.publicQuizById(id));
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch public quiz');
  }

  /**
   * Get public quiz questions (no authentication required)
   */
  static async getPublicQuizQuestions(id: number): Promise<QuizQuestion[]> {
    const response = await apiClient.get<QuizQuestion[]>(API_ENDPOINTS.publicQuizQuestions(id));
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch public quiz questions');
  }
}

export default QuizService;