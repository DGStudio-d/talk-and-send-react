import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, handleApiError } from "@/lib/api-client";
import { QuizAttempt, AttemptFilter, PaginatedResponse } from "@/types/api";

// Quiz Attempts Query Keys
export const quizAttemptKeys = {
  all: ["quizAttempts"] as const,
  lists: () => [...quizAttemptKeys.all, "list"] as const,
  list: (filters: AttemptFilter) =>
    [...quizAttemptKeys.lists(), filters] as const,
  mine: () => [...quizAttemptKeys.all, "mine"] as const,
  details: () => [...quizAttemptKeys.all, "detail"] as const,
  detail: (id: number) => [...quizAttemptKeys.details(), id] as const,
  results: (id: number) => [...quizAttemptKeys.detail(id), "results"] as const,
  public: () => [...quizAttemptKeys.all, "public"] as const,
  publicDetail: (id: string) => [...quizAttemptKeys.public(), id] as const,
  publicResults: (id: string) =>
    [...quizAttemptKeys.publicDetail(id), "results"] as const,
};

// Quiz Attempts API Functions
export const quizAttemptsApi = {
  // Get quiz attempts list
  getQuizAttempts: async (
    filters: AttemptFilter = {}
  ): Promise<PaginatedResponse<QuizAttempt>> => {
    const response = await apiClient.get("/quiz-attempts", { params: filters });
    return response.data;
  },

  // Get my quiz attempts
  getMyQuizAttempts: async (
    filters: { per_page?: number } = {}
  ): Promise<PaginatedResponse<QuizAttempt>> => {
    const response = await apiClient.get("/quiz-attempts/me", {
      params: filters,
    });
    return response.data;
  },

  // Get quiz attempt by ID
  getQuizAttemptById: async (id: number): Promise<QuizAttempt> => {
    const response = await apiClient.get(`/quiz-attempts/${id}`);
    return response.data;
  },

  // Start quiz attempt
  startQuizAttempt: async (
    quizId: number,
    data?: { user_name?: string; user_email?: string }
  ): Promise<QuizAttempt> => {
    const response = await apiClient.post(`/quizzes/${quizId}/attempts`, data);
    return response.data;
  },

  // Submit answer
  submitAnswer: async (
    attemptId: number,
    questionId: number,
    answer: string | string[]
  ): Promise<void> => {
    await apiClient.post(`/quiz-attempts/${attemptId}/answers`, {
      question_id: questionId,
      answer,
    });
  },

  // Complete quiz attempt
  completeQuizAttempt: async (attemptId: number): Promise<QuizAttempt> => {
    const response = await apiClient.post(
      `/quiz-attempts/${attemptId}/complete`
    );
    return response.data;
  },

  // Get quiz attempt results
  getQuizAttemptResults: async (attemptId: number): Promise<any> => {
    const response = await apiClient.get(`/quiz-attempts/${attemptId}/results`);
    return response.data;
  },

  // Delete quiz attempt
  deleteQuizAttempt: async (attemptId: number): Promise<void> => {
    await apiClient.delete(`/quiz-attempts/${attemptId}`);
  },

  // Public API - Start quiz attempt
  startPublicQuizAttempt: async (
    quizId: number,
    data?: {
      user_name?: string;
      user_email?: string;
    }
  ): Promise<QuizAttempt> => {
    const response = await apiClient.post(
      `/public-quiz-attempts/quizzes/${quizId}`,
      data
    );
    return response.data;
  },

  // Public API - Get quiz attempt
  getPublicQuizAttempt: async (
    publicAttemptId: string
  ): Promise<QuizAttempt> => {
    const response = await apiClient.get(
      `/public-quiz-attempts/${publicAttemptId}`
    );
    return response.data;
  },

  // Public API - Submit answer
  submitPublicAnswer: async (
    publicAttemptId: string,
    questionId: number,
    answer: string | string[]
  ): Promise<void> => {
    await apiClient.post(`/public-quiz-attempts/${publicAttemptId}/answers`, {
      question_id: questionId,
      answer,
    });
  },

  // Public API - Complete quiz attempt
  completePublicQuizAttempt: async (
    publicAttemptId: string
  ): Promise<QuizAttempt> => {
    const response = await apiClient.post(
      `/public-quiz-attempts/${publicAttemptId}/complete`
    );
    return response.data;
  },

  // Public API - Get quiz attempt results
  getPublicQuizAttemptResults: async (
    publicAttemptId: string
  ): Promise<any> => {
    const response = await apiClient.get(
      `/public-quiz-attempts/${publicAttemptId}/results`
    );
    return response.data;
  },
};

// React Query Hooks

// Get Quiz Attempts List
export const useQuizAttempts = (filters: AttemptFilter = {}) => {
  return useQuery({
    queryKey: quizAttemptKeys.list(filters),
    queryFn: () => quizAttemptsApi.getQuizAttempts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get My Quiz Attempts
export const useMyQuizAttempts = (filters: { per_page?: number } = {}) => {
  return useQuery({
    queryKey: quizAttemptKeys.mine(),
    queryFn: () => quizAttemptsApi.getMyQuizAttempts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get Quiz Attempt by ID
export const useQuizAttempt = (id: number) => {
  return useQuery({
    queryKey: quizAttemptKeys.detail(id),
    queryFn: () => quizAttemptsApi.getQuizAttemptById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Quiz Attempt Results
export const useQuizAttemptResults = (id: number) => {
  return useQuery({
    queryKey: quizAttemptKeys.results(id),
    queryFn: () => quizAttemptsApi.getQuizAttemptResults(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes (results don't change)
  });
};

// Get Public Quiz Attempt
export const usePublicQuizAttempt = (publicAttemptId: string) => {
  return useQuery({
    queryKey: quizAttemptKeys.publicDetail(publicAttemptId),
    queryFn: () => quizAttemptsApi.getPublicQuizAttempt(publicAttemptId),
    enabled: !!publicAttemptId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Public Quiz Attempt Results
export const usePublicQuizAttemptResults = (publicAttemptId: string) => {
  return useQuery({
    queryKey: quizAttemptKeys.publicResults(publicAttemptId),
    queryFn: () => quizAttemptsApi.getPublicQuizAttemptResults(publicAttemptId),
    enabled: !!publicAttemptId,
    staleTime: 10 * 60 * 1000, // 10 minutes (results don't change)
  });
};

// Quiz Attempts Mutations

// Start Quiz Attempt Mutation
export const useStartQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      data,
    }: {
      quizId: number;
      data?: { user_name?: string; user_email?: string };
    }) => quizAttemptsApi.startQuizAttempt(quizId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizAttemptKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quizAttemptKeys.mine() });
    },
    onError: handleApiError,
  });
};

// Submit Answer Mutation
export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attemptId,
      questionId,
      answer,
    }: {
      attemptId: number;
      questionId: number;
      answer: string | string[];
    }) => quizAttemptsApi.submitAnswer(attemptId, questionId, answer),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizAttemptKeys.detail(variables.attemptId),
      });
    },
    onError: handleApiError,
  });
};

// Complete Quiz Attempt Mutation
export const useCompleteQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: number) =>
      quizAttemptsApi.completeQuizAttempt(attemptId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: quizAttemptKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quizAttemptKeys.mine() });
      queryClient.invalidateQueries({
        queryKey: quizAttemptKeys.detail(variables),
      });
      queryClient.invalidateQueries({
        queryKey: quizAttemptKeys.results(variables),
      });
    },
    onError: handleApiError,
  });
};

// Delete Quiz Attempt Mutation
export const useDeleteQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: number) =>
      quizAttemptsApi.deleteQuizAttempt(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizAttemptKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quizAttemptKeys.mine() });
    },
    onError: handleApiError,
  });
};

// Public Quiz Attempts Mutations

// Start Public Quiz Attempt Mutation
export const useStartPublicQuizAttempt = () => {
  return useMutation({
    mutationFn: ({
      quizId,
      data,
    }: {
      quizId: number;
      data?: { user_name?: string; user_email?: string };
    }) => quizAttemptsApi.startPublicQuizAttempt(quizId, data),
    onError: handleApiError,
  });
};

// Submit Public Answer Mutation
export const useSubmitPublicAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      publicAttemptId,
      questionId,
      answer,
    }: {
      publicAttemptId: string;
      questionId: number;
      answer: string | string[];
    }) =>
      quizAttemptsApi.submitPublicAnswer(publicAttemptId, questionId, answer),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizAttemptKeys.publicDetail(variables.publicAttemptId),
      });
    },
    onError: handleApiError,
  });
};

// Complete Public Quiz Attempt Mutation
export const useCompletePublicQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (publicAttemptId: string) =>
      quizAttemptsApi.completePublicQuizAttempt(publicAttemptId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizAttemptKeys.publicDetail(variables),
      });
      queryClient.invalidateQueries({
        queryKey: quizAttemptKeys.publicResults(variables),
      });
    },
    onError: handleApiError,
  });
};
