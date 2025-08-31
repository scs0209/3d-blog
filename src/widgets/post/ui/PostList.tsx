import { PostListCardSkeleton } from '@/shared/ui/skeleton';
import { PostListCard } from '@/features/blog/ui';
import type { PostResponse } from '@/entities/post/model/post';

type PostListProps = {
  posts: PostResponse[];
  isLoading: boolean;
};

export const PostList = ({ posts, isLoading }: PostListProps) => {
  if (isLoading) {
    return (
      <div className='flex flex-col gap-8'>
        {Array.from({ length: 5 }).map((_) => (
          <PostListCardSkeleton key={`skeleton-list-${Math.random()}`} />
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      {posts.map((post) => (
        <PostListCard key={post.id} post={post} />
      ))}
    </div>
  );
};
