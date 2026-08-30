'use client';

import type { PostResponse } from '@/entities/post/model/post';
import { getPostPath } from '@/shared/consts/baseUrl';
import { formatDateToYMD } from '@/shared/utils';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { motion } from 'framer-motion';
import { Eye, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

type PostListCardProps = {
  post: PostResponse;
  categoryName?: string;
  categorySlug?: string;
};

export const PostListCard = ({ post, categoryName, categorySlug }: PostListCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const href = getPostPath(categorySlug ?? post.category?.slug, post.slug ?? '');
  const categoryLabel = categoryName ?? post.category?.name;

  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link
      href={href}
      prefetch
      onClick={handleNavigate}
      onMouseEnter={() => router.prefetch(href)}
      aria-busy={isPending}
      className={`block rounded-lg transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9a3c]/50 dark:focus-visible:ring-[#3de8ff]/50 ${
        isPending ? 'pointer-events-none opacity-60' : ''
      }`}
    >
      <motion.div
        key={`${post.id}-list`}
        whileHover={isPending ? undefined : { x: 4 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className={`relative cursor-pointer rounded-xl px-4 py-4 transition ${blogTheme.listRow}`}
      >
        <span className={blogTheme.listAccent} aria-hidden />
        {isPending && (
          <span className={`absolute right-4 top-4 ${blogTheme.textAccent}`} aria-hidden>
            <LoaderCircle className='size-4 animate-spin' />
          </span>
        )}
        <div className='flex items-center justify-between'>
          {categoryLabel && <span className={blogTheme.categoryPill}>#{categoryLabel}</span>}
          <span className={`ml-auto flex items-center justify-center gap-1 text-sm ${blogTheme.textMuted}`}>
            <Eye size={15} className='inline-block' />
            {post?.views ?? 0}
          </span>
        </div>
        <h2
          className={`mt-2.5 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-[#ffd4b0] dark:group-hover:text-[#b8e4ff] ${blogTheme.textPrimary}`}
          style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        >
          {post?.title}
        </h2>
        <div className={`mt-2.5 flex items-center justify-between text-sm ${blogTheme.textMuted}`}>
          <span>{post?.author ? post?.author?.name : '관리자'}</span>
          <span>{formatDateToYMD(post?.updatedAt ?? '')}</span>
        </div>
        <hr className={`my-5 ${blogTheme.divider}`} />
      </motion.div>
    </Link>
  );
};
