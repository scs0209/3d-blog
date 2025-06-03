import { useMutation } from '@tanstack/react-query';
import { deleteComment } from '../api';

export const useDeleteComment = () => {
  const { mutate, ...rest } = useMutation({ mutationFn: deleteComment });

  return { deleteComment: mutate, ...rest };
};
