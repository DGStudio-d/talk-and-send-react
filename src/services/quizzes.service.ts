import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, handleApiError } from "@/lib/api-client";
import { Quiz, QuizQuestion, QuizFilter, PaginatedResponse } from "@/types/api";

// Quizzes Query Keys
export const quizKeys = {
  all: ["quizzes"] as const,
  lists: () => [...quizKeys.all, "list"] as const,
  list: (filters: QuizFilter) => [...quizKeys.lists(), filters] as const,
  search: (params: {
    q: string;
    language_id?: number;
    level?: string;
    limit?: number;
  }) => [...quizKeys.all, "search", params] as const,
  popular: (params?: { limit?: number; language_id?: number }) =>
    [...quizKeys.all, "popular", params] as const,
  recent: (params?: { limit?: number; language_id?: number }) =>
    [...quizKeys.all, "recent", params] as const,
  featured: (params?: { limit?: number; language_id?: number }) =>
    [...quizKeys.all, "featured", params] as const,
  mine: () => [...quizKeys.all, "mine"] as const,
  details: () => [...quizKeys.all, "detail"] as const,
  detail: (id: number) => [...quizKeys.details(), id] as const,
  questions: (id: number) => [...quizKeys.detail(id), "questions"] as const,
  attempts: (id: number) => [...quizKeys.detail(id), "attempts"] as const,
  stats: (id: number) => [...quizKeys.detail(id), "stats"] as const,
  public: () => [...quizKeys.all, "public"] as const,
  publicDetail: (id: number) => [...quizKeys.public(), id] as const,
  publicQuestions: (id: number) =>
    [...quizKeys.publicDetail(id), "questions"] as const,
};

// Quiz Import/Export Mutations
export const useExportQuizzes = () => {
  return useMutation({
    mutationFn: (filters?: QuizFilter) => quizzesApi.exportQuizzes(filters),
    onError: handleApiError,
  });
};

export const useImportQuizzes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => quizzesApi.importQuizzes(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quizKeys.mine() });
    },
    onError: handleApiError,
  });
};

export const useEnhancedImportQuizzes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => quizzesApi.enhancedImportQuizzes(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quizKeys.mine() });
    },
    onError: handleApiError,
  });
};

export const useDownloadQuizImportTemplate = () => {
  return useMutation({
    mutationFn: () => quizzesApi.downloadImportTemplate(),
    onError: handleApiError,
  });
};

// Quiz Questions Query Keys
export const quizQuestionKeys = {
  all: ["quizQuestions"] as const,
  lists: () => [...quizQuestionKeys.all, "list"] as const,
  list: (quizId: number, filters?: { type?: string }) =>
    [...quizQuestionKeys.lists(), quizId, filters] as const,
  detail: (id: number) => [...quizQuestionKeys.all, "detail", id] as const,
};

// Quizzes API Functions
export const quizzesApi = {
  // Get quizzes list
  getQuizzes: async (
    filters: QuizFilter = {}
  ): Promise<PaginatedResponse<Quiz>> => {
    const response = await apiClient.get("/quizzes", { params: filters });
    return {
      data: (response.data as any)?.data?.quizzes ?? [],
      pagination: (response.data as any)?.data?.pagination,
    };
  },

  // Search quizzes
  searchQuizzes: async (params: {
    q: string;
    language_id?: number;
    level?: string;
    limit?: number;
  }): Promise<Quiz[]> => {
    const response = await apiClient.get("/quizzes/search", { params });
    return (response.data as any)?.data ?? [];
  },

  // Get popular quizzes
  getPopularQuizzes: async (params?: {
    limit?: number;
    language_id?: number;
  }): Promise<Quiz[]> => {
    const response = await apiClient.get("/quizzes/popular", { params });
    return (response.data as any)?.data ?? [];
  },

  // Get recent quizzes
  getRecentQuizzes: async (params?: {
    limit?: number;
    language_id?: number;
  }): Promise<Quiz[]> => {
    const response = await apiClient.get("/quizzes/recent", { params });
    return (response.data as any)?.data ?? [];
  },

  // Get featured quizzes
  getFeaturedQuizzes: async (params?: {
    limit?: number;
    language_id?: number;
  }): Promise<Quiz[]> => {
    const response = await apiClient.get("/quizzes/featured", { params });
    return (response.data as any)?.data ?? [];
  },

  // Get my quizzes
  getMyQuizzes: async (): Promise<Quiz[]> => {
    const response = await apiClient.get("/quizzes/mine");
    return (response.data as any)?.data ?? [];
  },

  // Get quiz by ID
  getQuizById: async (id: number): Promise<Quiz> => {
    const response = await apiClient.get(`/quizzes/${id}`);
    return (response.data as any)?.data;
  },

  // Get quiz questions
  getQuizQuestions: async (
    id: number,
    filters?: { type?: string }
  ): Promise<QuizQuestion[]> => {
    const response = await apiClient.get(`/quizzes/${id}/questions`, {
      params: filters,
    });
    return (response.data as any)?.data ?? [];
  },

  // Get quiz attempts
  getQuizAttempts: async (id: number): Promise<any[]> => {
    const response = await apiClient.get(`/quizzes/${id}/attempts`);
    return (
      (response.data as any)?.data?.attempts ??
      (response.data as any)?.data ??
      []
    );
  },

  // Get quiz statistics
  getQuizStats: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/quizzes/${id}/stats`);
    return (response.data as any)?.data;
  },

  // Create quiz
  createQuiz: async (quizData: Partial<Quiz>): Promise<Quiz> => {
    const response = await apiClient.post("/quizzes", quizData);
    return (response.data as any)?.data;
  },

  // Update quiz
  updateQuiz: async (id: number, quizData: Partial<Quiz>): Promise<Quiz> => {
    const response = await apiClient.put(`/quizzes/${id}`, quizData);
    return (response.data as any)?.data;
  },

  // Delete quiz
  deleteQuiz: async (id: number): Promise<void> => {
    await apiClient.delete(`/quizzes/${id}`);
  },

  // Duplicate quiz
  duplicateQuiz: async (id: number): Promise<Quiz> => {
    const response = await apiClient.post(`/quizzes/${id}/duplicate`);
    return (response.data as any)?.data;
  },

  // Toggle quiz active status
  toggleQuizActive: async (id: number): Promise<Quiz> => {
    const response = await apiClient.patch(`/quizzes/${id}/toggle-active`);
    return (response.data as any)?.data;
  },

  // Export quizzes
  exportQuizzes: async (filters?: QuizFilter): Promise<Blob> => {
    const response = await apiClient.getBlob("/quizzes/export", {
      params: filters,
    });
    return response;
  },

  // Import quizzes
  importQuizzes: async (file: File): Promise<any> => {
    const response = await apiClient.upload("/quizzes/import", file);
    return response;
  },

  // Enhanced import
  enhancedImportQuizzes: async (file: File): Promise<any> => {
    const response = await apiClient.upload("/quizzes/enhanced-import", file);
    return response;
  },

  // Get import info
  getImportInfo: async (): Promise<any> => {
    const response = await apiClient.get("/quizzes/import-info");
    return (response.data as any)?.data;
  },

  // Download import template
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await apiClient.getBlob("/quizzes/import-template");
    return response;
  },

  // Public API - Get quiz details
  getPublicQuiz: async (id: number): Promise<Quiz> => {
    const response = await apiClient.get(`/quizzes/${id}/public`);
    return (response.data as any)?.data;
  },

  // Public API - Get quiz questions
  getPublicQuizQuestions: async (id: number): Promise<QuizQuestion[]> => {
    const response = await apiClient.get(`/quizzes/${id}/questions/public`);
    return (response.data as any)?.data ?? [];
  },
};

// Quiz Questions API Functions
export const quizQuestionsApi = {
  // Get quiz questions
  getQuestions: async (
    quizId: number,
    filters?: { type?: string }
  ): Promise<QuizQuestion[]> => {
    const response = await apiClient.get(`/quizzes/${quizId}/questions`, {
      params: filters,
    });
    return response.data;
  },

  // Create question
  createQuestion: async (
    quizId: number,
    questionData: Partial<QuizQuestion>
  ): Promise<QuizQuestion> => {
    const response = await apiClient.post(
      `/quizzes/${quizId}/questions`,
      questionData
    );
    return response.data;
  },

  // Get question by ID
  getQuestionById: async (
    quizId: number,
    questionId: number
  ): Promise<QuizQuestion> => {
    const response = await apiClient.get(
      `/quizzes/${quizId}/questions/${questionId}`
    );
    return response.data;
  },

  // Update question
  updateQuestion: async (
    quizId: number,
    questionId: number,
    questionData: Partial<QuizQuestion>
  ): Promise<QuizQuestion> => {
    const response = await apiClient.put(
      `/quizzes/${quizId}/questions/${questionId}`,
      questionData
    );
    return response.data;
  },

  // Delete question
  deleteQuestion: async (quizId: number, questionId: number): Promise<void> => {
    await apiClient.delete(`/quizzes/${quizId}/questions/${questionId}`);
  },

  // Upload question media
  uploadQuestionMedia: async (
    quizId: number,
    questionId: number,
    file: File,
    questionType?: string
  ): Promise<any> => {
    const response = await apiClient.upload(
      `/quizzes/${quizId}/questions/${questionId}/media`,
      file,
      questionType ? { question_type: questionType } : undefined
    );
    return response.data;
  },

  // Delete question media
  deleteQuestionMedia: async (
    quizId: number,
    questionId: number
  ): Promise<void> => {
    await apiClient.delete(`/quizzes/${quizId}/questions/${questionId}/media`);
  },

  // Get question stats
  getQuestionStats: async (
    quizId: number,
    questionId: number
  ): Promise<any> => {
    const response = await apiClient.get(
      `/quizzes/${quizId}/questions/${questionId}/stats`
    );
    return response.data;
  },

  // Reorder questions
  reorderQuestions: async (
    quizId: number,
    questionOrders: { question_id: number; order: number }[]
  ): Promise<void> => {
    await apiClient.put(`/quizzes/${quizId}/questions/reorder`, {
      questions: questionOrders,
    });
  },
};

// React Query Hooks - Quizzes

// Get Quizzes List
export const useQuizzes = (filters: QuizFilter = {}) => {
  return useQuery({
    queryKey: quizKeys.list(filters),
    queryFn: () => quizzesApi.getQuizzes(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Search Quizzes
export const useSearchQuizzes = (params: {
  q: string;
  language_id?: number;
  level?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: quizKeys.search(params),
    queryFn: () => quizzesApi.searchQuizzes(params),
    enabled: params.q.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get Popular Quizzes
export const usePopularQuizzes = (params?: {
  limit?: number;
  language_id?: number;
}) => {
  return useQuery({
    queryKey: quizKeys.popular(params),
    queryFn: () => quizzesApi.getPopularQuizzes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Recent Quizzes
export const useRecentQuizzes = (params?: {
  limit?: number;
  language_id?: number;
}) => {
  return useQuery({
    queryKey: quizKeys.recent(params),
    queryFn: () => quizzesApi.getRecentQuizzes(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Get Featured Quizzes
export const useFeaturedQuizzes = (params?: {
  limit?: number;
  language_id?: number;
}) => {
  return useQuery({
    queryKey: quizKeys.featured(params),
    queryFn: () => quizzesApi.getFeaturedQuizzes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get My Quizzes
export const useMyQuizzes = () => {
  return useQuery({
    queryKey: quizKeys.mine(),
    queryFn: quizzesApi.getMyQuizzes,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get Quiz by ID
export const useQuiz = (id: number) => {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: () => quizzesApi.getQuizById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Quiz Questions
export const useQuizQuestions = (id: number, filters?: { type?: string }) => {
  return useQuery({
    queryKey: quizKeys.questions(id),
    queryFn: () => quizzesApi.getQuizQuestions(id, filters),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Quiz Attempts
export const useQuizAttempts = (id: number) => {
  return useQuery({
    queryKey: quizKeys.attempts(id),
    queryFn: () => quizzesApi.getQuizAttempts(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Get Quiz Stats
export const useQuizStats = (id: number) => {
  return useQuery({
    queryKey: quizKeys.stats(id),
    queryFn: () => quizzesApi.getQuizStats(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Public Quiz
export const usePublicQuiz = (id: number) => {
  return useQuery({
    queryKey: quizKeys.publicDetail(id),
    queryFn: () => quizzesApi.getPublicQuiz(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// Get Public Quiz Questions
export const usePublicQuizQuestions = (id: number) => {
  return useQuery({
    queryKey: quizKeys.publicQuestions(id),
    queryFn: () => quizzesApi.getPublicQuizQuestions(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// Quiz Mutations
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizData: Partial<Quiz>) => quizzesApi.createQuiz(quizData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quizKeys.mine() });
    },
    onError: handleApiError,
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quizData }: { id: number; quizData: Partial<Quiz> }) =>
      quizzesApi.updateQuiz(id, quizData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: quizKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: quizKeys.mine() });
    },
    onError: handleApiError,
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => quizzesApi.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quizKeys.mine() });
    },
    onError: handleApiError,
  });
};

export const useDuplicateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => quizzesApi.duplicateQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quizKeys.mine() });
    },
    onError: handleApiError,
  });
};

export const useToggleQuizActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => quizzesApi.toggleQuizActive(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quizKeys.detail(variables) });
    },
    onError: handleApiError,
  });
};

// Quiz Questions Mutations
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      questionData,
    }: {
      quizId: number;
      questionData: Partial<QuizQuestion>;
    }) => quizQuestionsApi.createQuestion(quizId, questionData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.questions(variables.quizId),
      });
    },
    onError: handleApiError,
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      questionId,
      questionData,
    }: {
      quizId: number;
      questionId: number;
      questionData: Partial<QuizQuestion>;
    }) => quizQuestionsApi.updateQuestion(quizId, questionId, questionData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.questions(variables.quizId),
      });
    },
    onError: handleApiError,
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      questionId,
    }: {
      quizId: number;
      questionId: number;
    }) => quizQuestionsApi.deleteQuestion(quizId, questionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.questions(variables.quizId),
      });
    },
    onError: handleApiError,
  });
};

export const useUploadQuestionMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      questionId,
      file,
      questionType,
    }: {
      quizId: number;
      questionId: number;
      file: File;
      questionType: string;
    }) =>
      quizQuestionsApi.uploadQuestionMedia(
        quizId,
        questionId,
        file,
        questionType
      ),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.questions(variables.quizId),
      });
    },
    onError: handleApiError,
  });
};

export const useReorderQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      questionOrders,
    }: {
      quizId: number;
      questionOrders: { question_id: number; order: number }[];
    }) => quizQuestionsApi.reorderQuestions(quizId, questionOrders),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.questions(variables.quizId),
      });
    },
    onError: handleApiError,
  });
};
