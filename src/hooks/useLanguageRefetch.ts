import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook to automatically refetch queries when language changes
 * @param queryKeys - Optional array of specific query keys to invalidate. If not provided, invalidates all queries.
 */
export const useLanguageRefetch = (queryKeys?: string[]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleLanguageChange = () => {
      // Translations are already loaded when this event fires
      if (queryKeys && queryKeys.length > 0) {
        // Invalidate specific queries
        queryKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      } else {
        // Invalidate all queries
        queryClient.invalidateQueries();
      }
    };

    // Listen for language change events
    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [queryClient, queryKeys]);
};
