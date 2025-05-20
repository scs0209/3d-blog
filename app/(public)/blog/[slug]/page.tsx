'use client';

import { useCategoryPosts } from '@/features/category/model';
import { useParams } from 'next/navigation';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  console.log(params);
  const { slug } = useParams();
  const { data: categoryPosts, isLoading: isCategoryPostsLoading } = useCategoryPosts(slug as string, 1, 10);

  console.log(categoryPosts);

  return <div>BlogPostPage</div>;
}
