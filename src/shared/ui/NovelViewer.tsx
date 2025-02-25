import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface NovelViewerProps {
  content: string;
}

const NovelViewer = ({ content }: NovelViewerProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
  });

  return <EditorContent editor={editor} />;
};

export default NovelViewer;
