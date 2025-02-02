import { Post } from '@prisma/client';
import { getSession } from 'next-auth/react';

type CreatePostInput = {
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
  tags?: number[]; // 태그 ID 배열
};

// 게시글 생성
export const createPost = async (data: CreatePostInput): Promise<Post> => {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error('User session is required');
  }

  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      authorId: session.user.id,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create post');
  }

  return response.json();
};
