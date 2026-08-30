import { Suspense } from 'react';
import { PostTable, SectionCards, SectionCardsFallback, UserTable } from '@/widgets/admin/home/ui';
import { AdminTableSkeleton } from '@/widgets/admin/ui/admin-skeleton';

export default function AdminDashboardPage() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <Suspense fallback={<SectionCardsFallback />}>
            <SectionCards />
          </Suspense>
          <Suspense fallback={<AdminTableSkeleton />}>
            <PostTable />
          </Suspense>
          <Suspense fallback={<AdminTableSkeleton rows={4} />}>
            <UserTable />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
