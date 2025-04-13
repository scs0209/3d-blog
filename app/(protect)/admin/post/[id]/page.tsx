'use client';

import { useState, useEffect } from 'react';
import { deletePost, getPostDetail, updatePost } from '@/features/post/api/post-api';

export default function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<{
    title: string;
    content: string;
    categoryId: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const postId = 1; // 테스트할 ID

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await getPostDetail(params.id);
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  const handleUpdate = async () => {
    if (!post) return;
    try {
      const updatedPost = await updatePost(postId, {
        title: 'Updated Title',
        content: 'Updated Content',
        categoryId: post.categoryId,
      });
      setPost(updatedPost);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      setPost(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>No post found.</p>;

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-xl font-bold'>{post.title}</h1>
      <p>{post.content}</p>
      <button className='px-4 py-2 bg-blue-500 text-white rounded' onClick={handleUpdate}>
        Update Post
      </button>
      <button className='px-4 py-2 bg-red-500 text-white rounded' onClick={handleDelete}>
        Delete Post
      </button>
    </div>
  );
}
