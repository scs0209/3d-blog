import { useMutation } from '@tanstack/react-query';
import { createComment } from '../api';

export const useCreateComment = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: createComment,
  });

  return { createComment: mutate, ...rest };
};
