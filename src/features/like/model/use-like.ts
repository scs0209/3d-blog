import { useMutation, useQuery } from '@tanstack/react-query';
import { getLike, toggleLike } from '../api';
import { useSession } from 'next-auth/react';
import { queryKeys } from '@/shared/queryKeys';
import type { LikeResponse } from '@/entities/like/model/like';
import { useQueryClient } from '@tanstack/react-query';

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, type }: { id: number; type: 'LIKE' | 'DISLIKE' }) =>
      toggleLike(id, Number(session?.user?.id), type),

    onMutate: async ({ id, type }) => {
      // 진행 중인 쿼리들을 취소하여 옵티미스틱 업데이트가 덮어써지지 않도록 함
      await queryClient.cancelQueries({ queryKey: queryKeys.like.list(id).queryKey });

      // 이전 데이터 백업
      const previousData = queryClient.getQueryData<LikeResponse>(queryKeys.like.list(id).queryKey);

      // 옵티미스틱 업데이트
      if (previousData) {
        const currentReaction = previousData.userReaction;
        let newLikes = previousData.likes ?? 0;
        let newDislikes = previousData.dislikes ?? 0;
        let newUserReaction: 'LIKE' | 'DISLIKE' | null = type;

        // 현재 반응에 따른 로직
        if (currentReaction === type) {
          // 같은 반응이면 취소
          newUserReaction = null;
          if (type === 'LIKE') {
            newLikes = Math.max(0, newLikes - 1);
          } else {
            newDislikes = Math.max(0, newDislikes - 1);
          }
        } else if (currentReaction === null) {
          // 반응이 없었다면 추가
          if (type === 'LIKE') {
            newLikes += 1;
          } else {
            newDislikes += 1;
          }
        } else {
          // 다른 반응에서 변경
          if (currentReaction === 'LIKE') {
            newLikes = Math.max(0, newLikes - 1);
            newDislikes += 1;
          } else {
            newDislikes = Math.max(0, newDislikes - 1);
            newLikes += 1;
          }
        }

        // 캐시 업데이트
        queryClient.setQueryData(queryKeys.like.list(id).queryKey, {
          ...previousData,
          likes: newLikes,
          dislikes: newDislikes,
          userReaction: newUserReaction,
        });
      }

      // 롤백을 위한 이전 데이터 반환
      return { previousData };
    },

    onError: (err, { id }, context) => {
      // 에러 발생시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.like.list(id).queryKey, context.previousData);
      }
    },

    onSettled: (data, error, { id }) => {
      // 성공/실패 상관없이 최신 데이터로 다시 fetch
      queryClient.invalidateQueries({ queryKey: queryKeys.like.list(id).queryKey });
    },
  });

  return { toggleLike: mutate, isPending };
};

export const useGetLike = <T extends LikeResponse>(id: number) => {
  const { data, ...rest } = useQuery<T>({
    queryKey: queryKeys.like.list(id).queryKey,
    queryFn: () => getLike(id),
  });

  return { like: data, ...rest };
};
