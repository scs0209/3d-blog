import { useQuery } from '@tanstack/react-query';
import { TAG_QUERY_KEY } from '@/shared/queryKeys/tag';
import { getAllTag } from '../api/tag-api';
import type { TagResponse } from '@/entities/tag/model';

export const useTags = <T extends TagResponse>() => {
  const { data, isLoading, error } = useQuery<T>({
    queryKey: TAG_QUERY_KEY.all.queryKey,
    queryFn: () => getAllTag(),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  return { data, isLoading, error };
};
