import { createPost } from '@/features/post/api/post-api';
import type { PostFormSchema } from '@/features/post/model/post-form-schema';
import PostForm from '@/features/post/ui/post-form';
import { auth } from '@/shared/utils/auth';

export default function NewBlogPostPage() {
  const handleCreatePost = async (data: PostFormSchema) => {
    try {
      const session = await auth();
      await createPost({
        ...data,
        authorId: Number(session?.user?.id) || 0,
        categoryId: Number(data.categoryId),
      });
      alert('성공!');
    } catch (error) {
      console.error('Failed to create blog post:', error);
    }
  };

  return (
    <div className='py-8 mx-auto'>
      <h1 className='mb-4 text-2xl font-bold'>새 블로그 포스트 작성</h1>
      <PostForm onSubmit={handleCreatePost} />
    </div>
  );
}
