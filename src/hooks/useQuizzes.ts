import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizApi } from '../lib/api';
import { Quiz } from '../types/models';

/**
 * Hook for fetching all quizzes with optional filters
 */
export const useQuizzes = (params?: any) => {
  return useInfiniteQuery({
    queryKey: ['quizzes', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await quizApi.getAll({ ...params, page: pageParam });
      console.log(response.data.data);
      return response.data.data; // Access nested data
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined;
      const { pagination } = lastPage;
      return pagination.current_page < pagination.last_page
        ? pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
};

/**
 * Hook for fetching quizzes created by the current teacher
 */
export const useMyQuizzes = () => {
  return useQuery({
    queryKey: ['my-quizzes'],
    queryFn: async () => {
      const response = await quizApi.getAll();
      console.log(response.data.data);
      return response.data.data as Quiz[];
    },
  });
};

/**
 * Hook for fetching all quizzes with filters (for admin)
 */
export const useAllQuizzes = (params?: any) => {
  return useQuery({
    queryKey: ['all-quizzes', params],
    queryFn: async () => {
      const response = await quizApi.getAll(params);
      return response.data.data as Quiz[];
    },
  });
};

/**
 * Hook for fetching a single quiz by ID
 */
export const useQuiz = (id: number) => {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const response = await quizApi.getById(id);
      console.log('Quiz API Response:', response.data);
      return response.data.data as Quiz;
    },
    enabled: !!id,
  });
};

/**
 * Hook for creating a new quiz
 */
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await quizApi.create(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

/**
 * Hook for updating a quiz
 */
export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await quizApi.update(id, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

/**
 * Hook for deleting a quiz
 */
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await quizApi.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

/**
 * Hook for toggling quiz active status
 */
export const useToggleQuizActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await quizApi.toggleActive(id);
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', id] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};
