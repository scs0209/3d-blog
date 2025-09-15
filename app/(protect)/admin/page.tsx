import { PostTable, SectionCards, UserTable } from '@/widgets/admin/home/ui';

export default async function PostPage() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <SectionCards />
          <PostTable />
          <UserTable />
        </div>
      </div>
    </div>
  );
}
