import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/queryKeys';
import { updateComment, type UpdateCommentParams, type UpdateCommentRequest } from '../api/comment-api';

type UpdateCommentVariables = {
  params: UpdateCommentParams;
  body: UpdateCommentRequest;
  postId: number;
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: ({ params, body }: UpdateCommentVariables) => updateComment(params, body),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.comment.byPost(variables.postId).queryKey,
      });
    },
  });

  return {
    updateComment: mutate,
    ...rest,
  };
};
