'use client';

import dynamic from 'next/dynamic';

const PostHtmlViewer = dynamic(() => import('@/shared/ui/PostHtmlViewer'), {
  ssr: false,
  loading: () => <div className='blog-prose min-h-[120px]' aria-busy='true' role='status' />,
});

type PostHtmlViewerClientProps = {
  content: string;
};

export const PostHtmlViewerClient = ({ content }: PostHtmlViewerClientProps) => {
  return <PostHtmlViewer content={content} />;
};
