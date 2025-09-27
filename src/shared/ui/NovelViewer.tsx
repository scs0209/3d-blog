'use client';
import { defaultExtensions } from './TextEditor/extensions';
import { EditorContent } from 'novel';

type NovelViewerProps = {
  content: string;
};

const extensions = [...defaultExtensions];

export default function NovelViewer({ content }: NovelViewerProps) {
  // HTML 문자열에서 코드블럭 내부의 \n 개행 문자를 <br> 태그로 변환
  const preprocessHTML = (html: string) => {
    return html.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, (match, content) => {
      // 코드블럭 내부의 \n 개행 문자를 <br> 태그로 변환
      const processedContent = content.replace(/\n/g, '<br>');
      return match.replace(content, processedContent);
    });
  };

  const processedValue = content ? preprocessHTML(content) : content;
  return (
    <EditorContent extensions={extensions} immediatelyRender={false} editable={false} initialContent={processedValue as any} />
  );
}
