import { useQuery } from '@tanstack/react-query';
import { CATALOG_STALE_TIME } from '@/shared/lib/query-persist';
import { SIDEBAR_QUERY_KEY } from '@/shared/queryKeys/sidebar';
import { getSidebarData } from '../api/sidebar-api';

export const useSidebarData = () => {
  return useQuery({
    queryKey: SIDEBAR_QUERY_KEY,
    queryFn: getSidebarData,
    staleTime: CATALOG_STALE_TIME,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
};
