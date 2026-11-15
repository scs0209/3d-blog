'use client';

import { blogPostSurface } from '@/widgets/post/ui/blog-post-surface';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { useComments } from '../model';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';

type CommentSectionProps = {
  postId: number;
};

export function CommentSection({ postId }: CommentSectionProps) {
  const { comments, isLoading } = useComments(postId);

  return (
    <section className={blogPostSurface.commentSection}>
      <span className={blogTheme.cardTopGlow} aria-hidden />
      <h2 className='mb-5 font-[family-name:var(--font-syne),sans-serif] text-[22px] font-semibold text-[#e9edf1]'>
        댓글
      </h2>
      <CommentForm postId={postId} />
      {isLoading ? (
        <p className={`py-4 text-sm ${blogTheme.textMuted}`} role='status' aria-live='polite'>
          댓글 불러오는 중...
        </p>
      ) : (
        <ul className='space-y-4'>
          {comments.map((comment) => (
            <Comment comment={comment} key={comment?.id} replies={comment?.replies} postId={postId} />
          ))}
        </ul>
      )}
    </section>
  );
}
