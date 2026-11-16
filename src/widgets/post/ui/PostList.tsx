import type { PostResponse } from '@/entities/post/model/post';
import { PostListCard } from '@/features/blog/ui';
import { PostListCardSkeleton } from '@/shared/ui/skeleton';

type PostListProps = {
  posts: PostResponse[];
  isLoading: boolean;
};

export const PostList = ({ posts, isLoading }: PostListProps) => {
  if (isLoading) {
    return (
      <div className='flex flex-col' aria-busy='true'>
        {['a', 'b', 'c', 'd', 'e'].map((id) => (
          <PostListCardSkeleton key={`skeleton-list-${id}`} />
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col'>
      {posts.map((post) => (
        <PostListCard key={post.id} post={post} />
      ))}
    </div>
  );
};
