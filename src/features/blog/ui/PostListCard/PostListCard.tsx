'use client';

import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { PostResponse } from '@/entities/post/model/post';
import { getPostPath } from '@/shared/consts/baseUrl';
import { formatDateToYMD } from '@/shared/utils';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

type PostListCardProps = {
  post: PostResponse;
  categoryName?: string;
  categorySlug?: string;
};

/** 글 목록의 한 줄: 작성일 · 제목 · 분류와 조회수. 줄 사이는 선 없이 여백으로 나눈다 */
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
      className={`group -mx-3 grid grid-cols-1 gap-x-6 gap-y-1.5 rounded-lg px-3 py-4 transition-[opacity,background-color] hover:bg-white/[0.045] sm:grid-cols-[6.5rem_1fr_auto] sm:items-baseline ${blogTheme.focus} ${
        isPending ? 'pointer-events-none opacity-60' : ''
      }`}
    >
      <time className='text-[13px] tabular-nums text-[#8d98a3]'>
        {formatDateToYMD(post?.createdAt ?? post?.updatedAt ?? '')}
      </time>
      <h2 className='break-keep font-[family-name:var(--font-syne),sans-serif] text-[19px] font-semibold leading-snug text-[#e9edf1] transition-colors group-hover:text-[#4de3ff]'>
        {post?.title}
      </h2>
      <div className='flex items-center gap-4 text-[13px] text-[#8d98a3]'>
        {categoryLabel ? <span className='text-[#4de3ff]'>{categoryLabel}</span> : null}
        <span>조회 {post?.views ?? 0}</span>
        {isPending ? <LoaderCircle className='size-3.5 animate-spin text-[#4de3ff]' aria-hidden /> : null}
      </div>
    </Link>
  );
};
