import { preprocessHTML } from '@/shared/utils/process-html';
import { PostContentInteractive } from '@/shared/ui/PostContentInteractive';

type PostContentViewerProps = {
  content: string;
};

/**
 * 포스트 본문 뷰어.
 * - 서버: TipTap HTML을 응답에 넣어 크롤러/AI가 본문을 읽게 함
 * - 클라이언트: NovelViewer로 기존 코드블록·표·Mermaid UI 유지
 */
export const PostContentViewer = ({ content }: PostContentViewerProps) => {
  const ssrHtml = content ? preprocessHTML(content) : '';

  return <PostContentInteractive content={content} ssrHtml={ssrHtml} />;
};
