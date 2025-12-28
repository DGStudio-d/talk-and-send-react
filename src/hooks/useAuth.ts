import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { AuthService, AuthResponse, LoginRequest, RegisterRequest } from '../api/services/authService';
import { User, ApiError } from '../api/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const isAuthenticated = !!user && AuthService.isAuthenticated();

  // Load user profile on mount
  useEffect(() => {
    const loadUser = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const profile = await AuthService.getProfile();
          setUser(profile);
        } catch (err) {
          // Token might be expired, clear it
          AuthService.logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authResponse = await AuthService.login(credentials);
      setUser(authResponse.user);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authResponse = await AuthService.register(userData);
      setUser(authResponse.user);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
    } catch (err) {
      // Ignore logout errors
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const profile = await AuthService.getProfile();
      setUser(profile);
    } catch (err) {
      setError(err as ApiError);
    }
  }, [isAuthenticated]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    refreshProfile,
  };
};

// Hook for login form
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.login(credentials);
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    login,
    loading,
    error,
    clearError,
  };
};

// Hook for registration form
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const register = useCallback(async (userData: RegisterRequest): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.register(userData);
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    register,
    loading,
    error,
    clearError,
  };
};

// Hook for password operations
export const usePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const changePassword = useCallback(async (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      await AuthService.changePassword(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      await AuthService.forgotPassword({ email });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (data: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      await AuthService.resetPassword(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    changePassword,
    forgotPassword,
    resetPassword,
    loading,
    error,
    clearError,
  };
};