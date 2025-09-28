'use server';

import { deletePost, updatePost } from '@/features/post/api/post-api';

export async function updatePostAction(
  postId: number,
  updateData: {
    title: string;
    content: string;
    categoryId: number;
    tagIds: number[];
  }
) {
  try {
    const updatedPost = await updatePost(postId, {
      title: updateData.title,
      content: updateData.content,
      categoryId: updateData.categoryId,
      tags: updateData.tagIds,
    });
    
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error('Failed to update post:', error);
    return { success: false, error: 'Failed to update post' };
  }
}

export async function deletePostAction(postId: number) {
  try {
    await deletePost(postId);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}
