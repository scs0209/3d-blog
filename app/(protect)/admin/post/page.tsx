// bcrypt를 사용하기 위해서는 서버 컴포넌트로 동작해야됨
'use client';
import { createPost } from '@/features/post/api/post-api';
import type { PostFormSchema } from '@/features/post/model/post-form-schema';
import PostForm from '@/features/post/ui/post-form';
import { getSession } from 'next-auth/react';

export default function NewBlogPostPage() {
  const handleCreatePost = async (data: PostFormSchema) => {
    try {
      const session = await getSession();
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
