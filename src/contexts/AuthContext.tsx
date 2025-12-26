import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/models';
import { authApi } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on mount if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authApi.me();
      setUser(response.data.data);
    } catch (error) {
      // If fetching user fails, clear the token
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  // Implement login method that stores token and fetches user data
  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const { token, user: userData } = response.data.data;
    localStorage.setItem('auth_token', token);
    setUser(userData);
  };

  // Implement register method that stores token and sets user
  const register = async (data: any) => {
    const response = await authApi.register(data);
    const { token, user: userData } = response.data.data;
    localStorage.setItem('auth_token', token);
    setUser(userData);
  };

  // Implement logout method that clears token and user state
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  // Add computed properties: isAuthenticated, isAdmin, isTeacher, isStudent
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
