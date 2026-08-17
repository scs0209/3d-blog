'use client';

import { useEffect, useRef, useState } from 'react';
import { preprocessHTML } from '@/shared/utils/process-html';

type PostHtmlViewerProps = {
  content: string;
};

let mermaidInitialized = false;

const enhanceCodeBlocks = async (root: HTMLElement) => {
  const blocks = root.querySelectorAll('pre code.language-mermaid, pre code[class*="mermaid"]');
  if (blocks.length === 0) return;

  const [{ default: mermaid }, { sanitizeSvgHtml }] = await Promise.all([
    import('mermaid'),
    import('@/shared/utils/sanitize-html'),
  ]);

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
          const safeSvg = sanitizeSvgHtml(svg);
          pre.outerHTML = `<div class="mermaid-diagram my-4 overflow-x-auto">${safeSvg}</div>`;
        }
      } catch {
        // 원본 코드 블록 유지
      }
    }),
  );
};

/**
 * 읽기 전용 HTML 본문 렌더러.
 * DOMPurify(jsdom)는 Vercel serverless SSR에서 실패하므로 클라이언트에서만 sanitize한다.
 */
export default function PostHtmlViewer({ content }: PostHtmlViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preprocessed = content ? preprocessHTML(content) : '';
  const [html, setHtml] = useState(preprocessed);

  useEffect(() => {
    if (!content) {
      setHtml('');
      return;
    }

    let cancelled = false;

    void import('@/shared/utils/sanitize-html').then(async ({ sanitizePostHtml }) => {
      if (cancelled) return;
      const sanitized = sanitizePostHtml(preprocessHTML(content));
      setHtml(sanitized);
      requestAnimationFrame(() => {
        if (!cancelled && containerRef.current) {
          void enhanceCodeBlocks(containerRef.current);
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [content]);

  return (
    <div className='blog-prose'>
      <div ref={containerRef} className='ProseMirror' dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
