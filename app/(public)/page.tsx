import React from 'react';
import { auth } from '@/shared/utils/auth';
import SignoutButton from '@/features/auth/ui/signout-button';
import { BlogFooter, BlogHeader, BlogMain } from '@/widgets/home';

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-col items-center row-start-2 gap-8 sm:items-start">
      <BlogHeader />
      <BlogMain />
      <div>{session?.user.name}</div>
      <SignoutButton />
      <BlogFooter />
    </main>
  );
}
