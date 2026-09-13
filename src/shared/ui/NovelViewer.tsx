'use client';

import { EditorContent } from 'novel';
import { blogProseScope } from '@/widgets/post/ui/blog-prose-scope';
import { preprocessHTML } from '../utils';
import { viewerExtensions } from './TextEditor/viewerExtensions';

type NovelViewerProps = {
  content: string;
  onReady?: () => void;
};

export default function NovelViewer({ content, onReady }: NovelViewerProps) {
  const processedValue = content ? preprocessHTML(content) : content;

  return (
    <div className={blogProseScope}>
      <EditorContent
        extensions={viewerExtensions}
        immediatelyRender={false}
        editable={false}
        initialContent={processedValue as any}
        onCreate={() => onReady?.()}
      />
    </div>
  );
}
