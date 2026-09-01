'use client';

import dynamic from 'next/dynamic';
import { blogProseScope } from '@/widgets/post/ui/blog-prose-scope';

const PostHtmlViewer = dynamic(() => import('@/shared/ui/PostHtmlViewer'), {
  ssr: false,
  loading: () => <div className={`${blogProseScope} min-h-[120px]`} aria-busy='true' role='status' />,
});

type PostHtmlViewerClientProps = {
  content: string;
};

export const PostHtmlViewerClient = ({ content }: PostHtmlViewerClientProps) => {
  return <PostHtmlViewer content={content} />;
};
