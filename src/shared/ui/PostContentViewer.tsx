'use client';

import dynamic from 'next/dynamic';
import { blogProseScope } from '@/widgets/post/ui/blog-prose-scope';

const NovelViewer = dynamic(() => import('@/shared/ui/NovelViewer'), {
  ssr: false,
  loading: () => <div className={`${blogProseScope} min-h-[120px]`} aria-busy='true' role='status' />,
});

type PostContentViewerProps = {
  content: string;
};

/** NovelViewer + 에디터와 동일한 CodeBlock NodeView(언어 셀렉트·머메이드 미리보기) */
export const PostContentViewer = ({ content }: PostContentViewerProps) => {
  return <NovelViewer content={content} />;
};
