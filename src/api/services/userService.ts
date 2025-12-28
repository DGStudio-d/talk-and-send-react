import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { User, PaginatedResponse } from '../types';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'admin' | 'teacher' | 'student';
  preferred_language_id?: number;
  phone?: string;
  bio?: string;
  avatar?: string;
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password' | 'password_confirmation'>> {}

export interface UserFilters {
  search?: string;
  role?: 'admin' | 'teacher' | 'student';
  preferred_language_id?: number;
  is_active?: boolean;
  created_from?: string;
  created_to?: string;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  users_by_role: {
    admin: number;
    teacher: number;
    student: number;
  };
  users_by_language: Array<{
    language_id: number;
    language_name: string;
    count: number;
  }>;
  recent_registrations: number;
}

export class UserService {
  /**
   * Get all users with pagination and filtering
   */
  static async getAll(
    page: number = 1,
    perPage: number = 15,
    filters?: UserFilters
  ): Promise<PaginatedResponse<User>> {
    return await apiClient.getPaginated<User>(
      API_ENDPOINTS.USERS,
      page,
      perPage,
      filters
    );
  }

  /**
   * Get user by ID
   */
  static async getById(id: number): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.userById(id));
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch user');
  }

  /**
   * Create new user
   */
  static async create(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>(API_ENDPOINTS.USERS, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create user');
  }

  /**
   * Update user
   */
  static async update(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(
      API_ENDPOINTS.userById(id),
      data
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update user');
  }

  /**
   * Delete user
   */
  static async delete(id: number): Promise<void> {
    const response = await apiClient.delete(API_ENDPOINTS.userById(id));
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete user');
    }
  }

  /**
   * Toggle user active status
   */
  static async toggleActive(id: number): Promise<User> {
    const response = await apiClient.patch<User>(
      `${API_ENDPOINTS.userById(id)}/toggle-active`
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to toggle user status');
  }

  /**
   * Search users
   */
  static async search(
    query: string,
    filters?: UserFilters
  ): Promise<User[]> {
    const params = {
      q: query,
      ...filters,
    };

    const response = await apiClient.get<User[]>(
      `${API_ENDPOINTS.USERS}/search`,
      { params }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to search users');
  }

  /**
   * Get users by role
   */
  static async getByRole(
    role: 'admin' | 'teacher' | 'student',
    page: number = 1,
    perPage: number = 15
  ): Promise<PaginatedResponse<User>> {
    return await apiClient.getPaginated<User>(
      API_ENDPOINTS.USERS,
      page,
      perPage,
      { role }
    );
  }

  /**
   * Get teachers only
   */
  static async getTeachers(
    page: number = 1,
    perPage: number = 15,
    filters?: Omit<UserFilters, 'role'>
  ): Promise<PaginatedResponse<User>> {
    return await apiClient.getPaginated<User>(
      API_ENDPOINTS.TEACHERS,
      page,
      perPage,
      filters
    );
  }

  /**
   * Get teacher by ID with additional details
   */
  static async getTeacherById(id: number): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.teacherById(id));
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch teacher');
  }

  /**
   * Get user statistics
   */
  static async getStats(): Promise<UserStats> {
    const response = await apiClient.get<UserStats>(
      `${API_ENDPOINTS.USERS}/stats`
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch user statistics');
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(
    id: number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<User> {
    const response = await apiClient.uploadFile<User>(
      `${API_ENDPOINTS.userById(id)}/avatar`,
      file,
      'avatar',
      undefined,
      onProgress
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to upload avatar');
  }

  /**
   * Reset user password (admin only)
   */
  static async resetPassword(
    id: number,
    newPassword: string
  ): Promise<void> {
    const response = await apiClient.post(
      `${API_ENDPOINTS.userById(id)}/reset-password`,
      { password: newPassword }
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to reset password');
    }
  }

  /**
   * Send email verification
   */
  static async sendEmailVerification(id: number): Promise<void> {
    const response = await apiClient.post(
      `${API_ENDPOINTS.userById(id)}/send-verification`
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to send verification email');
    }
  }

  /**
   * Get user activity log
   */
  static async getActivityLog(
    id: number,
    page: number = 1,
    perPage: number = 15
  ): Promise<PaginatedResponse<{
    id: number;
    action: string;
    description: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
  }>> {
    return await apiClient.getPaginated(
      `${API_ENDPOINTS.userById(id)}/activity`,
      page,
      perPage
    );
  }

  /**
   * Bulk operations
   */
  static async bulkDelete(userIds: number[]): Promise<void> {
    const response = await apiClient.post(
      `${API_ENDPOINTS.USERS}/bulk-delete`,
      { user_ids: userIds }
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete users');
    }
  }

  static async bulkUpdateRole(
    userIds: number[],
    role: 'admin' | 'teacher' | 'student'
  ): Promise<void> {
    const response = await apiClient.post(
      `${API_ENDPOINTS.USERS}/bulk-update-role`,
      { user_ids: userIds, role }
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update user roles');
    }
  }

  static async bulkToggleActive(userIds: number[]): Promise<void> {
    const response = await apiClient.post(
      `${API_ENDPOINTS.USERS}/bulk-toggle-active`,
      { user_ids: userIds }
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to toggle user status');
    }
  }
}

export default UserService;