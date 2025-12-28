import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { PaginatedResponse, ProgressCallback } from '../types';

export interface Course {
  id: number;
  title: string;
  description?: string;
  language_id: number;
  language?: {
    id: number;
    name: string;
    code: string;
  };
  teacher_id: number;
  teacher?: {
    id: number;
    name: string;
    email: string;
  };
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  duration_hours?: number;
  price?: number;
  is_active: boolean;
  thumbnail_url?: string;
  students_count: number;
  lessons_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  language_id: number;
  teacher_id?: number;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  duration_hours?: number;
  price?: number;
  is_active?: boolean;
  thumbnail_url?: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

export interface CourseFilters {
  search?: string;
  language_id?: number;
  teacher_id?: number;
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  is_active?: boolean;
  price_min?: number;
  price_max?: number;
}

export class CourseService {
  /**
   * Get all courses with pagination and filtering
   */
  static async getAll(
    page: number = 1,
    perPage: number = 15,
    filters?: CourseFilters
  ): Promise<PaginatedResponse<Course>> {
    return await apiClient.getPaginated<Course>(
      '/courses',
      page,
      perPage,
      filters
    );
  }

  /**
   * Get course by ID
   */
  static async getById(id: number): Promise<Course> {
    const response = await apiClient.get<Course>(`/courses/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch course');
  }

  /**
   * Create new course
   */
  static async create(data: CreateCourseRequest): Promise<Course> {
    const response = await apiClient.post<Course>('/courses', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create course');
  }

  /**
   * Update course
   */
  static async update(id: number, data: UpdateCourseRequest): Promise<Course> {
    const response = await apiClient.put<Course>(`/courses/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update course');
  }

  /**
   * Delete course
   */
  static async delete(id: number): Promise<void> {
    const response = await apiClient.delete(`/courses/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete course');
    }
  }

  /**
   * Toggle course active status
   */
  static async toggleActive(id: number): Promise<Course> {
    const response = await apiClient.patch<Course>(`/courses/${id}/toggle-active`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to toggle course status');
  }

  /**
   * Search courses
   */
  static async search(
    query: string,
    filters?: CourseFilters
  ): Promise<Course[]> {
    const params = {
      q: query,
      ...filters,
    };

    const response = await apiClient.get<Course[]>('/courses/search', {
      params,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to search courses');
  }

  /**
   * Get popular courses
   */
  static async getPopular(limit: number = 10): Promise<Course[]> {
    const response = await apiClient.get<Course[]>('/courses/popular', {
      params: { limit },
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch popular courses');
  }

  /**
   * Get recent courses
   */
  static async getRecent(limit: number = 10): Promise<Course[]> {
    const response = await apiClient.get<Course[]>('/courses/recent', {
      params: { limit },
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch recent courses');
  }

  /**
   * Get courses by language
   */
  static async getByLanguage(languageId: number): Promise<Course[]> {
    const response = await apiClient.get<Course[]>(`/courses/language/${languageId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch courses by language');
  }

  /**
   * Get courses by teacher
   */
  static async getByTeacher(teacherId: number): Promise<Course[]> {
    const response = await apiClient.get<Course[]>(`/courses/teacher/${teacherId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch courses by teacher');
  }

  /**
   * Upload course thumbnail
   */
  static async uploadThumbnail(
    id: number,
    file: File,
    onProgress?: ProgressCallback
  ): Promise<Course> {
    const response = await apiClient.uploadFile<Course>(
      `/courses/${id}/thumbnail`,
      file,
      'thumbnail',
      undefined,
      onProgress
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to upload thumbnail');
  }

  /**
   * Enroll in course
   */
  static async enroll(id: number): Promise<void> {
    const response = await apiClient.post(`/courses/${id}/enroll`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to enroll in course');
    }
  }

  /**
   * Unenroll from course
   */
  static async unenroll(id: number): Promise<void> {
    const response = await apiClient.post(`/courses/${id}/unenroll`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to unenroll from course');
    }
  }

  /**
   * Get course statistics
   */
  static async getStats(id: number): Promise<{
    total_students: number;
    active_students: number;
    completion_rate: number;
    average_rating: number;
    total_lessons: number;
    total_duration: number;
  }> {
    const response = await apiClient.get<{
      total_students: number;
      active_students: number;
      completion_rate: number;
      average_rating: number;
      total_lessons: number;
      total_duration: number;
    }>(`/courses/${id}/stats`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch course statistics');
  }
}

export default CourseService;