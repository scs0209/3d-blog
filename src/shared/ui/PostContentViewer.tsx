'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { enhanceMermaidDiagrams } from '@/shared/lib/mermaid-render';

const NovelViewer = dynamic(() => import('@/shared/ui/NovelViewer'), {
  ssr: false,
  loading: () => <div className='blog-prose min-h-[120px]' aria-busy='true' role='status' />,
});

type PostContentViewerProps = {
  content: string;
};

export const PostContentViewer = ({ content }: PostContentViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!content || !containerRef.current) return;

    let cancelled = false;

    const renderMermaid = () => {
      if (cancelled || !containerRef.current) return false;
      const proseRoot = containerRef.current.querySelector('.ProseMirror');
      if (!proseRoot) return false;
      void enhanceMermaidDiagrams(proseRoot as HTMLElement);
      return true;
    };

    if (renderMermaid()) return;

    const observer = new MutationObserver(() => {
      if (renderMermaid()) observer.disconnect();
    });

    observer.observe(containerRef.current, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [content]);

  return (
    <div ref={containerRef}>
      <NovelViewer content={content} />
    </div>
  );
};
