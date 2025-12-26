import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherApi } from "../lib/api";

/**
 * Hook for fetching all teachers
 */
export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await teacherApi.getAll();
      return response.data.data.profiles || [];
    },
  });
};

/**
 * Hook for fetching a single teacher by ID
 */
export const useTeacher = (id: number) => {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: async () => {
      const response = await teacherApi.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook for fetching current teacher's profile
 */
export const useTeacherProfile = () => {
  return useQuery({
    queryKey: ["teacher-profile"],
    queryFn: async () => {
      const response = await teacherApi.getProfile();
      return response.data.data;
    },
  });
};

/**
 * Hook for updating teacher profile (admin)
 */
export const useUpdateTeacherProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      teacherApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

/**
 * Hook for uploading teacher profile image
 */
export const useUploadTeacherImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      teacherApi.uploadImage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

/**
 * Hook for toggling teacher visibility
 */
export const useToggleTeacherVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => teacherApi.toggleVisibility(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};
