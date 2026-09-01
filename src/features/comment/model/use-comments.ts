import { useQuery } from '@tanstack/react-query';
import { getComments } from '../api';
import type { GetCommentsResponse } from '../api/comment-api';
import { queryKeys } from '@/shared/queryKeys';

const EMPTY_COMMENTS: GetCommentsResponse = [];

export const useComments = (postId: number) => {
  const { data, ...rest } = useQuery({
    queryKey: queryKeys.comment.byPost(postId).queryKey,
    queryFn: () => getComments({ postId }),
    enabled: postId > 0,
  });

  return {
    comments: data ?? EMPTY_COMMENTS,
    ...rest,
  };
};
