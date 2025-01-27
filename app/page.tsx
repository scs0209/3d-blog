import React from 'react';
import { redirect } from 'next/navigation';
import { PostsResponse } from '@/entities/home/model/types';
import { auth } from '@/shared/utils/auth';
import SignoutButton from '@/features/auth/ui/signout-button';

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
  const session = await auth();

  return (
    <main className="flex flex-col items-center row-start-2 gap-8 sm:items-start">
      <div>{session.user.name}</div>
      <SignoutButton />
    </main>
  );
}
