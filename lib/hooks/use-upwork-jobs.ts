import { useState, useEffect, useCallback } from 'react';
import { UpworkJob, UpworkResponse } from '@/lib/upwork-service';

interface UseUpworkJobsOptions {
  category?: string;
  keyword?: string;
  limit?: number;
  autoFetch?: boolean;
}

interface UseUpworkJobsReturn {
  jobs: UpworkJob[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchJobs: (keyword: string) => Promise<void>;
  fetchByCategory: (category: string) => Promise<void>;
  totalJobs: number;
  categories: Record<string, any> | null;
}

export function useUpworkJobs(options: UseUpworkJobsOptions = {}): UseUpworkJobsReturn {
  const {
    category = 'all',
    keyword,
    limit = 50,
    autoFetch = true
  } = options;

  const [jobs, setJobs] = useState<UpworkJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [categories, setCategories] = useState<Record<string, any> | null>(null);

  const fetchJobs = useCallback(async (cat?: string, kw?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Import the service functions dynamically to avoid SSR issues
      const { fetchUpworkJobs, getJobsByCategory, searchJobs } = await import('@/lib/upwork-service');
      
      let data: UpworkResponse;
      
      if (kw) {
        // Search by keyword
        data = await searchJobs(kw, limit);
      } else if (cat && cat !== 'all') {
        // Fetch specific category
        data = await getJobsByCategory(cat);
      } else {
        // Fetch all categories
        data = await fetchUpworkJobs('all', limit);
      }
      
      if (data.success) {
        setJobs(data.jobs);
        setTotalJobs(data.totalJobs || 0);
        if (data.categories) {
          setCategories(data.categories);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch jobs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching Upwork jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refetch = useCallback(() => {
    return fetchJobs(category, keyword);
  }, [fetchJobs, category, keyword]);

  const searchJobs = useCallback((searchKeyword: string) => {
    return fetchJobs('all', searchKeyword);
  }, [fetchJobs]);

  const fetchByCategory = useCallback((cat: string) => {
    return fetchJobs(cat);
  }, [fetchJobs]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [refetch, autoFetch]);

  return {
    jobs,
    loading,
    error,
    refetch,
    searchJobs,
    fetchByCategory,
    totalJobs,
    categories
  };
}
