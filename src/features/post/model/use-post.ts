import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getNextPageParamFromMeta } from '@/shared/lib/pagination';
import { POST_LIST_STALE_TIME } from '@/shared/lib/query-persist';
import { queryKeys } from '@/shared/queryKeys';
import { getPostList } from '../api/post-api';
import type { GetPostListParams, GetPostListResponse } from './post-types';

export const usePost = <T extends GetPostListResponse>(params: GetPostListParams) => {
  const { data, ...rest } = useInfiniteQuery<T>({
    queryKey: queryKeys.post.all(params).queryKey,
    queryFn: ({ pageParam = 1 }) => getPostList({ ...params, page: pageParam as number }),
    select: (data) => data,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getNextPageParamFromMeta(lastPage),
    getPreviousPageParam: (firstPage) => {
      const pagination = firstPage.meta?.pagination;
      if (pagination?.hasPrevPage && pagination.currentPage) {
        return pagination.currentPage - 1;
      }
      return undefined;
    },
    enabled: true, // 항상 활성화
    staleTime: POST_LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  return {
    posts: data,
    ...rest,
  };
};

export const usePostList = (params: GetPostListParams) => {
  const { data, ...rest } = useQuery<GetPostListResponse>({
    queryKey: queryKeys.post.all(params).queryKey,
    queryFn: () => getPostList(params),
    staleTime: POST_LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  return {
    posts: data?.data ?? [],
    meta: data?.meta,
    ...rest,
  };
};
