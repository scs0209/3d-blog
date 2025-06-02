'use client';
import { defaultExtensions } from './TextEditor/extensions';
import { EditorContent } from 'novel';

type NovelViewerProps = {
  content: string;
};

const extensions = [...defaultExtensions];

export default function NovelViewer({ content }: NovelViewerProps) {
  return (
    <EditorContent
      className='h-[500px]'
      extensions={extensions}
      immediatelyRender={false}
      editable={false}
      initialContent={content as any}
    />
  );
}
