import { useEffect, useRef } from 'react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import mermaid from 'mermaid';

console.log(mermaid);
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

export enum MODE {
  PREVIEW = 0,
  EDIT = 1,
}

export default function CodeBlock(props: any) {
  const { node, updateAttributes, extension } = props;
  const {
    attrs: { language: defaultLanguage, mode = MODE.EDIT },
    textContent,
  } = node;
  const previewer = useRef<HTMLPreElement>(null);
  const isMermaid = defaultLanguage === 'mermaid';

  useEffect(() => {
    if (mode === MODE.PREVIEW && previewer.current && isMermaid && textContent.trim()) {
      try {
        console.log('Rendering mermaid:', textContent);
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        mermaid
          .render(id, textContent)
          .then(({ svg }) => {
            if (previewer.current) {
              previewer.current.innerHTML = svg;
            }
          })
          .catch((error) => {
            console.error('Mermaid rendering error:', error);
            if (previewer.current) {
              previewer.current.innerHTML = `<div style="color: red; padding: 1rem;">Mermaid 구문 오류: ${error.message}</div>`;
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  }, [mode, textContent, isMermaid]);

  return (
    <NodeViewWrapper className='code-block relative'>
      {isMermaid && (
        <button
          type='button'
          contentEditable={false}
          onClick={() => {
            updateAttributes({
              language: defaultLanguage,
              mode: mode === MODE.EDIT ? MODE.PREVIEW : MODE.EDIT,
            });
          }}
          className='absolute top-[0.5rem] left-[0.5rem] bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700 z-10'
        >
          {mode === MODE.EDIT ? '미리보기' : '편집'}
        </button>
      )}

      <select
        contentEditable={false}
        defaultValue={defaultLanguage}
        onChange={(event) =>
          updateAttributes({
            language: event.target.value,
            mode: mode,
          })
        }
        className='absolute top-[0.5rem] right-[0.5rem] bg-white text-black/80 z-10'
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

      <pre hidden={isMermaid && mode === MODE.PREVIEW}>
        <NodeViewContent as='code' />
      </pre>

      {isMermaid && (
        <pre
          className='preview bg-white p-4 rounded-lg overflow-auto'
          contentEditable={false}
          hidden={mode === MODE.EDIT}
          ref={previewer}
        />
      )}
    </NodeViewWrapper>
  );
}
