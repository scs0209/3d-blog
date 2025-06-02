import { useQuery } from '@tanstack/react-query';
import { TAG_QUERY_KEY } from '@/shared/queryKeys/tag';
import { getAllTag } from '../api/tag-api';
import type { TagResponse } from '@/entities/tag/model';

export const useTags = <T extends TagResponse>() => {
  const { data, isLoading, error } = useQuery<T>({
    queryKey: TAG_QUERY_KEY.all.queryKey,
    queryFn: () => getAllTag(),
  });

  return { data, isLoading, error };
};
