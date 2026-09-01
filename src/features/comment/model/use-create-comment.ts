import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/queryKeys';
import { createComment } from '../api';

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: createComment,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.comment.byPost(variables.postId).queryKey,
      });
    },
  });

  return { createComment: mutate, ...rest };
};
