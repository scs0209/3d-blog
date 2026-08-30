import type { NodeViewProps } from '@tiptap/react';
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
        primaryColor: '#2a1545',
        primaryTextColor: '#f5f0e8',
        primaryBorderColor: '#ff9a3c',
        lineColor: '#ffb870',
        secondaryColor: '#1c0e38',
        tertiaryColor: '#12082a',
        background: '#12091c',
        mainBkg: '#1c0e38',
        nodeBorder: '#ff9a3c',
        clusterBkg: '#1a1424',
        titleColor: '#f5f0e8',
        edgeLabelBackground: '#1c0e38',
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

const isFormControlEvent = (event: Event) => {
  const target = event.target as HTMLElement | null;
  return Boolean(target?.closest('select, button, option'));
};

export const shouldStopCodeBlockEvent = ({ event }: { event: Event }) => isFormControlEvent(event);

export default function CodeBlock({ editor, node, updateAttributes, extension, getPos }: NodeViewProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === 'ADMIN';
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
          previewer.current.innerHTML = `<div class="px-1 py-2 text-sm text-rose-300">Mermaid 구문 오류: ${message}</div>`;
        }
      }
    };

    void renderMermaid();

    return () => {
      cancelled = true;
    };
  }, [effectiveMode, textContent, isMermaid]);

  const applyAttributes = (attrs: Record<string, unknown>) => {
    if (editor.isEditable) {
      updateAttributes(attrs);
      return;
    }

    const pos = getPos();
    if (typeof pos !== 'number') {
      updateAttributes(attrs);
      return;
    }

    editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...attrs }));
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value === 'null' ? null : event.target.value;
    applyAttributes({
      language,
      mode: language === 'mermaid' && isReadOnly ? Mode.Preview : mode,
    });
  };

  const handleToggleMermaidPreview = () => {
    applyAttributes({
      language: defaultLanguage,
      mode: mode === Mode.Edit ? Mode.Preview : Mode.Edit,
    });
  };

  const handleControlMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <NodeViewWrapper className='code-block-root not-prose my-6'>
      <div className='relative overflow-hidden rounded-2xl border border-[#ff9a3c]/20 bg-[#12091c]/92 shadow-[0_16px_48px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,200,160,0.12)] backdrop-blur-md dark:border-[#3de8ff]/15 dark:bg-[#070b12]/92 dark:shadow-[0_16px_48px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]'>
        <span
          className='pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ff9a3c]/55 to-transparent dark:via-[#3de8ff]/45'
          aria-hidden
        />

        <div className='code-block-toolbar pointer-events-auto flex items-center justify-between gap-3 px-4 py-2.5'>
          <div className='flex min-w-0 items-center gap-3'>
            <div className='code-block-dots' aria-hidden='true' />
            <select
              contentEditable={false}
              value={defaultLanguage ?? 'null'}
              onMouseDown={handleControlMouseDown}
              onChange={handleLanguageChange}
              aria-label='코드 블록 언어'
              className='code-block-lang-select'
            >
              <option value='null'>auto</option>
              <option value='mermaid'>mermaid</option>
              <option disabled>—</option>
              {extension.options.lowlight.listLanguages().map((lang: string) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {isMermaid && isAdmin && (
            <button
              type='button'
              contentEditable={false}
              onMouseDown={handleControlMouseDown}
              onClick={handleToggleMermaidPreview}
              className='shrink-0 rounded-full border border-[#ff9a3c]/30 bg-[#ff9a3c]/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#ffd4b0] transition-colors hover:border-[#ff9a3c]/55 hover:bg-[#ff9a3c]/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9a3c]/45 dark:border-[#3de8ff]/30 dark:bg-[#3de8ff]/10 dark:text-[#b8e4ff] dark:hover:border-[#3de8ff]/50 dark:hover:bg-[#3de8ff]/16 dark:focus-visible:ring-[#3de8ff]/40'
            >
              {effectiveMode === Mode.Edit ? '미리보기' : '편집'}
            </button>
          )}
        </div>

        <div className='h-px bg-[#ff9a3c]/12 dark:bg-[#3de8ff]/10' aria-hidden />

        <pre hidden={isMermaid && effectiveMode === Mode.Preview} className='code-block-pre'>
          <NodeViewContent as='code' />
        </pre>

        {isMermaid && (
          <pre
            contentEditable={false}
            hidden={effectiveMode === Mode.Edit}
            ref={previewer}
            className='code-block-pre code-block-mermaid'
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}
