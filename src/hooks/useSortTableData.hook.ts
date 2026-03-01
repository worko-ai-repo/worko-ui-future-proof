import { DashboardTableSortOrder, SortTable } from "@Utils/SortTable.utils";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Configuration options for the useSortableData hook
 */
export interface UseSortableDataConfig {
  /**
   * Unique identifier for this table/component
   * Used as prefix in URL params to avoid conflicts between multiple tables
   * @example "jobs", "applications", "candidates"
   */
  tableId: string;

  /**
   * Whether to persist sort state in URL params
   * @default true
   */
  persistInUrl?: boolean;

  /**
   * Whether to persist sort state in localStorage
   * @default false
   */
  persistInLocalStorage?: boolean;

  /**
   * Default sort configuration to use on initial load
   */
  defaultSort?: {
    key: string;
    order: DashboardTableSortOrder;
  } | null;
}

/**
 * Sort configuration state
 */
export interface SortConfig {
  key: string;
  order: DashboardTableSortOrder;
}

/**
 * Return type for useSortableData hook
 */
export interface UseSortableDataReturn<T> {
  /** Data sorted according to current sort configuration */
  sortedData: T[];
  
  /** Current sort configuration */
  sortConfig: SortConfig | null;
  
  /** Function to toggle sort on a column */
  onSortChange: (key: string) => void;
  
  /** Function to set sort configuration programmatically */
  setSortConfig: (config: SortConfig | null) => void;
  
  /** Function to clear sort */
  clearSort: () => void;
  
  /** Function to reset to default sort */
  resetToDefault: () => void;
}

/**
 * Custom hook for sortable data with persistence in URL params and/or localStorage
 * 
 * This hook provides client-side sorting with automatic state persistence across:
 * - Page refreshes (via URL params or localStorage)
 * - Navigation (via URL params)
 * - Component remounts
 * 
 * @template T - The type of data items in the array
 * 
 * @param data - Array of data to be sorted
 * @param fallbackKeys - Object mapping primary keys to arrays of fallback keys for sorting
 * @param config - Configuration options for sorting behavior and persistence
 * 
 * @example
 * ```typescript
 * // In AdminJobs component
 * const { sortedData, sortConfig, onSortChange } = useSortableData(
 *   jobs,
 *   { 
 *     companyName: ['companyDetails.name', 'companyName'],
 *     location: ['location.city', 'location.state']
 *   },
 *   {
 *     tableId: 'admin-jobs',
 *     persistInUrl: true,
 *     defaultSort: { key: 'createdAt', order: 'desc' }
 *   }
 * );
 * 
 * // In Applications component
 * const { sortedData, onSortChange } = useSortableData(
 *   applications,
 *   {},
 *   { tableId: 'applications' }
 * );
 * ```
 */
export function useSortableData<T>(
  data: T[],
  fallbackKeys: Record<string, string[]>,
  config: UseSortableDataConfig
): UseSortableDataReturn<T> {
  const {
    tableId,
    persistInUrl = true,
    persistInLocalStorage = false,
    defaultSort = null,
  } = config;

  const [searchParams, setSearchParams] = useSearchParams();
  
  // Generate param keys specific to this table
  const sortKeyParam = `${tableId}_sortKey`;
  const sortOrderParam = `${tableId}_sortOrder`;
  const localStorageKey = `sortConfig_${tableId}`;

  /**
   * Initialize sort config from URL params, localStorage, or default
   */
  const getInitialSortConfig = useCallback((): SortConfig | null => {
    // Priority 1: Check URL params
    if (persistInUrl) {
      const urlSortKey = searchParams.get(sortKeyParam);
      const urlSortOrder = searchParams.get(sortOrderParam);
      
      if (urlSortKey && (urlSortOrder === "asc" || urlSortOrder === "desc")) {
        return {
          key: urlSortKey,
          order: urlSortOrder,
        };
      }
    }

    // Priority 2: Check localStorage
    if (persistInLocalStorage) {
      try {
        const stored = localStorage.getItem(localStorageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as SortConfig;
          if (parsed.key && (parsed.order === "asc" || parsed.order === "desc")) {
            return parsed;
          }
        }
      } catch (error) {
        console.warn(`Failed to parse sort config from localStorage for ${tableId}:`, error);
      }
    }

    // Priority 3: Use default
    return defaultSort;
  }, [
    persistInUrl,
    persistInLocalStorage,
    searchParams,
    sortKeyParam,
    sortOrderParam,
    localStorageKey,
    defaultSort,
  ]);

  const [sortConfig, setSortConfigState] = useState<SortConfig | null>(getInitialSortConfig);

  /**
   * Sync sort config to URL params and localStorage
   */
  useEffect(() => {
    if (!sortConfig) {
      // Remove sort params when no sort is active
      if (persistInUrl) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(sortKeyParam);
        newParams.delete(sortOrderParam);
        setSearchParams(newParams, { replace: true });
      }
      
      if (persistInLocalStorage) {
        localStorage.removeItem(localStorageKey);
      }
      return;
    }

    // Update URL params
    if (persistInUrl) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(sortKeyParam, sortConfig.key);
      newParams.set(sortOrderParam, sortConfig.order);
      setSearchParams(newParams, { replace: true });
    }

    // Update localStorage
    if (persistInLocalStorage) {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(sortConfig));
      } catch (error) {
        console.warn(`Failed to save sort config to localStorage for ${tableId}:`, error);
      }
    }
  }, [
    sortConfig,
    persistInUrl,
    persistInLocalStorage,
    searchParams,
    setSearchParams,
    sortKeyParam,
    sortOrderParam,
    localStorageKey,
    tableId,
  ]);

  /**
   * Memoized sorted data
   */
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const key = sortConfig.key;
    const keysToTry = fallbackKeys[key] || [key];

    return SortTable(data, keysToTry, sortConfig.order);
  }, [data, sortConfig, fallbackKeys]);

  /**
   * Toggle sort on a column
   * If already sorted by this column, toggle between asc/desc
   * If new column, start with asc
   */
  const onSortChange = useCallback((key: string) => {
    setSortConfigState((prev) => {
      if (prev?.key === key) {
        // Toggle order for the same key
        return { key, order: prev.order === "asc" ? "desc" : "asc" };
      }
      // New key, start with asc
      return { key, order: "asc" };
    });
  }, []);

  /**
   * Set sort configuration programmatically
   */
  const setSortConfig = useCallback((config: SortConfig | null) => {
    setSortConfigState(config);
  }, []);

  /**
   * Clear sort configuration
   */
  const clearSort = useCallback(() => {
    setSortConfigState(null);
  }, []);

  /**
   * Reset to default sort configuration
   */
  const resetToDefault = useCallback(() => {
    setSortConfigState(defaultSort);
  }, [defaultSort]);

  return {
    sortedData,
    sortConfig,
    onSortChange,
    setSortConfig,
    clearSort,
    resetToDefault,
  };
}