import { getCodeBlockText } from '@/shared/utils/process-html';

let mermaidInitialized = false;

const MERMAID_CODE_SELECTOR = 'pre code.language-mermaid, pre code[class*="language-mermaid"]';

const initMermaid = async () => {
  const { default: mermaid } = await import('mermaid');
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        background: '#0a0d11',
        primaryColor: '#2a1a4a',
        primaryTextColor: '#ffe8d0',
        primaryBorderColor: '#4de3ff',
        secondaryColor: '#0a0d11',
        tertiaryColor: '#3d2860',
        lineColor: '#4de3ff',
        textColor: '#ffe8d0',
        mainBkg: '#0a0d11',
        nodeBorder: '#4de3ff',
        clusterBkg: '#2a1a4a',
        clusterBorder: '#4de3ff',
        titleColor: '#e9edf1',
        edgeLabelBackground: '#0a0d11',
      },
    });
    mermaidInitialized = true;
  }
  return mermaid;
};

/** 블로그 본문 .ProseMirror 안의 mermaid 코드 블록을 SVG로 변환 */
export const enhanceMermaidDiagrams = async (root: HTMLElement) => {
  const blocks = root.querySelectorAll(MERMAID_CODE_SELECTOR);
  if (blocks.length === 0) return;

  const [mermaid, { sanitizeSvgHtml }] = await Promise.all([initMermaid(), import('@/shared/utils/sanitize-html')]);

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
          pre.outerHTML = `<div class="mermaid-diagram my-4 overflow-x-auto rounded-[3px] border border-[#4de3ff]/30 bg-[#0a0d11] p-4 dark:border-[#4de3ff]/30 dark:bg-[#07090c]">${safeSvg}</div>`;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Mermaid render failed:', error);
        }
      }
    }),
  );
};
