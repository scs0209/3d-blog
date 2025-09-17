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
import { defaultExtensions } from './extensions';

import { slashCommand, suggestionItems } from './slash-command';
import { preprocessHTML } from '@/shared/utils';

const extensions = [...defaultExtensions, slashCommand];

const NovelEditor = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (val: string) => void;
}) => {
  const processedValue = value ? preprocessHTML(value) : value;
  
  return (
    <div className='relative w-[1000px] max-w-screen-lg min-h-[500px]'>
      <EditorRoot>
        <EditorContent
          className='min-h-[400px] rounded-xl border p-4'
          immediatelyRender={false}
          extensions={extensions}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class: 'prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full',
            },
          }}
          initialContent={processedValue as any}
          onUpdate={({ editor }) => {
            onChange(editor.getHTML());
          }}
        />
        <EditorCommand className='z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all'>
          <EditorCommandEmpty className='px-2 text-muted-foreground'>No results</EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                tabIndex={-1}
                onCommand={(val) => item.command?.(val)}
                className='command-item flex items-center w-full px-2 py-1 space-x-2 text-sm text-left rounded-md'
                key={item.title}
              >
                <div className='flex items-center justify-center w-10 h-10 border rounded-md border-muted bg-background'>
                  {item.icon}
                </div>
                <div>
                  <p className='font-medium'>{item.title}</p>
                  <p className='text-xs text-muted-foreground'>{item.description}</p>
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
