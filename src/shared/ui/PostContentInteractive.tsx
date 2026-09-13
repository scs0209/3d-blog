'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { blogProseScope } from '@/widgets/post/ui/blog-prose-scope';

const NovelViewer = dynamic(() => import('@/shared/ui/NovelViewer'), {
  ssr: false,
});

type PostContentInteractiveProps = {
  content: string;
  ssrHtml: string;
};

/**
 * 화면: 기존 NovelViewer(코드블록·표·Mermaid NodeView)
 * 크롤: SSR HTML을 초기 응답에 포함 (JS 없는 봇용). Novel 준비 후 시각적으로만 교체.
 */
export const PostContentInteractive = ({ content, ssrHtml }: PostContentInteractiveProps) => {
  const [isNovelReady, setIsNovelReady] = useState(false);

  const handleNovelReady = () => {
    setIsNovelReady(true);
  };

  return (
    <div className='relative min-h-[120px]'>
      <div
        className={`${blogProseScope}${isNovelReady ? ' invisible absolute inset-0 -z-10 h-0 overflow-hidden' : ''}`}
        data-post-body-ssr
        dangerouslySetInnerHTML={{ __html: `<div class="ProseMirror">${ssrHtml}</div>` }}
        aria-hidden={isNovelReady}
      />
      {/* display:none 이면 Mermaid 측정이 깨질 수 있어, 준비 전엔 투명 오버레이로 마운트 */}
      <div
        className={isNovelReady ? undefined : 'pointer-events-none absolute inset-x-0 top-0 opacity-0'}
        aria-hidden={!isNovelReady}
      >
        <NovelViewer content={content} onReady={handleNovelReady} />
      </div>
    </div>
  );
};
