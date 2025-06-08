import { CommentForm } from './CommentForm';
import { Comment } from './Comment';
import { getComments } from '../api';

export const dynamic = 'force-dynamic';

type CommentSectionProps = {
  postId: number;
};

export async function CommentSection({ postId }: CommentSectionProps) {
  const comments = await getComments({ postId });

  return (
    <section className='mt-10 relative md:bg-gradient-to-br md:backdrop-blur-sm md:border md:from-[#181c2a]/90 md:via-[#232946]/90 md:to-[#232946]/80 md:border-blue-400/30 rounded-2xl md:shadow-[0_0_24px_4px_#7dd3fc22] px-4 sm:px-6 md:px-8 py-8 max-w-3xl mx-auto md:overflow-hidden'>
      <div className='absolute inset-0 pointer-events-none z-0 hidden md:block'>
        <div className='w-full h-full bg-gradient-to-tr from-blue-900/20 via-fuchsia-900/10 to-blue-800/10 blur-[2px]' />
      </div>
      <div className='relative z-10'>
        <h2 className='text-lg font-bold text-blue-200 mb-4'>댓글</h2>

        {/* 댓글 입력 영역 */}
        <CommentForm postId={postId} />

        {/* 댓글 목록 */}
        <ul className='space-y-6'>
          {comments.map((comment) => (
            <Comment comment={comment} key={comment?.id} replies={comment?.replies} postId={postId} />
          ))}
        </ul>
      </div>
    </section>
  );
}
