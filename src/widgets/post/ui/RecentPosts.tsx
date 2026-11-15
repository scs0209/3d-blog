import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { PostResponse } from '@/entities/post/model/post';
import { PostCard } from '@/features/blog/ui';
import { getPostPath } from '@/shared/consts/baseUrl';
import { PostCardSkeleton } from '@/shared/ui/skeleton';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

type RecentPostsProps = {
  posts: PostResponse[];
  isLoading: boolean;
};

const GRID = 'mb-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';

export const RecentPosts = ({ posts, isLoading }: RecentPostsProps) => {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const recentPosts = posts.slice(0, 6);

  if (isLoading) {
    return (
      <div className={GRID}>
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
    <div className={GRID}>
      {recentPosts.map((post, idx) => {
        const postKey = post.id ?? post.slug ?? `recent-${idx}`;
        const href = getPostPath(post.category?.slug, post.slug ?? '');
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
            key={postKey}
            prefetch
            onClick={handleNavigate}
            onMouseEnter={() => router.prefetch(href)}
            aria-busy={isCardPending}
            className={`group/card relative block h-full outline-none transition-opacity ${
              isCardPending ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {isCardPending ? (
              <span className={`absolute right-3 bottom-3 z-10 ${blogTheme.textAccent}`} aria-hidden>
                <LoaderCircle className='size-4 animate-spin' />
              </span>
            ) : null}
            <PostCard post={post} index={idx} />
          </Link>
        );
      })}
    </div>
  );
};
