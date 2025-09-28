import { getPostDetail } from '@/features/post/api/post-api';
import { PostUpdateForm } from '@/widgets/admin/post/ui';


export default async function PostUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const post = await getPostDetail(Number(resolvedParams.id));

  if (!post) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-red-300 mb-2'>포스트를 찾을 수 없습니다</h2>
          <p className='text-slate-400'>요청하신 포스트가 존재하지 않거나 삭제되었습니다.</p>
        </div>
      </div>
    );
  }

  return <PostUpdateForm initialPost={post} />;
}