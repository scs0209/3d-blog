'use client';

import { useRouter } from 'next/navigation';
import { createPost } from '@/features/post/api/post-api';
import type { PostFormSchema } from '@/features/post/model/post-form-schema';
import PostForm from '@/features/post/ui/post-form';

export default function NewBlogPostPage() {
  const router = useRouter();

  const handleCreatePost = async (data: PostFormSchema) => {
    try {
      await createPost(data);
      alert('성공!');
    } catch (error) {
      console.error('Failed to create blog post:', error);
    }
  };

  return (
    <div className="py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">새 블로그 포스트 작성</h1>
      <PostForm onSubmit={handleCreatePost} />
    </div>
  );
}
