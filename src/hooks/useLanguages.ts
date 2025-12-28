import { useCallback } from 'react';
import { LanguageService } from '../api/services/languageService';
import { Language, LanguageFilters, CreateLanguageRequest, UpdateLanguageRequest } from '../api/types';
import { useApi, useAsyncOperation, usePagination, useFileUpload, useDebouncedSearch } from './useApi';

// Hook for fetching all active languages
export function useActiveLanguages() {
  return useApi(() => LanguageService.getAllActive(), []);
}

// Hook for fetching a single language
export function useLanguage(id: number) {
  return useApi(() => LanguageService.getById(id), [id]);
}

// Hook for paginated languages
export function useLanguages(filters?: LanguageFilters) {
  const fetchLanguages = useCallback(
    (page: number, perPage: number) => LanguageService.getAll(page, perPage, filters),
    [filters]
  );

  return usePagination(fetchLanguages);
}

// Hook for language operations (CRUD)
export function useLanguageOperations() {
  const { execute, loading, error, clearError } = useAsyncOperation<Language>();

  const createLanguage = useCallback(
    (data: CreateLanguageRequest) => execute(() => LanguageService.create(data)),
    [execute]
  );

  const updateLanguage = useCallback(
    (id: number, data: UpdateLanguageRequest) => execute(() => LanguageService.update(id, data)),
    [execute]
  );

  const deleteLanguage = useCallback(
    (id: number) => execute(() => LanguageService.delete(id)),
    [execute]
  );

  const toggleActive = useCallback(
    (id: number) => execute(() => LanguageService.toggleActive(id)),
    [execute]
  );

  return {
    createLanguage,
    updateLanguage,
    deleteLanguage,
    toggleActive,
    loading,
    error,
    clearError,
  };
}

// Hook for language search
export function useLanguageSearch(filters?: LanguageFilters) {
  const searchFunction = useCallback(
    (query: string) => LanguageService.search(query, filters),
    [filters]
  );

  return useDebouncedSearch(searchFunction);
}

// Hook for language statistics
export function useLanguageStats(id: number) {
  return useApi(() => LanguageService.getStats(id), [id]);
}

// Hook for popular languages
export function usePopularLanguages(limit?: number) {
  return useApi(() => LanguageService.getPopular(limit), [limit]);
}

// Hook for language flag upload
export function useLanguageFlagUpload() {
  const { upload, progress, loading, error, clearError } = useFileUpload();

  const uploadFlag = useCallback(
    (id: number) =>
      upload((file, onProgress) =>
        LanguageService.uploadFlag(id, file, onProgress)
      ),
    [upload]
  );

  return {
    uploadFlag,
    progress,
    loading,
    error,
    clearError,
  };
}

// Combined hook for language management dashboard
export function useLanguageDashboard(filters?: LanguageFilters) {
  const languages = useLanguages(filters);
  const operations = useLanguageOperations();
  const search = useLanguageSearch(filters);
  const flagUpload = useLanguageFlagUpload();

  return {
    // Language list
    languages: languages.data,
    pagination: languages.pagination,
    loading: languages.loading,
    error: languages.error,
    refreshLanguages: languages.refresh,
    goToPage: languages.goToPage,
    nextPage: languages.nextPage,
    previousPage: languages.previousPage,
    changePerPage: languages.changePerPage,

    // Operations
    createLanguage: operations.createLanguage,
    updateLanguage: operations.updateLanguage,
    deleteLanguage: operations.deleteLanguage,
    toggleActive: operations.toggleActive,
    operationLoading: operations.loading,
    operationError: operations.error,
    clearOperationError: operations.clearError,

    // Search
    searchQuery: search.query,
    setSearchQuery: search.setQuery,
    searchResults: search.results,
    searchLoading: search.loading,
    searchError: search.error,
    clearSearch: search.clearResults,

    // Flag upload
    uploadFlag: flagUpload.uploadFlag,
    uploadProgress: flagUpload.progress,
    uploadLoading: flagUpload.loading,
    uploadError: flagUpload.error,
    clearUploadError: flagUpload.clearError,
  };
}