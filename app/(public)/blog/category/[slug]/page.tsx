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
    <div className='flex flex-col gap-8'>
      {categoryPosts?.posts?.map((post) => (
        <PostListCard key={post.id} post={post} categoryName={categoryPosts?.name} categorySlug={categoryPosts?.slug} />
      ))}
    </div>
  );
}
