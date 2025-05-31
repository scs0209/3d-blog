'use client';

import { Button } from '@/shadcn-ui/components/ui/button';

async function createPost() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'New Post Title',
        content: 'This is the content of the new post.',
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to create post');
    }

    const newPost = await res.json();
    console.log('Post created:', newPost);
    alert('Post created successfully!');
  } catch (error) {
    console.error('Error creating post:', error);
    alert('Failed to create post.');
  }
}

export default function CreatePostButton() {
  return <Button onClick={createPost}>Create Post</Button>;
}
