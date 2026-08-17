import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

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

type CodeBlockProps = {
  editor: { isEditable: boolean };
  node: {
    attrs: { language?: string | null; mode?: number };
    textContent: string;
  };
  updateAttributes: (attrs: Record<string, unknown>) => void;
  extension: { options: { lowlight: { listLanguages: () => string[] } } };
};

export default function CodeBlock(props: CodeBlockProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === 'ADMIN';
  const { editor, node, updateAttributes, extension } = props;
  const {
    attrs: { language: defaultLanguage, mode = Mode.Edit },
    textContent,
  } = node;
  const previewer = useRef<HTMLPreElement>(null);
  const isReadOnly = !editor.isEditable;
  const isMermaid = defaultLanguage === 'mermaid';
  const effectiveMode = isReadOnly && isMermaid ? Mode.Preview : mode;

  useEffect(() => {
    if (effectiveMode !== Mode.Preview || !previewer.current || !isMermaid || !textContent.trim()) {
      return;
    }

    let cancelled = false;

    const renderMermaid = async () => {
      try {
        const mermaid = await ensureMermaid();
        if (cancelled || !previewer.current) return;

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
        const textarea = document.createElement('textarea');
        textarea.innerHTML = textContent;
        const decodedTextContent = textarea.value;

        const { svg } = await mermaid.render(id, decodedTextContent);
        if (!cancelled && previewer.current) {
          previewer.current.innerHTML = svg;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Mermaid rendering error:', error);
        }
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
  }, [effectiveMode, textContent, isMermaid]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (isReadOnly) return;
    updateAttributes({
      language: event.target.value,
      mode,
    });
  };

  const handleToggleMermaidPreview = () => {
    if (isReadOnly) return;
    updateAttributes({
      language: defaultLanguage,
      mode: mode === Mode.Edit ? Mode.Preview : Mode.Edit,
    });
  };

  return (
    <NodeViewWrapper className='not-prose my-4'>
      <div className='overflow-hidden rounded-md border border-gray-600 bg-slate-900'>
        <div className='flex items-center justify-between bg-gray-800 px-3 py-2'>
          <div className='flex items-center gap-2'>
            {isMermaid && isAdmin && !isReadOnly && (
              <button
                type='button'
                contentEditable={false}
                onClick={handleToggleMermaidPreview}
                className='rounded-md bg-gray-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-600'
              >
                {mode === Mode.Edit ? '미리보기' : '편집'}
              </button>
            )}
          </div>

          <select
            contentEditable={false}
            value={defaultLanguage ?? 'null'}
            onChange={handleLanguageChange}
            disabled={isReadOnly}
            aria-label='코드 블록 언어'
            className='rounded-md border border-gray-600 bg-gray-700 px-3 py-1.5 text-xs text-white transition-colors hover:bg-gray-600 disabled:cursor-default disabled:opacity-90'
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

        <pre
          hidden={isMermaid && effectiveMode === Mode.Preview}
          className='overflow-x-auto bg-slate-900 p-4 text-sm text-gray-100'
        >
          <NodeViewContent as='code' />
        </pre>

        {isMermaid && (
          <pre
            contentEditable={false}
            hidden={effectiveMode === Mode.Edit}
            ref={previewer}
            className='overflow-x-auto bg-slate-900 p-4'
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}
