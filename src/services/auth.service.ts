import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, handleApiError } from "@/lib/api-client";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/api";

// Auth Query Keys
export const authKeys = {
  all: ["auth"] as const,
  me: ["auth", "me"] as const,
};

// Auth API Functions
export const authApi = {
  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", data);
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
    }
    return response.data;
  },

  // Register
  register: async (
    data: RegisterRequest
  ): Promise<{ user: User; requires_activation: boolean }> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
    localStorage.removeItem("auth_token");
  },

  // Get current user
  me: async (): Promise<User> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  // Refresh token
  refresh: async (): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/refresh");
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
    }
    return response.data;
  },

  // Email verification
  verifyEmail: async (data: {
    token: string;
    email: string;
  }): Promise<void> => {
    await apiClient.post("/auth/verify-email", data);
  },

  // Resend verification
  resendVerification: async (): Promise<void> => {
    await apiClient.post("/auth/resend-verification");
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post("/auth/forgot-password", data);
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post("/auth/reset-password", data);
  },
};

// React Query Hooks

// Login Mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
    onError: handleApiError,
  });
};

// Register Mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    onError: handleApiError,
  });
};

// Logout Mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear all query cache
      queryClient.clear();
      // Redirect to login page
      window.location.href = "/login";
    },
    onError: handleApiError,
  });
};

// Get Current User Query
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if user is not authenticated
  });
};

// Refresh Token Mutation
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.refresh,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
    onError: handleApiError,
  });
};

// Verify Email Mutation
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onError: handleApiError,
  });
};

// Resend Verification Mutation
export const useResendVerification = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onError: handleApiError,
  });
};

// Forgot Password Mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onError: handleApiError,
  });
};

// Reset Password Mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      // Redirect to login page after successful password reset
      window.location.href = "/login";
    },
    onError: handleApiError,
  });
};
