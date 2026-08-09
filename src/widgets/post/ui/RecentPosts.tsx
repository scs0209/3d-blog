import { useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PostCardSkeleton } from '@/shared/ui/skeleton';
import { PostCard } from '@/features/blog/ui';
import type { PostResponse } from '@/entities/post/model/post';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

type RecentPostsProps = {
  posts: PostResponse[];
  isLoading: boolean;
};

export const RecentPosts = ({ posts, isLoading }: RecentPostsProps) => {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const recentPosts = posts.slice(0, 6);

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10'>
        {['a', 'b', 'c', 'd', 'e', 'f'].map((id) => (
          <PostCardSkeleton key={`skeleton-card-${id}`} />
        ))}
      </div>
    );
  }

  if (!recentPosts.length) {
    return null;
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10'>
      {recentPosts.map((post, idx) => {
        const href = `/blog/category/${post.category?.slug}/post/${post.slug}`;
        const isCardPending = isPending && pendingHref === href;

        const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
            return;
          }

          event.preventDefault();
          setPendingHref(href);
          startTransition(() => {
            router.push(href);
          });
        };

        return (
          <Link
            href={href}
            key={post.id ?? post.createdAt}
            prefetch
            onClick={handleNavigate}
            onMouseEnter={() => {
              setHoveredIndex(idx);
              router.prefetch(href);
            }}
            onMouseLeave={() => setHoveredIndex(null)}
            aria-busy={isCardPending}
            className={`relative group block p-2 h-full w-full transition-opacity ${
              isCardPending ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {isCardPending && (
              <span className='absolute right-3 top-3 z-20 text-cyan-300' aria-hidden>
                <LoaderCircle className='size-4 animate-spin' />
              </span>
            )}
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className='absolute inset-0 h-full w-full bg-slate-600/60 dark:bg-[#232946]/95 backdrop-blur-md block rounded-3xl pointer-events-none'
                  layoutId='hoverBackground'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                  style={{ willChange: 'opacity, background' }}
                />
              )}
              <PostCard post={post} />
            </AnimatePresence>
          </Link>
        );
      })}
    </div>
  );
};
