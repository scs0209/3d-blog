'use client';

import { usePostSummary } from '@/features/post/model';
import { formatSummaryText, isValidSummary } from '@/features/post/utils';
import { blogPostSurface } from '@/widgets/post/ui/blog-post-surface';
import { blogProseScope } from '@/widgets/post/ui/blog-prose-scope';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

interface PostSummaryProps {
  post: {
    id: string | number;
    title: string;
    content: string | null;
    updatedAt?: string | Date | null;
  };
}

export function PostSummary({ post }: PostSummaryProps) {
  const revisedAt = post.updatedAt instanceof Date ? post.updatedAt.toISOString() : (post.updatedAt ?? '');

  const { summary, isLoading, error, refetch, isFetching } = usePostSummary({
    postId: post.id,
    content: post.content ?? '',
    title: post.title ?? '',
    revisedAt,
  });

  if (isLoading) {
    return (
      <div className={`relative mb-6 ${blogPostSurface.summaryBox}`} aria-busy='true'>
        <div className='mb-2 flex items-center gap-2'>
          <span className='text-[13px] font-medium text-[#8d98a3]'>AI 요약 생성 중</span>
        </div>
        <div className='space-y-2'>
          <div className='h-3 animate-pulse rounded bg-white/[0.07]' />
          <div className='h-3 w-3/4 animate-pulse rounded bg-white/[0.07]' />
        </div>
      </div>
    );
  }

  if (error || !isValidSummary(summary)) {
    return (
      <div className={`relative mb-6 ${blogPostSurface.summaryBox}`}>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <span className={`text-sm ${blogTheme.textMuted}`}>AI 요약을 불러오지 못했습니다</span>
          </div>
          <button
            type='button'
            onClick={() => refetch()}
            disabled={isFetching}
            className={`px-2.5 py-1 text-xs disabled:opacity-50 ${blogTheme.navBtn}`}
            aria-label='AI 요약 다시 시도'
          >
            {isFetching ? '재시도 중...' : '다시 시도'}
          </button>
        </div>
      </div>
    );
  }

  const paragraphs = summary
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const seenParagraphs = new Map<string, number>();

  return (
    <div className={`relative mb-6 ${blogPostSurface.summaryBox}`}>
      <div className='mb-3 flex items-center gap-2'>
        <span className='text-[13px] font-medium text-[#8d98a3]'>AI 요약</span>
      </div>
      <div className={`${blogProseScope} space-y-2 text-[15px] leading-relaxed ${blogTheme.textPrimary}`}>
        {paragraphs.map((paragraph) => {
          const occurrence = seenParagraphs.get(paragraph) ?? 0;
          seenParagraphs.set(paragraph, occurrence + 1);
          const key = occurrence === 0 ? paragraph : `${paragraph}#${occurrence}`;

          return (
            <p
              key={key}
              className='m-0'
              // 서버에서 받은 plain text에 한해 `code`만 허용
              dangerouslySetInnerHTML={{ __html: formatSummaryText(paragraph) }}
            />
          );
        })}
      </div>
    </div>
  );
}
