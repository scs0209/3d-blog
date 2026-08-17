import { useQuery } from '@tanstack/react-query';
import { getSidebarData } from '../api/sidebar-api';

const SIDEBAR_QUERY_KEY = ['sidebar'] as const;

export const useSidebarData = () => {
  return useQuery({
    queryKey: SIDEBAR_QUERY_KEY,
    queryFn: getSidebarData,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
};
