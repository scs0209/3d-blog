import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/queryKeys';
import { deleteComment } from '../api';

type DeleteCommentVariables = {
  commentId: number;
  postId: number;
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: ({ commentId }: DeleteCommentVariables) => deleteComment({ commentId }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.comment.byPost(variables.postId).queryKey,
      });
    },
  });

  return { deleteComment: mutate, ...rest };
};
