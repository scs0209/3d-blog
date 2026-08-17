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
      <div className='pointer-events-none absolute inset-0 z-0 hidden md:block'>
        <div className='h-full w-full bg-gradient-to-tr from-[#8a4a68]/12 via-[#1c0e38]/15 to-[#ffc090]/8 blur-[2px] dark:from-cyan-900/15 dark:via-fuchsia-900/8 dark:to-cyan-800/8' />
      </div>
      <div className='relative z-10'>
        <h2 className={`mb-4 text-lg font-bold ${blogTheme.textPrimary}`}>댓글</h2>
        <CommentForm postId={postId} />
        <ul className='space-y-6'>
          {comments.map((comment) => (
            <Comment comment={comment} key={comment?.id} replies={comment?.replies} postId={postId} />
          ))}
        </ul>
      </div>
    </section>
  );
}
