import { useMutation } from '@tanstack/react-query';
import { updateComment, type UpdateCommentParams, type UpdateCommentRequest } from '../api/comment-api';

export const useUpdateComment = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: ({ params, body }: { params: UpdateCommentParams; body: UpdateCommentRequest }) =>
      updateComment(params, body),
  });

  return {
    updateComment: mutate,
    ...rest,
  };
};
