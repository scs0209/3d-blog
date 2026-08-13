'use client';

import { createPost } from '@/features/post/api/post-api';
import type { PostFormSchema } from '@/features/post/model/post-form-schema';
import PostForm from '@/features/post/ui/post-form';
import { toast } from '@/shared/ui/toast/useToast';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NewBlogPostPage() {
  const router = useRouter();

  const handleCreatePost = async (data: PostFormSchema) => {
    try {
      const session = await getSession();
      await createPost({
        title: data.title,
        content: data.content,
        authorId: Number(session?.user?.id) || 0,
        categoryId: Number(data.categoryId),
        tags: (data.tagIds ?? []).map((id) => Number(id)),
      });
      toast.success('포스트를 게시했습니다');
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Failed to create blog post:', error);
      toast.error(error instanceof Error ? error.message : '포스트 게시에 실패했습니다');
      throw error;
    }
  };

  return (
    <div className='mx-auto max-w-5xl space-y-4 pb-8'>
      <div className='space-y-1 px-1'>
        <p className={`text-sm ${adminTheme.textMuted}`}>제목·카테고리·태그를 정한 뒤 본문을 작성하세요</p>
      </div>
      <PostForm onSubmit={handleCreatePost} />
    </div>
  );
}
