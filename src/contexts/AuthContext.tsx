import React, { createContext, useContext, ReactNode } from "react";
import { useCurrentUser, useLogin, useRegister, useLogout } from "@/services";
import type { User } from "@/types/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: unknown | null;
  login: (credentials: {
    email: string;
    password: string;
    remember?: boolean;
  }) => void;
  register: (userData: unknown) => void;
  logout: () => void;
  clearError: () => void;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use React Query hooks
  const { data: user, isLoading, error, refetch } = useCurrentUser();
  const isAuthenticated = !!user;
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const authContextValue: AuthContextType = {
    user: user || null,
    isAuthenticated,
    isLoading,
    error: error || null,
    login: (credentials) => loginMutation.mutate(credentials),
    register: (userData) => registerMutation.mutate(userData as any),
    logout: () => logoutMutation.mutate(),

    clearError: () => {
      // React Query handles error clearing automatically
    },
    refreshProfile: () => {
      refetch();
    },
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
