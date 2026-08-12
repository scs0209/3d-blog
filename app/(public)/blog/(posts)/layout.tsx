import type { Metadata } from 'next';
import { PostsLayoutShell } from '@/widgets/post/ui';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog',
};

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return <PostsLayoutShell>{children}</PostsLayoutShell>;
}
