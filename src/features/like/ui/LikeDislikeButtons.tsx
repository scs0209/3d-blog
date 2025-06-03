'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

type LikeDislikeButtonsProps = {
  initialLikes: number;
  initialDislikes: number;
  size?: number;
};

export const LikeDislikeButtons = ({ initialLikes, initialDislikes, size = 16 }: LikeDislikeButtonsProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [dislikeAnimation, setDislikeAnimation] = useState(false);

  const handleLike = () => {
    setLikes((prev) => prev + 1);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 600);
  };

  const handleDislike = () => {
    setDislikes((prev) => prev + 1);
    setDislikeAnimation(true);
    setTimeout(() => setDislikeAnimation(false), 600);
  };

  return (
    <>
      <button
        type='button'
        aria-label='좋아요'
        className='text-blue-300 hover:text-blue-400 transition-all duration-300 p-1 rounded-full hover:bg-blue-900/30 transform hover:scale-125 hover:rotate-12 active:scale-150 active:rotate-45'
        onClick={handleLike}
      >
        <ThumbsUp size={size} className='transform transition-transform duration-200' />
      </button>
      <span
        className={`text-blue-300 text-xs transition-all duration-300 transform ${
          likeAnimation ? 'scale-150 text-blue-400 font-bold' : 'scale-100'
        }`}
      >
        {likes}
      </span>
      <button
        type='button'
        aria-label='싫어요'
        className='text-fuchsia-300 hover:text-fuchsia-400 transition-all duration-300 p-1 rounded-full hover:bg-fuchsia-900/30 transform hover:scale-125 hover:rotate-12 active:scale-150 active:rotate-45'
        onClick={handleDislike}
      >
        <ThumbsDown size={size} className='transform transition-transform duration-200' />
      </button>
      <span
        className={`text-fuchsia-300 text-xs transition-all duration-300 transform ${
          dislikeAnimation ? 'scale-150 text-fuchsia-400 font-bold' : 'scale-100'
        }`}
      >
        {dislikes}
      </span>
    </>
  );
};
