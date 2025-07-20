'use client';

import { usePostSummary } from '@/features/post/model';
import { isValidSummary } from '@/features/post/utils';
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
      <div className='relative bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-400/30 rounded-lg p-4 mb-6'>
        <div className='flex items-center gap-2 mb-2'>
          <div className='w-4 h-4 bg-blue-400 rounded-full animate-pulse' />
          <span className='text-blue-200 text-sm font-medium'>AI 요약 생성 중...</span>
        </div>
        <div className='space-y-2'>
          <div className='h-3 bg-blue-800/30 rounded animate-pulse' />
          <div className='h-3 bg-blue-800/30 rounded w-3/4 animate-pulse' />
        </div>
      </div>
    );
  }

  if (error || !isValidSummary(summary)) {
    return null; // 에러나 유효하지 않은 요약은 표시하지 않음
  }

  return (
    <div className='relative bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-400/30 rounded-lg p-4 mb-6'>
      <div className='flex items-center gap-2 mb-3'>
        <div className='w-4 h-4 bg-blue-400 rounded-full' />
        <span className='text-blue-200 text-sm font-medium'>🤖 AI 요약</span>
      </div>
      <div className='text-blue-100'>
        <NovelViewer content={summary} />
      </div>
    </div>
  );
}
