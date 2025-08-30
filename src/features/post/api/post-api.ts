import { type ApiRequest, fetcher } from '@/shared/api';
import type { Post } from '@prisma/client';
import { getSession } from 'next-auth/react';
import type { GetPostSummaryRequest } from '../model';
import type { PostResponse } from '@/entities/post/model/post';

export const getPostList = () => fetcher({ url: '/api/posts', method: 'get' });

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

export const getPostDetail = (id: number) =>
  fetcher({
    url: '/api/post/{id}',
    path: { id },
    method: 'get',
  });

export const updatePost = (id: number, body: ApiRequest<'/api/post/{id}', 'put'>) =>
  fetcher({
    url: '/api/post/{id}',
    path: { id },
    method: 'put',
    body,
  });

export const deletePost = (id: number) =>
  fetcher({
    url: '/api/post/{id}',
    path: { id },
    method: 'delete',
  });

export const getPostBySlug = (slug: string): Promise<PostResponse> =>
  fetcher({
    url: '/api/posts/{slug}',
    path: { slug },
    method: 'get',
  });

export const getPostSummary = (body: GetPostSummaryRequest) =>
  fetcher({
    url: '/api/summarize',
    method: 'post',
    body,
  });
