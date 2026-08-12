'use client';

import { useParams } from 'next/navigation';
import { PostListCard } from '@/features/blog/ui';
import { useCategoryPosts } from '@/features/category/model';
import { PostListCardSkeleton } from '@/shared/ui/skeleton';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: categoryPosts, isLoading: isCategoryPostsLoading } = useCategoryPosts(slug as string, 1, 10);

  if (isCategoryPostsLoading) {
    return (
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-8' aria-busy='true'>
        {['a', 'b', 'c', 'd', 'e'].map((id) => (
          <PostListCardSkeleton key={`category-skeleton-${id}`} />
        ))}
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-4xl'>
      {categoryPosts?.posts?.map((post) => (
        <PostListCard key={post.id} post={post} categoryName={categoryPosts?.name} categorySlug={categoryPosts?.slug} />
      ))}
    </div>
  );
}
