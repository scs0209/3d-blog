import { queryKeys } from '@/shared/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { getPostSummary } from '../api/post-api';
import type { GetPostSummaryRequest } from './post-types';

type UsePostSummaryParams = GetPostSummaryRequest & {
  postId: string | number;
  /** 게시물 수정 시 캐시 무효화를 위한 버전 키 */
  revisedAt?: string | null;
};

export const usePostSummary = ({ postId, revisedAt, ...params }: UsePostSummaryParams) => {
  const versionKey = revisedAt ?? '';
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: queryKeys.post.summary(String(postId), versionKey).queryKey,
    queryFn: () => getPostSummary(params),
    enabled: Boolean(postId && params.content && params.title),
    retry: 1,
    staleTime: 1000 * 60 * 30,
  });

  return { summary: data?.summary, isLoading, isFetching, error, refetch };
};
