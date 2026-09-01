'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { useGetLike, useToggleLike } from '../model';
import { likeReactionTheme } from './like-reaction-theme';
import { cn } from '@/shadcn-ui/lib/utils';

type LikeDislikeButtonsProps = {
  id: number;
  size?: number;
};

export const LikeDislikeButtons = ({ id, size = 16 }: LikeDislikeButtonsProps) => {
  const { toggleLike, isPending: isToggling } = useToggleLike();
  const { like, isLoading } = useGetLike(id);
  const likeCount = like?.likes ?? 0;
  const dislikeCount = like?.dislikes ?? 0;
  const userReaction = like?.userReaction;
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [dislikeAnimation, setDislikeAnimation] = useState(false);

  const handleLike = () => {
    toggleLike({ id, type: 'LIKE' });
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 400);
  };

  const handleDislike = () => {
    toggleLike({ id, type: 'DISLIKE' });
    setDislikeAnimation(true);
    setTimeout(() => setDislikeAnimation(false), 400);
  };

  const isDisabled = isLoading || isToggling;

  return (
    <>
      <button
        type='button'
        aria-label='좋아요'
        aria-pressed={userReaction === 'LIKE'}
        disabled={isDisabled}
        className={cn(
          likeReactionTheme.buttonBase,
          userReaction === 'LIKE' ? likeReactionTheme.likeActive : likeReactionTheme.likeIdle,
        )}
        onClick={handleLike}
      >
        {isToggling ? (
          <Loader2 size={size} className='animate-spin' />
        ) : (
          <ThumbsUp size={size} className={likeAnimation ? 'scale-110' : undefined} />
        )}
      </button>

      <span
        className={cn(
          likeReactionTheme.countLike,
          likeAnimation && 'font-semibold',
          isLoading && `animate-pulse ${likeReactionTheme.countPulse} ${likeReactionTheme.skeletonLike}`,
        )}
      >
        {isLoading ? null : likeCount}
      </span>

      <button
        type='button'
        aria-label='싫어요'
        aria-pressed={userReaction === 'DISLIKE'}
        disabled={isDisabled}
        className={cn(
          likeReactionTheme.buttonBase,
          userReaction === 'DISLIKE' ? likeReactionTheme.dislikeActive : likeReactionTheme.dislikeIdle,
        )}
        onClick={handleDislike}
      >
        {isToggling ? (
          <Loader2 size={size} className='animate-spin' />
        ) : (
          <ThumbsDown size={size} className={dislikeAnimation ? 'scale-110' : undefined} />
        )}
      </button>

      <span
        className={cn(
          likeReactionTheme.countDislike,
          dislikeAnimation && 'font-semibold',
          isLoading && `animate-pulse ${likeReactionTheme.countPulse} ${likeReactionTheme.skeletonDislike}`,
        )}
      >
        {isLoading ? null : dislikeCount}
      </span>
    </>
  );
};
