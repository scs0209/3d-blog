import { PostsCard, TotalViewsCard, UsersCard, VisitorsCard } from '@/features/admin/home/ui';

export function SectionCards() {
  return (
    <div className='grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6'>
      <VisitorsCard />
      <UsersCard />
      <PostsCard />
      <TotalViewsCard />
    </div>
  );
}
