import PostHtmlViewer from '@/shared/ui/PostHtmlViewer';

type PostContentViewerProps = {
  content: string;
};

/**
 * 포스트 본문 뷰어.
 * TipTap HTML을 초기 응답에 포함해 크롤러/AI가 JS 없이도 읽을 수 있게 한다.
 * (구 NovelViewer + ssr:false 는 본문이 빈 셸만 내려가 크롤이 실패했음)
 */
export const PostContentViewer = ({ content }: PostContentViewerProps) => {
  return <PostHtmlViewer content={content} />;
};
