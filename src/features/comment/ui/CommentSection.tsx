import { CommentForm } from './CommentForm';
import { Comment } from './Comment';
import { getComments } from '../api';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

export const dynamic = 'force-dynamic';

type CommentSectionProps = {
  postId: number;
};

export async function CommentSection({ postId }: CommentSectionProps) {
  let comments: Awaited<ReturnType<typeof getComments>> = [];
  try {
    comments = await getComments({ postId });
  } catch {
    comments = [];
  }

  return (
    <section className={blogTheme.commentSection}>
      <h2 className={`mb-4 text-lg font-bold ${blogTheme.textPrimary}`}>댓글</h2>
      <CommentForm postId={postId} />
      <ul className='space-y-6'>
        {comments.map((comment) => (
          <Comment comment={comment} key={comment?.id} replies={comment?.replies} postId={postId} />
        ))}
      </ul>
    </section>
  );
}
