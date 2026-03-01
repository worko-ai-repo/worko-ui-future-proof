import { useRef, useState, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * Generic interface for paginated API responses that use cursor-based pagination.
 *
 * @template T - The type of data items in the response array
 */
export interface PaginatedApiResponse<T = any> {
  /** Array of data items for the current page */
  data: T[];
  /** Pagination metadata */
  pagination: {
    /** Cursor key for the next page (undefined if no more pages) */
    lastKey?: string;
    /** Sort order applied to the results */
    sortOrder?: string;
    /** Number of times this query has been executed */
    timesQueried?: number;
    /** Number of items returned in current query */
    queriedCount?: number;
    /** Total number of items available */
    count: number;
    /** Number of items per page */
    pageSize: number;
  };
}

/**
 * Base parameters interface for cursor-based pagination requests.
 * Extend this interface for specific API parameter requirements.
 */
export interface CursorPaginationParams {
  /** Number of items to fetch per page */
  pageSize: number;
  /** Cursor key for pagination (optional, omit for first page) */
  lastKey?: string;
  /** Allow additional custom parameters */
  [key: string]: any;
}

/**
 * Configuration options for the useCursorPagination hook.
 *
 * @template TData - The type of individual data items
 * @template TParams - The type of parameters extending CursorPaginationParams
 */
export interface UseCursorPaginationConfig<TData, TParams extends CursorPaginationParams> {
  /**
   * Unique query key for React Query caching.
   * Should include all parameters that affect the query result.
   */
  queryKey: (string | number | boolean | object)[];

  /**
   * Function that executes the API call with the provided parameters.
   * Must return a Promise resolving to PaginatedApiResponse<TData>.
   */
  queryFn: (params: TParams) => Promise<PaginatedApiResponse<TData>>;

  /**
   * Base parameters for all API calls (excluding lastKey).
   * These will be merged with the cursor key for each request.
   */
  baseParams: Omit<TParams, "lastKey">;

  /** Whether the query should execute automatically (default: true) */
  enabled?: boolean;

  /** Time in milliseconds before data is considered stale (default: 5 minutes) */
  staleTime?: number;

  /** Time in milliseconds before unused data is garbage collected (default: 10 minutes) */
  gcTime?: number;
}

/**
 * Return type for the useCursorPagination hook containing all pagination state and controls.
 *
 * @template TData - The type of individual data items
 */
export interface UseCursorPaginationReturn<TData> {
  /** Current page data array */
  data: TData[];

  /** True if initial data is loading */
  isLoading: boolean;

  /** True if an error occurred during fetching */
  isError: boolean;

  /** Error object if an error occurred, null otherwise */
  error: Error | null;

  /** True if there are more pages available */
  hasNextPage: boolean;

  /** True if there are previous pages available */
  hasPreviousPage: boolean;

  /** Current page number (1-indexed) */
  currentPage: number;

  /** Total number of pages (calculated from totalCount and pageSize) */
  totalPages: number;

  /** Function to navigate to the next page */
  goToNextPage: () => Promise<void>;

  /** Function to navigate to the previous page */
  goToPreviousPage: () => Promise<void>;

  /** Function to refetch the current page */
  refetch: () => Promise<void>;

  /** Function to reset pagination to the first page */
  reset: () => void;

  /** True if currently loading the next page */
  isLoadingNextPage: boolean;

  /** True if currently loading the previous page */
  isLoadingPreviousPage: boolean;

  /** Total number of items across all pages */
  totalCount: number;
}

/**
 * Custom hook for cursor-based pagination with navigation history support.
 *
 * This hook provides a complete pagination solution for APIs that use cursor-based
 * pagination (lastKey). It maintains a navigation history stack to enable both
 * forward and backward navigation through pages.
 *
 * @template TData - The type of individual data items returned by the API
 * @template TParams - The type of parameters for the API call, extending CursorPaginationParams
 *
 * @param config - Configuration object containing query settings and API function
 * @returns Object containing pagination state and navigation controls
 *
 * @example
 * ```typescript
 * const pagination = useCursorPagination({
 *   queryKey: ['jobs', companyId, searchTerm],
 *   queryFn: (params) => jobsAPI.fetchJobs(params),
 *   baseParams: {
 *     pageSize: 20,
 *     companyId: 'company-123',
 *     status: 'active'
 *   }
 * });
 *
 * // Use in component
 * const { data, hasNextPage, goToNextPage, isLoading } = pagination;
 * ```
 */
export function useCursorPagination<TData, TParams extends CursorPaginationParams>({
  queryKey,
  queryFn,
  baseParams,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
  gcTime = 10 * 60 * 1000, // 10 minutes
}: UseCursorPaginationConfig<TData, TParams>): UseCursorPaginationReturn<TData> {
  // Navigation history stack - stores cursor keys for each visited page
  const cursorStackRef = useRef<string[]>([""]);

  // Current position in the cursor stack (0-indexed)
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Loading states for navigation actions
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [isLoadingPreviousPage, setIsLoadingPreviousPage] = useState(false);

  // Flag to prevent multiple simultaneous navigation actions
  const isNavigatingRef = useRef(false);

  // React Query for data fetching
  const {
    data: queryData,
    isLoading,
    isError,
    error,
    refetch: refetchQuery,
    isFetching,
  } = useInfiniteQuery({
    queryKey: [...queryKey, currentPageIndex],
    queryFn: async () => {
      const currentCursor = cursorStackRef.current[currentPageIndex];
      const params = {
        ...baseParams,
        ...(currentCursor ? { lastKey: currentCursor } : {}),
      } as TParams;
      return await queryFn(params);
    },
    initialPageParam: "",
    getNextPageParam: () => undefined, // Manual pagination management
    enabled,
    staleTime,
    gcTime,
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors like 401, 403, 404)
      if (error?.status && error.status >= 400 && error.status < 500) {
        return false;
      }
      // Retry up to 3 times for 5xx errors (server errors like 502, 503)
      if (failureCount < 3) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
  });

  // Extract current page data and pagination info
  const currentPageData = queryData?.pages[0];
  const data = currentPageData?.data || [];
  const pagination = currentPageData?.pagination;

  /**
   * Navigate to the next page if available.
   * Adds the next page's cursor to the navigation stack and updates the current page index.
   */
  const goToNextPage = useCallback(async () => {
    // Prevent multiple simultaneous navigation actions
    if (!pagination?.lastKey || isNavigatingRef.current || isLoadingNextPage || isFetching) {
      return;
    }

    isNavigatingRef.current = true;
    setIsLoadingNextPage(true);

    try {
      // Add the new cursor to the stack if we're at the end of our history
      if (currentPageIndex === cursorStackRef.current.length - 1) {
        cursorStackRef.current.push(pagination.lastKey);
      }

      // Update page index - this will trigger the query to refetch automatically
      setCurrentPageIndex((prev) => prev + 1);

      // Wait for the query to settle
      await new Promise((resolve) => setTimeout(resolve, 100));
    } finally {
      setIsLoadingNextPage(false);
      isNavigatingRef.current = false;
    }
  }, [pagination?.lastKey, currentPageIndex, isLoadingNextPage, isFetching]);

  /**
   * Navigate to the previous page if available.
   * Uses the navigation stack to return to the previously visited page.
   */
  const goToPreviousPage = useCallback(async () => {
    // Prevent multiple simultaneous navigation actions
    if (currentPageIndex === 0 || isNavigatingRef.current || isLoadingPreviousPage || isFetching) {
      return;
    }

    isNavigatingRef.current = true;
    setIsLoadingPreviousPage(true);

    try {
      // Update page index - this will trigger the query to refetch automatically
      setCurrentPageIndex((prev) => prev - 1);

      // Wait for the query to settle
      await new Promise((resolve) => setTimeout(resolve, 100));
    } finally {
      setIsLoadingPreviousPage(false);
      isNavigatingRef.current = false;
    }
  }, [currentPageIndex, isLoadingPreviousPage, isFetching]);

  /**
   * Reset pagination state to the first page.
   * Clears the navigation history and loading states.
   */
  const reset = useCallback(() => {
    cursorStackRef.current = [""];
    setCurrentPageIndex(0);
    setIsLoadingNextPage(false);
    setIsLoadingPreviousPage(false);
    isNavigatingRef.current = false;
  }, []);

  /**
   * Refetch the current page data.
   * Useful for refreshing data after mutations or manual refresh requests.
   */
  const refetch = useCallback(async () => {
    if (isNavigatingRef.current) {
      return;
    }
    await refetchQuery();
  }, [refetchQuery]);

  // Calculate derived pagination state
  const hasNextPage = Boolean(pagination?.lastKey);
  const hasPreviousPage = currentPageIndex > 0;
  const currentPage = currentPageIndex + 1;
  const totalCount = pagination?.count || 0;
  const pageSize = pagination?.pageSize || baseParams.pageSize;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data,
    isLoading: isLoading || isFetching,
    isError,
    error: error as Error | null,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    refetch,
    reset,
    isLoadingNextPage,
    isLoadingPreviousPage,
    totalCount,
  };
}
