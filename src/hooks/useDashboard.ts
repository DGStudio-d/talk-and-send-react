import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../lib/api';
import { DashboardStats } from '../types/models';

/**
 * Hook for fetching admin dashboard statistics
 */
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: async () => {
      const response = await dashboardApi.admin();
      return response.data.data as DashboardStats;
    },
  });
};

/**
 * Hook for fetching teacher dashboard statistics
 */
export const useTeacherDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'teacher'],
    queryFn: async () => {
      const response = await dashboardApi.teacher();
      return response.data.data as DashboardStats;
    },
  });
};

/**
 * Hook for fetching student dashboard statistics
 */
export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: async () => {
      const response = await dashboardApi.student();
      return response.data.data as DashboardStats;
    },
  });
};
