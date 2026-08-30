'use client';

import { type AnimationPlaybackControlsWithThen, animate, motion, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { PostResponse } from '@/entities/post/model/post';
import { formatDateToYMD } from '@/shared/utils';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { CardPattern } from './CardPattern';

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
  const cardRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<{ x: AnimationPlaybackControlsWithThen; y: AnimationPlaybackControlsWithThen } | null>(
    null,
  );

  useEffect(() => {
    const str = generateRandomString(1500);
    setRandomString(str);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const { left, top } = card.getBoundingClientRect();
      const targetX = event.clientX - left;
      const targetY = event.clientY - top;
      if (animationRef.current) {
        animationRef.current.x.stop();
        animationRef.current.y.stop();
      }
      animationRef.current = {
        x: animate(mouseX, targetX, { type: 'spring', stiffness: 200, damping: 30 }),
        y: animate(mouseY, targetY, { type: 'spring', stiffness: 200, damping: 30 }),
      };
      setRandomString(generateRandomString(1500));
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`relative aspect-square overflow-hidden rounded-xl p-4 transition ${blogTheme.card} ${blogTheme.cardHover}`}
    >
      <span className={blogTheme.cardTopGlow} aria-hidden />
      <div
        ref={cardRef}
        className='group/card relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-xl bg-transparent'
      >
        <CardPattern mouseX={mouseX} mouseY={mouseY} seed={post.id ?? post.slug ?? post.title} />
        {post.category?.name && <span className={blogTheme.categoryPill}>{post.category.name}</span>}
        <h2
          className={`mb-1 line-clamp-2 text-center text-[15px] font-semibold leading-snug transition-colors group-hover/card:text-[#ffd4b0] dark:group-hover/card:text-[#b8e4ff] ${blogTheme.textPrimary}`}
          style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        >
          {post.title}
        </h2>
        <span className={`mt-auto text-xs ${blogTheme.textMuted}`}>{formatDateToYMD(post.createdAt ?? '')}</span>
      </div>
    </motion.div>
  );
};
