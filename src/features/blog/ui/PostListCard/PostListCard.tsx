'use client';

import type { PostResponse } from '@/entities/post/model/post';
import { Tag } from '@/shared/ui';
import { formatDateToYMD } from '@/shared/utils';
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
  const href = `/blog/category/${categorySlug ?? post.category?.slug}/post/${post?.slug}`;

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
      className={`block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-opacity ${
        isPending ? 'pointer-events-none opacity-60' : ''
      }`}
    >
      <motion.div
        key={`${post.id}-list`}
        whileHover={
          isPending
            ? undefined
            : {
                scale: 1.015,
                boxShadow: '0 0 16px #7dd3fc, 0 0 32px #7dd3fc55',
                backgroundColor: '#232946cc',
              }
        }
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className='rounded-lg px-4 py-3 transition cursor-pointer relative'
      >
        {isPending && (
          <span className='absolute right-4 top-4 text-cyan-300' aria-hidden>
            <LoaderCircle className='size-4 animate-spin' />
          </span>
        )}
        <div className='flex items-center justify-between'>
          <Tag color='neon' spacing='tight'>
            #{categoryName ?? post.category?.name}
          </Tag>
          <span className='flex items-center justify-center gap-1 text-blue-300 text-xs'>
            <Eye size={15} className='inline-block' />
            {post?.views ?? 0}
          </span>
        </div>
        <h2 className='text-lg font-extrabold text-blue-100 mt-1'>{post?.title}</h2>
        <div className='flex items-center justify-between mt-2 text-xs text-blue-200'>
          <span>{post?.author ? post?.author?.name : '관리자'}</span>
          <span>{formatDateToYMD(post?.updatedAt ?? '')}</span>
        </div>
        <hr className='my-6 border-blue-900/40' />
      </motion.div>
    </Link>
  );
};
