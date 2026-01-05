import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, handleApiError } from "@/lib/api-client";
import { MediaUpload } from "@/types/api";

// Media Query Keys
export const mediaKeys = {
  all: ["media"] as const,
  upload: () => [...mediaKeys.all, "upload"] as const,
  info: () => [...mediaKeys.all, "info"] as const,
};

// Media API Functions
export const mediaApi = {
  // Upload avatar
  uploadAvatar: async (file: File): Promise<MediaUpload> => {
    const response = await apiClient.upload("/upload/avatar", file);
    return response.data;
  },

  // Upload quiz image
  uploadQuizImage: async (file: File): Promise<MediaUpload> => {
    const response = await apiClient.upload("/upload/quiz-image", file);
    return response.data;
  },

  // Upload document
  uploadDocument: async (file: File): Promise<MediaUpload> => {
    const response = await apiClient.upload("/upload/document", file);
    return response.data;
  },

  // Upload certificate
  uploadCertificate: async (file: File): Promise<MediaUpload> => {
    const response = await apiClient.upload("/upload/certificate", file);
    return response.data;
  },

  // Upload bulk data
  uploadBulkData: async (file: File): Promise<MediaUpload> => {
    const response = await apiClient.upload("/upload/bulk-data", file);
    return response.data;
  },

  // Enhanced media upload
  enhancedUpload: async (
    file: File,
    additionalData?: Record<string, any>
  ): Promise<MediaUpload> => {
    const response = await apiClient.upload(
      "/media/upload",
      file,
      additionalData
    );
    return response.data;
  },

  // Delete media
  deleteMedia: async (path: string): Promise<void> => {
    await apiClient.delete("/media/delete", { data: { path } });
  },

  // Get media info
  getMediaInfo: async (path: string): Promise<any> => {
    const response = await apiClient.get("/media/info", { params: { path } });
    return response.data;
  },
};

// React Query Hooks

// Get Media Info
export const useMediaInfo = (path: string) => {
  return useQuery({
    queryKey: [...mediaKeys.info(), path],
    queryFn: () => mediaApi.getMediaInfo(path),
    enabled: !!path,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Media Upload Mutations

// Upload Avatar Mutation
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => mediaApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] }); // Update user profile
    },
    onError: handleApiError,
  });
};

// Upload Quiz Image Mutation
export const useUploadQuizImage = () => {
  return useMutation({
    mutationFn: (file: File) => mediaApi.uploadQuizImage(file),
    onError: handleApiError,
  });
};

// Upload Document Mutation
export const useUploadDocument = () => {
  return useMutation({
    mutationFn: (file: File) => mediaApi.uploadDocument(file),
    onError: handleApiError,
  });
};

// Upload Certificate Mutation
export const useUploadCertificate = () => {
  return useMutation({
    mutationFn: (file: File) => mediaApi.uploadCertificate(file),
    onError: handleApiError,
  });
};

// Upload Bulk Data Mutation
export const useUploadBulkData = () => {
  return useMutation({
    mutationFn: (file: File) => mediaApi.uploadBulkData(file),
    onError: handleApiError,
  });
};

// Enhanced Upload Mutation
export const useEnhancedUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      additionalData,
    }: {
      file: File;
      additionalData?: Record<string, any>;
    }) => mediaApi.enhancedUpload(file, additionalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.info() });
    },
    onError: handleApiError,
  });
};

// Delete Media Mutation
export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (path: string) => mediaApi.deleteMedia(path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.info() });
    },
    onError: handleApiError,
  });
};
