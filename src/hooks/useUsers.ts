import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../lib/api";
import { User } from "../types/models";

/**
 * Hook for fetching all users with optional filters
 */
export const useUsers = (params?: any) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const response = await userApi.getAll(params);
      const { users, pagination } = response.data.data;
      return { users: users as User[], pagination };
    },
  });
};

/**
 * Hook for fetching a single user by ID
 */
export const useUser = (id: number) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await userApi.getById(id);
      return response.data.data as User;
    },
    enabled: !!id,
  });
};

/**
 * Hook for updating a user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      userApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Hook for deleting a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userApi.delete(id),
    onSuccess: (data: any) => {
      // Invalidate all queries that start with "users"
      queryClient.invalidateQueries({
        queryKey: ["users"],
        refetchType: 'active'
      });
      console.log(data)
    },
  });
};

/**
 * Hook for updating a user's role
 */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) =>
      userApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Hook for activating a user
 */
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Hook for deactivating a user
 */
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
