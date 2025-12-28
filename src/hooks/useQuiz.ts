import { useCallback } from 'react';
import { QuizService } from '../api/services';
import { Quiz, QuizFilters, CreateQuizRequest, UpdateQuizRequest } from '../api/types';
import { useApi, useAsyncOperation, usePagination, useFileUpload, useDebouncedSearch } from './useApi';

// Hook for fetching a single quiz
export function useQuiz(id: number) {
  return useApi(() => QuizService.getById(id), [id]);
}

// Hook for fetching quiz questions
export function useQuizQuestions(id: number) {
  return useApi(() => QuizService.getQuestions(id), [id]);
}

// Hook for fetching quiz statistics
export function useQuizStats(id: number) {
  return useApi(() => QuizService.getStats(id), [id]);
}

// Hook for fetching popular quizzes
export function usePopularQuizzes(limit?: number, languageId?: number) {
  return useApi(() => QuizService.getPopular(limit, languageId), [limit, languageId]);
}

// Hook for fetching recent quizzes
export function useRecentQuizzes(limit?: number, languageId?: number) {
  return useApi(() => QuizService.getRecent(limit, languageId), [limit, languageId]);
}

// Hook for fetching featured quizzes
export function useFeaturedQuizzes(limit?: number, languageId?: number) {
  return useApi(() => QuizService.getFeatured(limit, languageId), [limit, languageId]);
}

// Hook for paginated quizzes
export function useQuizzes(filters?: QuizFilters) {
  const fetchQuizzes = useCallback(
    (page: number, perPage: number) => QuizService.getAll(page, perPage, filters),
    [filters]
  );

  return usePagination(fetchQuizzes);
}

// Hook for paginated user's quizzes
export function useMyQuizzes(filters?: QuizFilters) {
  const fetchMyQuizzes = useCallback(
    (page: number, perPage: number) => QuizService.getMine(page, perPage, filters),
    [filters]
  );

  return usePagination(fetchMyQuizzes);
}

// Hook for paginated quiz attempts
export function useQuizAttempts(quizId: number, filters?: Record<string, any>) {
  const fetchAttempts = useCallback(
    (page: number, perPage: number) => QuizService.getAttempts(quizId, page, perPage, filters),
    [quizId, filters]
  );

  return usePagination(fetchAttempts);
}

// Hook for quiz operations (CRUD)
export function useQuizOperations() {
  const { execute, loading, error, clearError } = useAsyncOperation<Quiz>();

  const createQuiz = useCallback(
    (data: CreateQuizRequest) => execute(() => QuizService.create(data)),
    [execute]
  );

  const updateQuiz = useCallback(
    (id: number, data: UpdateQuizRequest) => execute(() => QuizService.update(id, data)),
    [execute]
  );

  const deleteQuiz = useCallback(
    (id: number) => execute(() => QuizService.delete(id)),
    [execute]
  );

  const toggleActive = useCallback(
    (id: number) => execute(() => QuizService.toggleActive(id)),
    [execute]
  );

  const duplicateQuiz = useCallback(
    (id: number, newTitle?: string) => execute(() => QuizService.duplicate(id, newTitle)),
    [execute]
  );

  return {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    toggleActive,
    duplicateQuiz,
    loading,
    error,
    clearError,
  };
}

// Hook for quiz import
export function useQuizImport() {
  const { upload, progress, loading, error, clearError } = useFileUpload();

  const importQuiz = useCallback(
    (languageId?: number, teacherId?: number) =>
      upload((file, onProgress) =>
        QuizService.import(file, languageId, teacherId, onProgress)
      ),
    [upload]
  );

  return {
    importQuiz,
    progress,
    loading,
    error,
    clearError,
  };
}

// Hook for quiz export
export function useQuizExport() {
  const { execute, loading, error, clearError } = useAsyncOperation();

  const exportQuizzes = useCallback(
    (filename?: string, quizIds?: number[]) =>
      execute(() => QuizService.export(filename, quizIds)),
    [execute]
  );

  return {
    exportQuizzes,
    loading,
    error,
    clearError,
  };
}

// Hook for quiz search
export function useQuizSearch(filters?: QuizFilters) {
  const searchFunction = useCallback(
    (query: string) => QuizService.search(query, filters),
    [filters]
  );

  return useDebouncedSearch(searchFunction);
}

// Hook for public quiz access (no authentication)
export function usePublicQuiz(id: number) {
  return useApi(() => QuizService.getPublicQuiz(id), [id]);
}

// Hook for public quiz questions (no authentication)
export function usePublicQuizQuestions(id: number) {
  return useApi(() => QuizService.getPublicQuizQuestions(id), [id]);
}

// Hook for quizzes by language
export function useQuizzesByLanguage(languageId: number) {
  return useApi(() => QuizService.getByLanguage(languageId), [languageId]);
}

// Combined hook for quiz management dashboard
export function useQuizDashboard(filters?: QuizFilters) {
  const quizzes = useQuizzes(filters);
  const operations = useQuizOperations();
  const importHook = useQuizImport();
  const exportHook = useQuizExport();
  const search = useQuizSearch(filters);

  return {
    // Quiz list
    quizzes: quizzes.data,
    pagination: quizzes.pagination,
    loading: quizzes.loading,
    error: quizzes.error,
    refreshQuizzes: quizzes.refresh,
    goToPage: quizzes.goToPage,
    nextPage: quizzes.nextPage,
    previousPage: quizzes.previousPage,
    changePerPage: quizzes.changePerPage,

    // Operations
    createQuiz: operations.createQuiz,
    updateQuiz: operations.updateQuiz,
    deleteQuiz: operations.deleteQuiz,
    toggleActive: operations.toggleActive,
    duplicateQuiz: operations.duplicateQuiz,
    operationLoading: operations.loading,
    operationError: operations.error,
    clearOperationError: operations.clearError,

    // Import
    importQuiz: importHook.importQuiz,
    importProgress: importHook.progress,
    importLoading: importHook.loading,
    importError: importHook.error,
    clearImportError: importHook.clearError,

    // Export
    exportQuizzes: exportHook.exportQuizzes,
    exportLoading: exportHook.loading,
    exportError: exportHook.error,
    clearExportError: exportHook.clearError,

    // Search
    searchQuery: search.query,
    setSearchQuery: search.setQuery,
    searchResults: search.results,
    searchLoading: search.loading,
    searchError: search.error,
    clearSearch: search.clearResults,
  };
}