import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizAttemptApi } from '../lib/api';
import { QuizAttempt } from '../types/models';

/**
 * Hook for fetching user's quiz attempts with infinite scroll
 */
export const useQuizAttempts = () => {
  return useInfiniteQuery({
    queryKey: ['quizAttempts'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await quizAttemptApi.getMine({ page: pageParam });
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
 * Hook for fetching a single quiz attempt by ID
 */
export const useQuizAttempt = (id: number) => {
  return useQuery({
    queryKey: ['quizAttempt', id],
    queryFn: async () => {
      const response = await quizAttemptApi.getById(id);
      return response.data.data as QuizAttempt;
    },
    enabled: !!id,
  });
};

/**
 * Hook for fetching quiz attempt results
 */
export const useQuizAttemptResults = (id: number) => {
  return useQuery({
    queryKey: ['quizAttemptResults', id],
    queryFn: async () => {
      const response = await quizAttemptApi.getResults(id);
      return response.data.data as QuizAttempt;
    },
    enabled: !!id,
  });
};

/**
 * Hook for starting a new quiz attempt
 */
export const useStartQuizAttempt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quizId: number) => {
      const response = await quizAttemptApi.start({ quiz_id: quizId });
      return response.data.data as QuizAttempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizAttempts'] });
    },
  });
};

/**
 * Hook for submitting a quiz attempt
 */
export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, answers }: { id: number; answers: any }) => {
      const response = await quizAttemptApi.submit(id, { answers });
      return response.data.data as QuizAttempt;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizAttempt', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['quizAttempts'] });
      queryClient.invalidateQueries({ queryKey: ['quizAttemptResults', variables.id] });
    },
  });
};
