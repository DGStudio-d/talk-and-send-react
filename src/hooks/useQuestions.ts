import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionApi } from '../lib/api';

/**
 * Hook for creating a new question
 */
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ quizId, data }: { quizId: number; data: any }) => {
      const response = await questionApi.create(quizId, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};

/**
 * Hook for updating a question
 */
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data, quizId }: { id: number; data: any; quizId: number }) => {
      const response = await questionApi.update(id, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};

/**
 * Hook for deleting a question
 */
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, quizId }: { id: number; quizId: number }) => {
      const response = await questionApi.delete(id);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};

/**
 * Hook for reordering a question
 */
export const useReorderQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, order, quizId }: { id: number; order: number; quizId: number }) => {
      const response = await questionApi.reorder(id, order);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};
