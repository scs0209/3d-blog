import { useQuery } from '@tanstack/react-query';
import type { TagResponse } from '@/entities/tag/model';
import { CATALOG_STALE_TIME } from '@/shared/lib/query-persist';
import { TAG_QUERY_KEY } from '@/shared/queryKeys/tag';
import { getAllTag } from '../api/tag-api';

export const useTags = <T extends TagResponse>() => {
  const { data, isLoading, error } = useQuery<T>({
    queryKey: TAG_QUERY_KEY.all.queryKey,
    queryFn: () => getAllTag(),
    staleTime: CATALOG_STALE_TIME,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  return { data, isLoading, error };
};
