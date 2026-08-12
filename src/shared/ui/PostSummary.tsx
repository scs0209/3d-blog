'use client';

import { usePostSummary } from '@/features/post/model';
import { isValidSummary } from '@/features/post/utils';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import NovelViewer from './NovelViewer';

interface PostSummaryProps {
  post: {
    id: string;
    title: string;
    content: string | null;
  };
}

export function PostSummary({ post }: PostSummaryProps) {
  const { summary, isLoading, error } = usePostSummary({ content: post.content ?? '', title: post.title ?? '' });

  if (isLoading) {
    return (
      <div className={`relative mb-6 ${blogTheme.summaryBox}`}>
        <div className='mb-2 flex items-center gap-2'>
          <div className='h-4 w-4 animate-pulse rounded-full bg-[#ff9a3c]/60 dark:bg-[#3de8ff]/60' />
          <span className={`text-sm font-medium ${blogTheme.textAccent}`}>AI 요약 생성 중...</span>
        </div>
        <div className='space-y-2'>
          <div className='h-3 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
          <div className='h-3 w-3/4 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
        </div>
      </div>
    );
  }

  if (error || !isValidSummary(summary)) {
    return null;
  }

  return (
    <div className={`relative mb-6 ${blogTheme.summaryBox}`}>
      <div className='mb-3 flex items-center gap-2'>
        <div className='h-4 w-4 rounded-full bg-[#ff9a3c]/70 dark:bg-[#3de8ff]/70' />
        <span className={`text-sm font-medium ${blogTheme.textAccent}`}>🤖 AI 요약</span>
      </div>
      <NovelViewer content={summary} />
    </div>
  );
};
