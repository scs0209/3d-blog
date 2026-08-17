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
        background: '#1c0e38',
        primaryColor: '#2a1a4a',
        primaryTextColor: '#ffe8d0',
        primaryBorderColor: '#ff9a3c',
        secondaryColor: '#1c0e38',
        tertiaryColor: '#3d2860',
        lineColor: '#ff9a3c',
        textColor: '#ffe8d0',
        mainBkg: '#1c0e38',
        nodeBorder: '#ff9a3c',
        clusterBkg: '#2a1a4a',
        clusterBorder: '#ff9a3c',
        titleColor: '#ffc8a0',
        edgeLabelBackground: '#1c0e38',
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

  const [mermaid, { sanitizeSvgHtml }] = await Promise.all([
    initMermaid(),
    import('@/shared/utils/sanitize-html'),
  ]);

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
          pre.outerHTML = `<div class="mermaid-diagram my-4 overflow-x-auto rounded-lg border border-[#ff9a3c]/30 bg-[#1c0e38] p-4 dark:border-[#3de8ff]/30 dark:bg-[#070414]">${safeSvg}</div>`;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Mermaid render failed:', error);
        }
      }
    }),
  );
};
