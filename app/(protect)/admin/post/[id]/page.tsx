'use client';

import { useState, useEffect } from 'react';
import { deletePost, getPostDetail, updatePost } from '@/features/post/api/post-api';
import { formatDateToYMD } from '@/shared/utils';
import type { PostResponse } from '@/entities/post/model/post';
import NovelEditor from '@/shared/ui/TextEditor/novel-editor';

export default function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const resolvedParams = await params;
        const data = await getPostDetail(Number(resolvedParams.id));
        setPost(data);
        setContent(data.content ?? '');
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  const handleUpdate = async () => {
    if (!post) {
      return;
    }

    const resolvedParams = await params;
    try {
      const updatedPost = await updatePost(Number(resolvedParams.id), {
        title: post.title ?? '',
        content: content,
        categoryId: post.category?.id ?? 0,
      });
      setPost(updatedPost);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleDelete = async () => {
    const resolvedParams = await params;
    try {
      await deletePost(Number(resolvedParams.id));
      setPost(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>No post found.</p>;
  }

  return (
    <div className='p-6 space-y-4'>
      <h1 className='relative z-10 text-3xl font-extrabold text-blue-100 mb-4 md:drop-shadow-[0_2px_8px_#7dd3fc55]'>
        {post.title}
      </h1>
      <div className='relative z-10 flex items-center gap-3 mb-6 text-xs text-blue-200'>
        <span className='font-mono'>{post.author?.name || 'Unknown Author'}</span>
        <span className='opacity-60'>|</span>
        <span>{formatDateToYMD(post?.createdAt ?? '')}</span>
        {post.category && (
          <>
            <span className='opacity-60'>|</span>
            <span className='text-blue-300'>{post.category.name}</span>
          </>
        )}
      </div>
      <NovelEditor value={content} onChange={setContent} />
      <button type='button' className='px-4 py-2 bg-blue-500 text-white rounded' onClick={handleUpdate}>
        Update Post
      </button>
      <button type='button' className='px-4 py-2 bg-red-500 text-white rounded' onClick={handleDelete}>
        Delete Post
      </button>
    </div>
  );
}
