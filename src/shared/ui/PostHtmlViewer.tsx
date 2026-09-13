'use client';

import { useEffect, useRef, useState } from 'react';
import { getCodeBlockText, preprocessHTML } from '@/shared/utils/process-html';
import { blogProseScope } from '@/widgets/post/ui/blog-prose-scope';

type PostHtmlViewerProps = {
  content: string;
};

let mermaidInitialized = false;

const MERMAID_CODE_SELECTOR = 'pre code.language-mermaid, pre code[class*="language-mermaid"]';

const enhanceCodeBlocks = async (root: HTMLElement) => {
  const blocks = root.querySelectorAll(MERMAID_CODE_SELECTOR);
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
      const source = getCodeBlockText(block);
      if (!source) return;
      try {
        const id = `post-mermaid-${index}-${Date.now()}`;
        const { svg } = await mermaid.render(id, source);
        const pre = block.closest('pre');
        if (pre) {
          const safeSvg = sanitizeSvgHtml(svg);
          pre.outerHTML = `<div class="mermaid-diagram my-4 overflow-x-auto">${safeSvg}</div>`;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Mermaid render failed:', error);
        }
      }
    }),
  );
};

/**
 * 읽기 전용 HTML 본문 렌더러.
 * 초기 HTML(preprocess)은 SSR되어 크롤러가 본문을 읽을 수 있다.
 * DOMPurify(jsdom)는 Vercel serverless SSR에서 실패할 수 있어 sanitize·mermaid는 클라이언트에서만 수행한다.
 */
export default function PostHtmlViewer({ content }: PostHtmlViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preprocessed = content ? preprocessHTML(content) : '';
  const [html, setHtml] = useState(preprocessed);
  const [isSanitized, setIsSanitized] = useState(false);

  useEffect(() => {
    if (!content) {
      setHtml('');
      setIsSanitized(false);
      return;
    }

    let cancelled = false;

    void import('@/shared/utils/sanitize-html').then(({ sanitizePostHtml }) => {
      if (cancelled) return;
      setHtml(sanitizePostHtml(preprocessHTML(content)));
      setIsSanitized(true);
    });

    return () => {
      cancelled = true;
    };
  }, [content]);

  useEffect(() => {
    if (!isSanitized || !html || !containerRef.current) return;

    void enhanceCodeBlocks(containerRef.current);
  }, [html, isSanitized]);

  return (
    <div className={blogProseScope}>
      <div ref={containerRef} className='ProseMirror' dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
