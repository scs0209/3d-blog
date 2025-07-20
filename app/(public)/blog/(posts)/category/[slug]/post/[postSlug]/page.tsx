import { getPostBySlug } from '@/features/post/api/post-api';
import { formatDateToYMD } from '@/shared/utils';
import dynamic from 'next/dynamic';
import { CommentSection } from '@/features/comment/ui';
import { PostSummary } from '@/shared/ui/PostSummary';

const NovelViewer = dynamic(() => import('@/shared/ui/NovelViewer'));

export async function generateMetadata({ params }: { params: Promise<{ postSlug: string }> }) {
  const { postSlug } = await params;
  const decodedSlug = decodeURIComponent(postSlug);
  const post = await getPostBySlug(decodedSlug);
  return {
    title: post.title,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}) {
  const { postSlug } = await params;
  const decodedSlug = decodeURIComponent(postSlug);
  const post = await getPostBySlug(decodedSlug);

  return (
    <div>
      {/* 본문 영역 꾸밈 */}
      <section className='relative md:bg-gradient-to-br md:from-[#181c2a]/90 md:via-[#232946]/90 md:to-[#232946]/80 md:border md:border-blue-400/30 md:rounded-2xl md:shadow-[0_0_24px_4px_#7dd3fc22] px-4 sm:px-6 md:px-8 py-8 mb-12 mt-4 max-w-4xl mx-4 md:overflow-hidden lg:mx-auto'>
        <div className='absolute inset-0 pointer-events-none z-0 hidden md:block'>
          <div className='w-full h-full bg-gradient-to-tr from-blue-900/20 via-fuchsia-900/10 to-blue-800/10 blur-[2px]' />
        </div>
        <h1 className='relative z-10 text-3xl font-extrabold text-blue-100 mb-4 md:drop-shadow-[0_2px_8px_#7dd3fc55]'>
          {post.title}
        </h1>
        <div className='relative z-10 flex items-center gap-3 mb-6 text-xs text-blue-200'>
          <span className='font-mono'>{post.author?.name}</span>
          <span className='opacity-60'>|</span>
          <span>{formatDateToYMD(post?.createdAt ?? '')}</span>
        </div>

        {/* AI 요약 표시 */}

        <div className='relative z-10 p-2'>
          <PostSummary post={post} />
        </div>

        <div className='relative z-10'>
          <NovelViewer content={post.content ?? ''} />
        </div>
      </section>

      {/* 댓글 섹션 */}
      <CommentSection postId={post.id} />
    </div>
  );
}
