import { getPostBySlug } from '@/features/post/api/post-api';
import { formatDateToYMD } from '@/shared/utils';

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
      <div>{post.content}</div>
      <div>
        <span>{post.author?.name}</span>
        <span>{formatDateToYMD(post?.createdAt ?? '')}</span>
      </div>
    </div>
  );
}
