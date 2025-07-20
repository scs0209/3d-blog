import { useQuery } from '@tanstack/react-query';
import { getPostSummary } from '../api/post-api';
import type { GetPostSummaryRequest } from './post-types';
import { queryKeys } from '@/shared/queryKeys';

export const usePostSummary = (params: GetPostSummaryRequest) => {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.post.summary(params.content, params.title).queryKey,
    queryFn: () => getPostSummary(params),
    enabled: !!params.content && !!params.title,
  });

  return { summary: data?.summary, isLoading, error };
};
