import { queryKeys } from '@/shared/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { getPostSummary } from '../api/post-api';
import type { GetPostSummaryRequest } from './post-types';

type UsePostSummaryParams = GetPostSummaryRequest & {
  postId: string | number;
};

export const usePostSummary = ({ postId, ...params }: UsePostSummaryParams) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: queryKeys.post.summary(String(postId)).queryKey,
    queryFn: () => getPostSummary(params),
    enabled: Boolean(postId && params.content && params.title),
    retry: 1,
    staleTime: 1000 * 60 * 30,
  });

  return { summary: data?.summary, isLoading, isFetching, error, refetch };
};
