import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { languageApi } from '../lib/api';
import { Language } from '../types/models';

/**
 * Hook for fetching all languages
 */
export const useLanguages = (params?: any) => {
  return useQuery({
    queryKey: ['languages', params],
    queryFn: async () => {
      const response = await languageApi.getAll(params);
      return response.data.data as Language[];
    },
  });
};

/**
 * Hook for fetching a single language by ID
 */
export const useLanguage = (id: number) => {
  return useQuery({
    queryKey: ['language', id],
    queryFn: async () => {
      const response = await languageApi.getById(id);
      return response.data.data as Language;
    },
    enabled: !!id,
  });
};

/**
 * Hook for creating a new language
 */
export const useCreateLanguage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await languageApi.create(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
};

/**
 * Hook for updating a language
 */
export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await languageApi.update(id, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['language', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
};

/**
 * Hook for deleting a language
 */
export const useDeleteLanguage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await languageApi.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
};

/**
 * Hook for toggling language active status
 */
export const useToggleLanguageActive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await languageApi.toggleActive(id);
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['language', id] });
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
};

/**
 * Hook for uploading language flag image
 */
export const useUploadLanguageFlag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const response = await languageApi.uploadFlag(id, file);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['language', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
};
