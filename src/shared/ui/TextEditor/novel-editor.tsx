'use client';

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  JSONContent,
} from 'novel';
import { useState } from 'react';
import { defaultExtensions } from './extensions';

import { slashCommand, suggestionItems } from './slash-command';

const extensions = [...defaultExtensions, slashCommand];

const NovelEditor = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (val: JSONContent) => void;
}) => {
  // const parsedValue: JSONContent | undefined = value
  //   ? (JSON.parse(value) as JSONContent)
  //   : undefined;

  return (
    <div className="relative w-full max-w-screen-lg min-h-[500px]">
      <EditorRoot>
        <EditorContent
          className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
          immediatelyRender={false}
          extensions={extensions}
          initialContent={value}
          onUpdate={({ editor }) => {
            const json = editor.getJSON();
            onChange(editor.getHTML());
          }}
        />
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command(val)}
                className="flex items-center w-full px-2 py-1 space-x-2 text-sm text-left rounded-md hover:bg-accent aria-selected:bg-accent"
                key={item.title}
              >
                <div className="flex items-center justify-center w-10 h-10 border rounded-md border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
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
