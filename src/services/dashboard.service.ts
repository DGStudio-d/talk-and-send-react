import { useQuery } from "@tanstack/react-query";
import { apiClient, handleApiError } from "@/lib/api-client";
import { DashboardStats } from "@/types/api";

// Dashboard Query Keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  admin: () => [...dashboardKeys.all, "admin"] as const,
  teacher: () => [...dashboardKeys.all, "teacher"] as const,
  student: () => [...dashboardKeys.all, "student"] as const,
  public: () => [...dashboardKeys.all, "public"] as const,
};

// Dashboard API Functions
export const dashboardApi = {
  // Get admin dashboard stats
  getAdminDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/dashboard/admin");
    return response.data;
  },

  // Get teacher dashboard stats
  getTeacherDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/dashboard/teacher");
    return response.data;
  },

  // Get student dashboard stats
  getStudentDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/dashboard/student");
    return response.data;
  },

  // Get public dashboard stats
  getPublicDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/dashboard");
    return response.data;
  },
};

// React Query Hooks

// Get Admin Dashboard
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.admin(),
    queryFn: dashboardApi.getAdminDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Get Teacher Dashboard
export const useTeacherDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.teacher(),
    queryFn: dashboardApi.getTeacherDashboard,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: false,
  });
};

// Get Student Dashboard
export const useStudentDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.student(),
    queryFn: dashboardApi.getStudentDashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
};

// Get Public Dashboard
export const usePublicDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.public(),
    queryFn: dashboardApi.getPublicDashboard,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });
};
