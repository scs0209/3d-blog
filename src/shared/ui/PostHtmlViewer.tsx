'use client';

import { useEffect, useRef } from 'react';
import { preprocessHTML } from '@/shared/utils';

type PostHtmlViewerProps = {
  content: string;
};

let mermaidInitialized = false;

const enhanceCodeBlocks = async (root: HTMLElement) => {
  const blocks = root.querySelectorAll('pre code.language-mermaid, pre code[class*="mermaid"]');
  if (blocks.length === 0) return;

  const mermaid = (await import('mermaid')).default;
  if (!mermaidInitialized) {
    mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    mermaidInitialized = true;
  }

  await Promise.all(
    Array.from(blocks).map(async (block, index) => {
      const source = block.textContent?.trim();
      if (!source) return;
      try {
        const id = `post-mermaid-${index}-${Date.now()}`;
        const { svg } = await mermaid.render(id, source);
        const pre = block.closest('pre');
        if (pre) {
          pre.outerHTML = `<div class="mermaid-diagram my-4 overflow-x-auto">${svg}</div>`;
        }
      } catch {
        // 원본 코드 블록 유지
      }
    }),
  );
};

/**
 * 읽기 전용 HTML 본문 렌더러.
 * Novel/TipTap 런타임 없이 서버에서 내려준 HTML을 바로 표시해 JS 비용을 줄인다.
 */
export default function PostHtmlViewer({ content }: PostHtmlViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const html = content ? preprocessHTML(content) : '';

  useEffect(() => {
    if (!containerRef.current) return;
    void enhanceCodeBlocks(containerRef.current);
  }, [html]);

  return (
    <div className='blog-prose'>
      <div
        ref={containerRef}
        className='ProseMirror'
        // 관리자 작성 HTML — XSS는 관리자 권한 콘텐츠로 제한됨
        dangerouslySetInnerHTML={{ __html: typeof html === 'string' ? html : '' }}
      />
    </div>
  );
}
