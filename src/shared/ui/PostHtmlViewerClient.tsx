'use client';

import PostHtmlViewer from '@/shared/ui/PostHtmlViewer';

type PostHtmlViewerClientProps = {
  content: string;
};

/** @deprecated PostContentViewer를 사용하세요. SSR 본문 포함을 위해 dynamic(ssr:false)를 제거함. */
export const PostHtmlViewerClient = ({ content }: PostHtmlViewerClientProps) => {
  return <PostHtmlViewer content={content} />;
};
