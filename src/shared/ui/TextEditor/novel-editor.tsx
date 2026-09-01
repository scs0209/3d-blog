'use client';

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
} from 'novel';
import { handleCommandNavigation } from 'novel/extensions';
import type { Editor } from '@tiptap/react';
import { useRef } from 'react';
import { defaultExtensions } from './extensions';

import { slashCommand, suggestionItems } from './slash-command';
import { preprocessHTML } from '@/shared/utils';
import { cn } from '@/shadcn-ui/lib/utils';
import { adminFormTheme } from '@/widgets/admin/ui/admin-form-theme';

const extensions = [...defaultExtensions, slashCommand];

const NovelEditor = ({
  value,
  onChange,
  className,
}: {
  value?: string;
  onChange: (val: string) => void;
  className?: string;
}) => {
  const processedValue = value ? preprocessHTML(value) : value;
  const editorRef = useRef<Editor | null>(null);

  const handleEditorCreate = ({ editor }: { editor: Editor }) => {
    editorRef.current = editor;
  };

  const handleShellMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('.ProseMirror')) return;
    event.preventDefault();
    editorRef.current?.chain().focus('end').run();
  };

  return (
    <div className={cn(adminFormTheme.editorRoot, className)} onMouseDown={handleShellMouseDown}>
      <EditorRoot>
        <EditorContent
          className={adminFormTheme.editorBody}
          immediatelyRender={false}
          extensions={extensions}
          onCreate={handleEditorCreate}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class: adminFormTheme.editorProse,
            },
          }}
          initialContent={processedValue as any}
          onUpdate={({ editor }) => {
            onChange(editor.getHTML());
          }}
        />
        <EditorCommand className={adminFormTheme.editorCommand}>
          <EditorCommandEmpty className={`px-2 ${adminFormTheme.editorCommandMuted}`}>결과 없음</EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                tabIndex={-1}
                onCommand={(val) => item.command?.(val)}
                className={adminFormTheme.editorCommandItem}
                key={item.title}
              >
                <div className={adminFormTheme.editorCommandIcon}>{item.icon}</div>
                <div>
                  <p className='font-medium'>{item.title}</p>
                  <p className={adminFormTheme.editorCommandMuted}>{item.description}</p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
      </EditorRoot>
    </div>
  );
};
export default NovelEditor;
