'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { useGetLike, useToggleLike } from '../model';

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
    setTimeout(() => setLikeAnimation(false), 600);
  };

  const handleDislike = () => {
    toggleLike({ id, type: 'DISLIKE' });
    setDislikeAnimation(true);
    setTimeout(() => setDislikeAnimation(false), 600);
  };

  const isDisabled = isLoading || isToggling;

  return (
    <>
      {/* 좋아요 버튼 */}
      <button
        type='button'
        aria-label='좋아요'
        disabled={isDisabled}
        className={`
          text-blue-300 hover:text-blue-400 transition-all duration-300 p-1 rounded-full 
          hover:bg-blue-900/30 transform hover:scale-125 hover:rotate-12 
          active:scale-150 active:rotate-45 disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:scale-100 disabled:hover:rotate-0
          ${userReaction === 'LIKE' ? 'text-blue-400 bg-blue-900/20' : ''}
        `}
        onClick={handleLike}
      >
        {isToggling ? (
          <Loader2 size={size} className='animate-spin' />
        ) : (
          <ThumbsUp size={size} className='transform transition-transform duration-200' />
        )}
      </button>

      {/* 좋아요 수 */}
      <span
        className={`
          text-blue-300 text-xs transition-all duration-300 transform
          ${likeAnimation ? 'scale-150 text-blue-400 font-bold' : 'scale-100'}
          ${isLoading ? 'animate-pulse bg-blue-400/20 rounded px-1' : ''}
        `}
      >
        {isLoading ? <span className='inline-block w-4 h-3 bg-blue-400/30 rounded' /> : likeCount}
      </span>

      {/* 싫어요 버튼 */}
      <button
        type='button'
        aria-label='싫어요'
        disabled={isDisabled}
        className={`
          text-fuchsia-300 hover:text-fuchsia-400 transition-all duration-300 p-1 rounded-full 
          hover:bg-fuchsia-900/30 transform hover:scale-125 hover:rotate-12 
          active:scale-150 active:rotate-45 disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:scale-100 disabled:hover:rotate-0
          ${userReaction === 'DISLIKE' ? 'text-fuchsia-400 bg-fuchsia-900/20' : ''}
        `}
        onClick={handleDislike}
      >
        {isToggling ? (
          <Loader2 size={size} className='animate-spin' />
        ) : (
          <ThumbsDown size={size} className='transform transition-transform duration-200' />
        )}
      </button>

      {/* 싫어요 수 */}
      <span
        className={`
          text-fuchsia-300 text-xs transition-all duration-300 transform
          ${dislikeAnimation ? 'scale-150 text-fuchsia-400 font-bold' : 'scale-100'}
          ${isLoading ? 'animate-pulse bg-fuchsia-400/20 rounded px-1' : ''}
        `}
      >
        {isLoading ? <span className='inline-block w-4 h-3 bg-fuchsia-400/30 rounded' /> : dislikeCount}
      </span>
    </>
  );
};
