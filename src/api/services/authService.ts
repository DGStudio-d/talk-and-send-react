import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { User, ApiResponse } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'student' | 'teacher';
  preferred_language_id?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    
    if (response.success && response.data) {
      // Store auth token
      apiClient.setAuthToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.message || 'Login failed');
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.REGISTER,
      userData
    );
    
    if (response.success && response.data) {
      // Store auth token
      apiClient.setAuthToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.message || 'Registration failed');
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } finally {
      // Always clear token, even if logout request fails
      apiClient.clearAuthToken();
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.REFRESH_TOKEN
    );
    
    if (response.success && response.data) {
      // Update auth token
      apiClient.setAuthToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.message || 'Token refresh failed');
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.PROFILE_ME);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch profile');
  }

  /**
   * Update user profile
   */
  static async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(
      API_ENDPOINTS.PROFILE_UPDATE,
      userData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update profile');
  }

  /**
   * Change password
   */
  static async changePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    const response = await apiClient.post(
      API_ENDPOINTS.PROFILE_CHANGE_PASSWORD,
      data
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }
  }

  /**
   * Send forgot password email
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    const response = await apiClient.post(
      API_ENDPOINTS.FORGOT_PASSWORD,
      data
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to send reset email');
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const response = await apiClient.post(
      API_ENDPOINTS.RESET_PASSWORD,
      data
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to reset password');
    }
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<void> {
    const response = await apiClient.post(API_ENDPOINTS.VERIFY_EMAIL, {
      token,
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to verify email');
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!apiClient.getAuthToken();
  }

  /**
   * Get stored auth token
   */
  static getAuthToken(): string | null {
    return apiClient.getAuthToken();
  }
}

export default AuthService;