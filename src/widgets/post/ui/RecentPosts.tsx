import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PostCardSkeleton } from '@/shared/ui/skeleton';
import { PostCard } from '@/features/blog/ui';
import type { PostResponse } from '@/entities/post/model/post';

type RecentPostsProps = {
  posts: PostResponse[];
  isLoading: boolean;
};

export const RecentPosts = ({ posts, isLoading }: RecentPostsProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const recentPosts = posts.slice(0, 6);

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10'>
        {Array.from({ length: 6 }).map((_) => (
          <PostCardSkeleton key={`skeleton-card-${Math.random()}`} />
        ))}
      </div>
    );
  }

  if (!recentPosts.length) {
    return null;
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10'>
      {recentPosts.map((post, idx) => (
        <a
          href={`/blog/category/${post.category?.slug}/post/${post.slug}`}
          key={post.createdAt}
          className='relative group block p-2 h-full w-full'
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className='absolute inset-0 h-full w-full bg-slate-600/60 dark:bg-[#232946]/95 backdrop-blur-md block rounded-3xl pointer-events-none z-0'
                layoutId='hoverBackground'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                style={{ willChange: 'opacity, background' }}
              />
            )}
            <PostCard post={post} />
          </AnimatePresence>
        </a>
      ))}
    </div>
  );
};
