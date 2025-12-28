import { useCallback } from 'react';
import { UserService } from '../api/services/userService';
import { User, UserFilters, CreateUserRequest, UpdateUserRequest } from '../api/types';
import { useApi, useAsyncOperation, usePagination, useFileUpload, useDebouncedSearch } from './useApi';

// Hook for fetching a single user
export function useUser(id: number) {
  return useApi(() => UserService.getById(id), [id]);
}

// Hook for paginated users
export function useUsers(filters?: UserFilters) {
  const fetchUsers = useCallback(
    (page: number, perPage: number) => UserService.getAll(page, perPage, filters),
    [filters]
  );

  return usePagination(fetchUsers);
}

// Hook for users by role
export function useUsersByRole(role: 'admin' | 'teacher' | 'student') {
  const fetchUsers = useCallback(
    (page: number, perPage: number) => UserService.getByRole(role, page, perPage),
    [role]
  );

  return usePagination(fetchUsers);
}

// Hook for teachers
export function useTeachers(filters?: Omit<UserFilters, 'role'>) {
  const fetchTeachers = useCallback(
    (page: number, perPage: number) => UserService.getTeachers(page, perPage, filters),
    [filters]
  );

  return usePagination(fetchTeachers);
}

// Hook for teacher details
export function useTeacher(id: number) {
  return useApi(() => UserService.getTeacherById(id), [id]);
}

// Hook for user operations (CRUD)
export function useUserOperations() {
  const { execute, loading, error, clearError } = useAsyncOperation<User>();

  const createUser = useCallback(
    (data: CreateUserRequest) => execute(() => UserService.create(data)),
    [execute]
  );

  const updateUser = useCallback(
    (id: number, data: UpdateUserRequest) => execute(() => UserService.update(id, data)),
    [execute]
  );

  const deleteUser = useCallback(
    (id: number) => execute(() => UserService.delete(id)),
    [execute]
  );

  const toggleActive = useCallback(
    (id: number) => execute(() => UserService.toggleActive(id)),
    [execute]
  );

  const resetPassword = useCallback(
    (id: number, newPassword: string) => execute(() => UserService.resetPassword(id, newPassword)),
    [execute]
  );

  const sendEmailVerification = useCallback(
    (id: number) => execute(() => UserService.sendEmailVerification(id)),
    [execute]
  );

  return {
    createUser,
    updateUser,
    deleteUser,
    toggleActive,
    resetPassword,
    sendEmailVerification,
    loading,
    error,
    clearError,
  };
}

// Hook for user search
export function useUserSearch(filters?: UserFilters) {
  const searchFunction = useCallback(
    (query: string) => UserService.search(query, filters),
    [filters]
  );

  return useDebouncedSearch(searchFunction);
}

// Hook for user statistics
export function useUserStats() {
  return useApi(() => UserService.getStats(), []);
}

// Hook for user avatar upload
export function useUserAvatarUpload() {
  const { upload, progress, loading, error, clearError } = useFileUpload();

  const uploadAvatar = useCallback(
    (id: number) =>
      upload((file, onProgress) =>
        UserService.uploadAvatar(id, file, onProgress)
      ),
    [upload]
  );

  return {
    uploadAvatar,
    progress,
    loading,
    error,
    clearError,
  };
}

// Hook for user activity log
export function useUserActivity(id: number) {
  const fetchActivity = useCallback(
    (page: number, perPage: number) => UserService.getActivityLog(id, page, perPage),
    [id]
  );

  return usePagination(fetchActivity);
}

// Hook for bulk operations
export function useBulkUserOperations() {
  const { execute, loading, error, clearError } = useAsyncOperation();

  const bulkDelete = useCallback(
    (userIds: number[]) => execute(() => UserService.bulkDelete(userIds)),
    [execute]
  );

  const bulkUpdateRole = useCallback(
    (userIds: number[], role: 'admin' | 'teacher' | 'student') => 
      execute(() => UserService.bulkUpdateRole(userIds, role)),
    [execute]
  );

  const bulkToggleActive = useCallback(
    (userIds: number[]) => execute(() => UserService.bulkToggleActive(userIds)),
    [execute]
  );

  return {
    bulkDelete,
    bulkUpdateRole,
    bulkToggleActive,
    loading,
    error,
    clearError,
  };
}

// Combined hook for user management dashboard
export function useUserDashboard(filters?: UserFilters) {
  const users = useUsers(filters);
  const operations = useUserOperations();
  const bulkOperations = useBulkUserOperations();
  const search = useUserSearch(filters);
  const stats = useUserStats();
  const avatarUpload = useUserAvatarUpload();

  return {
    // User list
    users: users.data,
    pagination: users.pagination,
    loading: users.loading,
    error: users.error,
    refreshUsers: users.refresh,
    goToPage: users.goToPage,
    nextPage: users.nextPage,
    previousPage: users.previousPage,
    changePerPage: users.changePerPage,

    // Operations
    createUser: operations.createUser,
    updateUser: operations.updateUser,
    deleteUser: operations.deleteUser,
    toggleActive: operations.toggleActive,
    resetPassword: operations.resetPassword,
    sendEmailVerification: operations.sendEmailVerification,
    operationLoading: operations.loading,
    operationError: operations.error,
    clearOperationError: operations.clearError,

    // Bulk operations
    bulkDelete: bulkOperations.bulkDelete,
    bulkUpdateRole: bulkOperations.bulkUpdateRole,
    bulkToggleActive: bulkOperations.bulkToggleActive,
    bulkLoading: bulkOperations.loading,
    bulkError: bulkOperations.error,
    clearBulkError: bulkOperations.clearError,

    // Search
    searchQuery: search.query,
    setSearchQuery: search.setQuery,
    searchResults: search.results,
    searchLoading: search.loading,
    searchError: search.error,
    clearSearch: search.clearResults,

    // Statistics
    stats: stats.data,
    statsLoading: stats.loading,
    statsError: stats.error,
    refreshStats: stats.refetch,

    // Avatar upload
    uploadAvatar: avatarUpload.uploadAvatar,
    uploadProgress: avatarUpload.progress,
    uploadLoading: avatarUpload.loading,
    uploadError: avatarUpload.error,
    clearUploadError: avatarUpload.clearError,
  };
}