'use client';

import { motion, useMotionValue, animate, AnimationPlaybackControlsWithThen } from 'framer-motion';
import { CardPattern } from './CardPattern';
import { useEffect, useRef, useState } from 'react';
import type { PostResponse } from '@/entities/post/model/post';
import { formatDateToYMD } from '@/shared/utils';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const generateRandomString = (length: number) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const PostCard = ({ post }: { post: PostResponse }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [_, setRandomString] = useState('');
  const animationRef = useRef<{ x: AnimationPlaybackControlsWithThen; y: AnimationPlaybackControlsWithThen } | null>(null);

  useEffect(() => {
    const str = generateRandomString(1500);
    setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    const targetX = clientX - left;
    const targetY = clientY - top;
    if (animationRef.current) {
      animationRef.current.x.stop();
      animationRef.current.y.stop();
    }
    animationRef.current = {
      x: animate(mouseX, targetX, { type: 'spring', stiffness: 200, damping: 30 }),
      y: animate(mouseY, targetY, { type: 'spring', stiffness: 200, damping: 30 }),
    };
    const str = generateRandomString(1500);
    setRandomString(str);
  }

  return (
    <motion.div
      key={`${post.id}-card`}
      whileHover={{ scale: 1.04, boxShadow: '0 0 16px #7dd3fc, 0 0 32px #7dd3fc55' }}
      className='relative aspect-square bg-transparent rounded-xl border border-blue-300 shadow-[0_0_12px_#7dd3fc55] p-4 overflow-hidden transition'
    >
      <div
        key={`${post.id}-card`}
        onMouseMove={onMouseMove}
        className='group/card rounded-3xl w-full relative flex flex-col items-center justify-between overflow-hidden bg-transparent h-full'
      >
        <CardPattern mouseX={mouseX} mouseY={mouseY} />
        {/* {post.thumbnail && (
          <img src={post.thumbnail} alt={post.title} className='w-full h-1/2 object-cover rounded-md mb-2' />
        )} */}
        <span className='text-xs font-bold text-blue-200 mb-1'>{post.category?.name}</span>
        <h2 className='text-base font-extrabold text-blue-100 text-center line-clamp-2 mb-1'>{post.title}</h2>
        <span className='text-xs text-blue-300 mt-auto'>{formatDateToYMD(post.createdAt ?? '')}</span>
      </div>
    </motion.div>
  );
};
