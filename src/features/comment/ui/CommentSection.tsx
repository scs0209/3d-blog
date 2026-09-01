'use client';

import { CommentForm } from './CommentForm';
import { Comment } from './Comment';
import { useComments } from '../model';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { blogPostSurface } from '@/widgets/post/ui/blog-post-surface';

type CommentSectionProps = {
  postId: number;
};

export function CommentSection({ postId }: CommentSectionProps) {
  const { comments, isLoading } = useComments(postId);

  return (
    <section className={blogPostSurface.commentSection}>
      <span className={blogTheme.cardTopGlow} aria-hidden />
      <h2 className={`mb-4 text-lg font-bold ${blogTheme.textPrimary}`}>댓글</h2>
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
