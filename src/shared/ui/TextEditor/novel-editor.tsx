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
import { cn } from '@/shadcn-ui/lib/utils';

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

  return (
    <div className={cn('relative w-full min-h-[420px]', className)}>
      <EditorRoot>
        <EditorContent
          className='min-h-[400px] w-full rounded-xl border border-[#ff9a3c]/25 bg-[#1c0e38]/35 p-4 text-[#ffe8d0] shadow-[inset_0_1px_0_rgba(255,154,60,0.08)] backdrop-blur-md dark:border-[#3de8ff]/20 dark:bg-[#070414]/45 dark:text-[#c8e8ff] dark:shadow-[inset_0_1px_0_rgba(61,232,255,0.08)]'
          immediatelyRender={false}
          extensions={extensions}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class:
                'prose prose-invert prose-headings:font-title prose-p:text-[#ffe8d0]/90 prose-headings:text-[#ffe8d0] dark:prose-p:text-[#c8e8ff]/90 dark:prose-headings:text-[#c8e8ff] font-default focus:outline-none max-w-full',
            },
          }}
          initialContent={processedValue as any}
          onUpdate={({ editor }) => {
            onChange(editor.getHTML());
          }}
        />
        <EditorCommand className='z-50 h-auto max-h-[330px] overflow-y-auto rounded-xl border border-[#ff9a3c]/25 bg-[#2a1545]/95 px-1 py-2 text-[#ffe8d0] shadow-[0_0_24px_rgba(255,154,60,0.15)] backdrop-blur-xl transition-all dark:border-[#3de8ff]/20 dark:bg-[#0a0618]/95 dark:text-[#c8e8ff] dark:shadow-[0_0_24px_rgba(61,232,255,0.12)]'>
          <EditorCommandEmpty className='px-2 text-[#d4a8c0]/75 dark:text-[#7ec8ff]/65'>결과 없음</EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                tabIndex={-1}
                onCommand={(val) => item.command?.(val)}
                className='command-item flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-[#ff9a3c]/15 dark:hover:bg-[#3de8ff]/12'
                key={item.title}
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-md border border-[#ff9a3c]/25 bg-[#1c0e38]/60 dark:border-[#3de8ff]/20 dark:bg-[#070414]/60'>
                  {item.icon}
                </div>
                <div>
                  <p className='font-medium'>{item.title}</p>
                  <p className='text-xs text-[#d4a8c0]/75 dark:text-[#7ec8ff]/65'>{item.description}</p>
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
