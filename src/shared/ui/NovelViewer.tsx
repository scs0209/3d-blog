'use client';
import { preprocessHTML } from '../utils';
import { viewerExtensions } from './TextEditor/viewerExtensions';
import { EditorContent } from 'novel';
import { blogProseScope } from '@/widgets/post/ui/blog-prose-scope';

type NovelViewerProps = {
  content: string;
};

export default function NovelViewer({ content }: NovelViewerProps) {
  const processedValue = content ? preprocessHTML(content) : content;

  return (
    <div className={blogProseScope}>
      <EditorContent
        extensions={viewerExtensions}
        immediatelyRender={false}
        editable={false}
        initialContent={processedValue as any}
      />
    </div>
  );
}
