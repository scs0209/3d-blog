import React from 'react';
import CreatePostButton from '@/shared/ui/Button/Button';
import { PostsResponse } from '@/entities/home/model/types';

async function getPosts(): Promise<PostsResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  return res.json();
}
export default async function Home() {
  let posts;

  try {
    posts = await getPosts();
  } catch (error) {
    console.error(error);
    posts = null;
  }
  console.log(posts?.map((post) => post.title));
  return (
    <main className="flex flex-col items-center row-start-2 gap-8 sm:items-start">
      <CreatePostButton />
    </main>
  );
}
