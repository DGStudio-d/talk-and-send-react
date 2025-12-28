import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../api/types';

// Generic API hook state
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): ApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as ApiError });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Async operation hook
export function useAsyncOperation<T = any>(): {
  execute: (operation: () => Promise<T>) => Promise<T>;
  loading: boolean;
  error: ApiError | null;
  clearError: () => void;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      setLoading(false);
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setLoading(false);
      throw apiError;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    execute,
    loading,
    error,
    clearError,
  };
}

// Pagination hook
export function usePagination<T>(
  fetchFunction: (page: number, perPage: number, ...args: any[]) => Promise<{
    data: T[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
      has_next_page: boolean;
      has_previous_page: boolean;
    };
  }>,
  initialPage: number = 1,
  initialPerPage: number = 15
) {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: initialPerPage,
    total: 0,
    last_page: 1,
    has_next_page: false,
    has_previous_page: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(page, perPage, ...args);
      setData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err as ApiError);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, perPage]);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    if (pagination.has_next_page) {
      setPage(prev => prev + 1);
    }
  }, [pagination.has_next_page]);

  const previousPage = useCallback(() => {
    if (pagination.has_previous_page) {
      setPage(prev => prev - 1);
    }
  }, [pagination.has_previous_page]);

  const changePerPage = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing per page
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    pagination,
    loading,
    error,
    page,
    perPage,
    fetchData,
    goToPage,
    nextPage,
    previousPage,
    changePerPage,
    refresh,
  };
}

// File upload hook
export function useFileUpload(): {
  upload: (
    uploadFunction: (file: File, onProgress?: (progress: number) => void) => Promise<any>
  ) => (file: File) => Promise<any>;
  progress: number;
  loading: boolean;
  error: ApiError | null;
  clearError: () => void;
} {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const upload = useCallback((
    uploadFunction: (file: File, onProgress?: (progress: number) => void) => Promise<any>
  ) => {
    return async (file: File) => {
      setLoading(true);
      setError(null);
      setProgress(0);

      try {
        const result = await uploadFunction(file, setProgress);
        setLoading(false);
        setProgress(100);
        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        setLoading(false);
        setProgress(0);
        throw apiError;
      }
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    upload,
    progress,
    loading,
    error,
    clearError,
  };
}

// Debounced search hook
export function useDebouncedSearch<T>(
  searchFunction: (query: string, ...args: any[]) => Promise<T[]>,
  delay: number = 500
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchFunction(query);
        setResults(searchResults);
      } catch (err) {
        setError(err as ApiError);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, searchFunction, delay]);

  const clearResults = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearResults,
  };
}