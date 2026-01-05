import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, handleApiError, createQueryKey } from "@/lib/api-client";
import { User, UserFilter, PaginatedResponse } from "@/types/api";

// Users Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UserFilter) => [...userKeys.lists(), filters] as const,
  recent: () => [...userKeys.all, "recent"] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  stats: (id: number) => [...userKeys.detail(id), "stats"] as const,
};

// Users API Functions
export const usersApi = {
  // Get users list
  getUsers: async (
    filters: UserFilter = {}
  ): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get("/users", { params: filters });
    return {
      data: (response.data as any).users ?? [],
      pagination: (response.data as any).pagination,
    };
  },

  // Get recent users
  getRecentUsers: async (): Promise<User[]> => {
    const response = await apiClient.get("/users/recent");
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Get user stats
  getUserStats: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/users/${id}/stats`);
    return response.data;
  },

  // Create user (admin only)
  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.post("/users", userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Update user role
  updateUserRole: async (id: number, role: string): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  // Reset user password
  resetUserPassword: async (id: number, password: string): Promise<void> => {
    await apiClient.post(`/users/${id}/reset-password`, { password });
  },

  // Activate user
  activateUser: async (id: number): Promise<User> => {
    const response = await apiClient.post(`/users/${id}/activate`);
    return response.data;
  },

  // Deactivate user
  deactivateUser: async (id: number): Promise<User> => {
    const response = await apiClient.post(`/users/${id}/deactivate`);
    return response.data;
  },
};

// React Query Hooks

// Get Users List
export const useUsers = (filters: UserFilter = {}) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => usersApi.getUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get Recent Users
export const useRecentUsers = () => {
  return useQuery({
    queryKey: userKeys.recent(),
    queryFn: usersApi.getRecentUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get User by ID
export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get User Stats
export const useUserStats = (id: number) => {
  return useQuery({
    queryKey: userKeys.stats(id),
    queryFn: () => usersApi.getUserStats(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Create User Mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) => usersApi.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: handleApiError,
  });
};

// Update User Mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<User> }) =>
      usersApi.updateUser(id, userData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] }); // Update current user if it's the same user
    },
    onError: handleApiError,
  });
};

// Delete User Mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: handleApiError,
  });
};

// Update User Role Mutation
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) =>
      usersApi.updateUserRole(id, role),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] }); // Update current user if it's the same user
    },
    onError: handleApiError,
  });
};

// Reset User Password Mutation
export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      usersApi.resetUserPassword(id, password),
    onError: handleApiError,
  });
};

// Activate User Mutation
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.activateUser(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables),
      });
    },
    onError: handleApiError,
  });
};

// Deactivate User Mutation
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.deactivateUser(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables),
      });
    },
    onError: handleApiError,
  });
};
