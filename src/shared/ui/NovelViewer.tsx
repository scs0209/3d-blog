'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

type NovelViewerProps = {
  content: string;
};

const NovelViewer = ({ content }: NovelViewerProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
  });

  return <EditorContent editor={editor} />;
};

export default NovelViewer;
