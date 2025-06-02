import { useQuery } from '@tanstack/react-query';
import { getPostList } from '../api/post-api';
import { queryKeys } from '@/shared/queryKeys';
import type { GetPostListResponse } from './post-types';

export const usePost = <T extends GetPostListResponse>() => {
  const { data, ...rest } = useQuery<T>({
    queryKey: queryKeys.post.all.queryKey,
    queryFn: () => getPostList(),
    select: (data) => data,
  });

  return {
    posts: data,
    ...rest,
  };
};
