import { getPostBySlug } from '@/features/post/api/post-api';
import { formatDateToYMD } from '@/shared/utils';
import dynamic from 'next/dynamic';

const NovelViewer = dynamic(() => import('@/shared/ui/NovelViewer'));

export default async function PostPage({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}) {
  const { postSlug } = await params;
  const post = await getPostBySlug(postSlug);
  console.log(post);
  return (
    <div>
      <h1>{post.title}</h1>
      <NovelViewer content={post.content ?? ''} />
      <div>
        <span>{post.author?.name}</span>
        <span>{formatDateToYMD(post?.createdAt ?? '')}</span>
      </div>
    </div>
  );
}
