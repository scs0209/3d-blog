'use client';

import { PostListCard } from '@/features/blog/ui';
import { useCategoryPosts } from '@/features/category/model';
import { useParams } from 'next/navigation';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: categoryPosts, isLoading: isCategoryPostsLoading } = useCategoryPosts(slug as string, 1, 10);

  if (isCategoryPostsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-4xl mx-auto w-full'>
      {categoryPosts?.posts?.map((post) => (
        <PostListCard key={post.id} post={post} categoryName={categoryPosts?.name} categorySlug={categoryPosts?.slug} />
      ))}
    </div>
  );
}
