import { getStats } from '@/features/admin/home/api/stats-api';
import { getUserCount } from '@/features/user/api/user-api';
import { getVisitor } from '@/features/visitor/api';
import { PostsCard, TotalViewsCard, UsersCard, VisitorsCard } from '@/features/admin/home/ui';

export async function SectionCards() {
  const stats = await getStats();
  const userCount = await getUserCount();
  const visitor = await getVisitor();

  return (
    <div className='grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6'>
      <VisitorsCard visitor={visitor} />
      <UsersCard userCount={userCount} />
      <PostsCard posts={stats.posts} />
      <TotalViewsCard views={stats.views} />
    </div>
  );
}
