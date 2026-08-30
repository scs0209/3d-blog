import { getStats } from '@/features/admin/home/api/stats-api';
import { PostsCard, TotalViewsCard, UsersCard, VisitorsCard } from '@/features/admin/home/ui';
import { AdminCardSkeleton } from '@/widgets/admin/ui/admin-skeleton';

export async function SectionCards() {
  const stats = await getStats();

  return (
    <div className='grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6'>
      <VisitorsCard visitor={stats.visitors} />
      <UsersCard users={stats.users} />
      <PostsCard posts={stats.posts} />
      <TotalViewsCard views={stats.views} />
    </div>
  );
}

export const SectionCardsFallback = () => {
  return (
    <div className='grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6'>
      {['a', 'b', 'c', 'd'].map((id) => (
        <AdminCardSkeleton key={`section-card-skeleton-${id}`} />
      ))}
    </div>
  );
};
