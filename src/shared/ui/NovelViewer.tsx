'use client';
import { preprocessHTML } from '../utils';
import { defaultExtensions } from './TextEditor/extensions';
import { EditorContent } from 'novel';

type NovelViewerProps = {
  content: string;
};

const extensions = [...defaultExtensions];

export default function NovelViewer({ content }: NovelViewerProps) {
  const processedValue = content ? preprocessHTML(content) : content;
  
  return (
    <EditorContent extensions={extensions} immediatelyRender={false} editable={false} initialContent={processedValue as any} />
  );
}
