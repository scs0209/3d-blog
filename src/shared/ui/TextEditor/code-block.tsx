import { useEffect, useRef } from 'react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { useSession } from 'next-auth/react';

let mermaidInitialized = false;

const ensureMermaid = async () => {
  const mermaid = (await import('mermaid')).default;
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#00ff88',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#00ff88',
        lineColor: '#00ff88',
        sectionBkgColor: '#1a1a1a',
        altSectionBkgColor: '#2a2a2a',
        gridColor: '#333333',
        secondaryColor: '#333333',
        tertiaryColor: '#444444',
      },
    });
    mermaidInitialized = true;
  }
  return mermaid;
};

export enum Mode {
  Preview = 0,
  Edit = 1,
}

export default function CodeBlock(props: any) {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === 'ADMIN';
  const { node, updateAttributes, extension } = props;
  const {
    attrs: { language: defaultLanguage, mode = Mode.Edit },
    textContent,
  } = node;
  const previewer = useRef<HTMLPreElement>(null);
  const isMermaid = defaultLanguage === 'mermaid';

  useEffect(() => {
    if (mode !== Mode.Preview || !previewer.current || !isMermaid || !textContent.trim()) {
      return;
    }

    let cancelled = false;

    const renderMermaid = async () => {
      try {
        const mermaid = await ensureMermaid();
        if (cancelled || !previewer.current) return;

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const textarea = document.createElement('textarea');
        textarea.innerHTML = textContent;
        const decodedTextContent = textarea.value;

        const { svg } = await mermaid.render(id, decodedTextContent);
        if (!cancelled && previewer.current) {
          previewer.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (!cancelled && previewer.current) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          previewer.current.innerHTML = `<div style="color: red; padding: 1rem;">Mermaid 구문 오류: ${message}</div>`;
        }
      }
    };

    void renderMermaid();

    return () => {
      cancelled = true;
    };
  }, [mode, textContent, isMermaid]);

  return (
    <NodeViewWrapper>
      <pre>
        {/* 상단 컨트롤 바 */}
        <div className='flex items-center justify-between bg-gray-800 px-3 py-2'>
          <div className='flex items-center gap-2'>
            {isMermaid && isAdmin && (
              <button
                type='button'
                contentEditable={false}
                onClick={() => {
                  updateAttributes({
                    language: defaultLanguage,
                    mode: mode === Mode.Edit ? Mode.Preview : Mode.Edit,
                  });
                }}
                className='text-xs font-medium px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-white'
              >
                {mode === Mode.Edit ? '미리보기' : '편집'}
              </button>
            )}
          </div>

          <select
            contentEditable={false}
            defaultValue={defaultLanguage}
            onChange={(event) =>
              updateAttributes({
                language: event.target.value,
                mode: mode,
              })
            }
            className='text-xs px-3 py-1.5 rounded-md bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-colors text-white'
          >
            <option value='null' className='bg-gray-800 text-white'>
              auto
            </option>
            <option value='mermaid' className='bg-gray-800 text-white'>
              mermaid
            </option>
            <option disabled className='bg-gray-800 text-white'>
              —
            </option>
            {extension.options.lowlight.listLanguages().map((lang: string) => (
              <option key={lang} value={lang} className='bg-gray-800 text-white'>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* 코드 블록 컨텐츠 */}
        <pre hidden={isMermaid && mode === Mode.Preview} className='text-sm text-gray-100 overflow-x-auto'>
          <NodeViewContent as='code' />
        </pre>

        {isMermaid && <pre contentEditable={false} hidden={mode === Mode.Edit} ref={previewer} />}
      </pre>
    </NodeViewWrapper>
  );
}
