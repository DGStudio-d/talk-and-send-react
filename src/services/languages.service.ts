import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, handleApiError } from "@/lib/api-client";
import { Language, LanguageFilter, PaginatedResponse } from "@/types/api";

// Languages Query Keys
export const languageKeys = {
  all: ["languages"] as const,
  lists: () => [...languageKeys.all, "list"] as const,
  list: (filters: LanguageFilter) =>
    [...languageKeys.lists(), filters] as const,
  popular: (limit?: number) => [...languageKeys.all, "popular", limit] as const,
  recent: (limit?: number) => [...languageKeys.all, "recent", limit] as const,
  featured: (limit?: number) =>
    [...languageKeys.all, "featured", limit] as const,
  details: () => [...languageKeys.all, "detail"] as const,
  detail: (id: number) => [...languageKeys.details(), id] as const,
  teachers: (id: number) => [...languageKeys.detail(id), "teachers"] as const,
  students: (id: number) => [...languageKeys.detail(id), "students"] as const,
  stats: (id: number) => [...languageKeys.detail(id), "stats"] as const,
  public: () => [...languageKeys.all, "public"] as const,
  publicDetail: (id: number) => [...languageKeys.public(), id] as const,
};

// Languages API Functions
export const languagesApi = {
  // Get languages list
  getLanguages: async (filters: LanguageFilter = {}): Promise<Language[]> => {
    const response = await apiClient.get("/languages", { params: filters });
    return (response.data as any)?.data ?? [];
  },

  // Get popular languages
  getPopularLanguages: async (limit = 10): Promise<Language[]> => {
    const response = await apiClient.get("/languages/popular", {
      params: { limit },
    });
    return (response.data as any)?.data ?? [];
  },

  // Get recent languages
  getRecentLanguages: async (limit = 10): Promise<Language[]> => {
    const response = await apiClient.get("/languages/recent", {
      params: { limit },
    });
    return (response.data as any)?.data ?? [];
  },

  // Get featured languages
  getFeaturedLanguages: async (limit = 6): Promise<Language[]> => {
    const response = await apiClient.get("/languages/featured", {
      params: { limit },
    });
    return (response.data as any)?.data ?? [];
  },

  // Get language by ID
  getLanguageById: async (id: number): Promise<Language> => {
    const response = await apiClient.get(`/languages/${id}`);
    return (response.data as any)?.data;
  },

  // Get language teachers
  getLanguageTeachers: async (id: number): Promise<any[]> => {
    const response = await apiClient.get(`/languages/${id}/teachers`);
    return (response.data as any)?.data ?? [];
  },

  // Get language students
  getLanguageStudents: async (id: number): Promise<any[]> => {
    const response = await apiClient.get(`/languages/${id}/students`);
    return (response.data as any)?.data ?? [];
  },

  // Get language statistics
  getLanguageStats: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/languages/${id}/stats`);
    return (response.data as any)?.data;
  },

  // Create language (admin only)
  createLanguage: async (
    languageData: Partial<Language>
  ): Promise<Language> => {
    const response = await apiClient.post("/languages", languageData);
    return (response.data as any)?.data;
  },

  // Update language (admin only)
  updateLanguage: async (
    id: number,
    languageData: Partial<Language>
  ): Promise<Language> => {
    const response = await apiClient.put(`/languages/${id}`, languageData);
    return (response.data as any)?.data;
  },

  // Delete language (admin only)
  deleteLanguage: async (id: number): Promise<void> => {
    await apiClient.delete(`/languages/${id}`);
  },

  // Toggle language active status (admin only)
  toggleLanguageActive: async (id: number): Promise<Language> => {
    const response = await apiClient.patch(`/languages/${id}/toggle-active`);
    return (response.data as any)?.data;
  },

  // Upload language flag (admin only)
  uploadLanguageFlag: async (id: number, file: File): Promise<Language> => {
    const response = await apiClient.upload(
      `/languages/${id}/upload-flag`,
      file
    );
    return (response.data as any)?.data;
  },

  // Public API - Get languages
  getPublicLanguages: async (): Promise<Language[]> => {
    const response = await apiClient.get("/public/languages");
    return (response.data as any)?.data ?? [];
  },

  // Public API - Get language details
  getPublicLanguage: async (id: number): Promise<Language> => {
    const response = await apiClient.get(`/public/languages/${id}`);
    return (response.data as any)?.data;
  },
};

// React Query Hooks

// Get Languages List
export const useLanguages = (filters: LanguageFilter = {}) => {
  return useQuery({
    queryKey: languageKeys.list(filters),
    queryFn: () => languagesApi.getLanguages(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Popular Languages
export const usePopularLanguages = (limit = 10) => {
  return useQuery({
    queryKey: languageKeys.popular(limit),
    queryFn: () => languagesApi.getPopularLanguages(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get Recent Languages
export const useRecentLanguages = (limit = 10) => {
  return useQuery({
    queryKey: languageKeys.recent(limit),
    queryFn: () => languagesApi.getRecentLanguages(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Featured Languages
export const useFeaturedLanguages = (limit = 6) => {
  return useQuery({
    queryKey: languageKeys.featured(limit),
    queryFn: () => languagesApi.getFeaturedLanguages(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get Language by ID
export const useLanguage = (id: number) => {
  return useQuery({
    queryKey: languageKeys.detail(id),
    queryFn: () => languagesApi.getLanguageById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// Get Language Teachers
export const useLanguageTeachers = (id: number) => {
  return useQuery({
    queryKey: languageKeys.teachers(id),
    queryFn: () => languagesApi.getLanguageTeachers(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Language Students
export const useLanguageStudents = (id: number) => {
  return useQuery({
    queryKey: languageKeys.students(id),
    queryFn: () => languagesApi.getLanguageStudents(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Language Stats
export const useLanguageStats = (id: number) => {
  return useQuery({
    queryKey: languageKeys.stats(id),
    queryFn: () => languagesApi.getLanguageStats(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Public Languages
export const usePublicLanguages = () => {
  return useQuery({
    queryKey: languageKeys.public(),
    queryFn: languagesApi.getPublicLanguages,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get Public Language
export const usePublicLanguage = (id: number) => {
  return useQuery({
    queryKey: languageKeys.publicDetail(id),
    queryFn: () => languagesApi.getPublicLanguage(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// Create Language Mutation
export const useCreateLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (languageData: Partial<Language>) =>
      languagesApi.createLanguage(languageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: languageKeys.public() });
    },
    onError: handleApiError,
  });
};

// Update Language Mutation
export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      languageData,
    }: {
      id: number;
      languageData: Partial<Language>;
    }) => languagesApi.updateLanguage(id, languageData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: languageKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: languageKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: languageKeys.public() });
    },
    onError: handleApiError,
  });
};

// Delete Language Mutation
export const useDeleteLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => languagesApi.deleteLanguage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: languageKeys.public() });
    },
    onError: handleApiError,
  });
};

// Toggle Language Active Mutation
export const useToggleLanguageActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => languagesApi.toggleLanguageActive(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: languageKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: languageKeys.detail(variables),
      });
      queryClient.invalidateQueries({ queryKey: languageKeys.public() });
    },
    onError: handleApiError,
  });
};

// Upload Language Flag Mutation
export const useUploadLanguageFlag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      languagesApi.uploadLanguageFlag(id, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: languageKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: languageKeys.publicDetail(variables.id),
      });
    },
    onError: handleApiError,
  });
};
