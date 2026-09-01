import { adminTheme } from './admin-theme';
import { adminFormTheme } from './admin-form-theme';

const Pulse = ({ className }: { className: string }) => (
  <div className={`${adminFormTheme.skeletonPulse} ${className}`} />
);

const TABLE_ROW_IDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

export const AdminCardSkeleton = () => {
  return (
    <div className={adminTheme.card}>
      <span className={adminTheme.cardTopGlow} aria-hidden />
      <div className='space-y-3 p-6'>
        <Pulse className='h-3 w-16' />
        <Pulse className='h-8 w-24' />
        <Pulse className='h-4 w-32' />
      </div>
    </div>
  );
};

export const AdminTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className={adminTheme.tableWrap}>
      <div className='space-y-3 p-4'>
        <Pulse className='h-8 w-full' />
        {TABLE_ROW_IDS.slice(0, rows).map((id) => (
          <Pulse key={`admin-table-row-${id}`} className='h-12 w-full' />
        ))}
      </div>
    </div>
  );
};

export const AdminPageSkeleton = () => {
  return (
    <div
      className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'
      role='status'
      aria-live='polite'
      aria-label='페이지를 불러오는 중'
    >
      <div className='grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6'>
        {['a', 'b', 'c', 'd'].map((id) => (
          <AdminCardSkeleton key={`admin-card-skeleton-${id}`} />
        ))}
      </div>
      <AdminTableSkeleton />
      <AdminTableSkeleton rows={4} />
    </div>
  );
};

export const AdminFormSkeleton = () => {
  return (
    <div className='mx-auto max-w-5xl space-y-4 pb-8' role='status' aria-live='polite' aria-label='폼을 불러오는 중'>
      <Pulse className='h-5 w-64' />
      <div className={`space-y-4 p-6 ${adminTheme.surface}`}>
        <Pulse className='h-12 w-full' />
        <div className='grid gap-4 sm:grid-cols-2'>
          <Pulse className='h-10 w-full' />
          <Pulse className='h-10 w-full' />
        </div>
        <Pulse className='h-[280px] w-full' />
      </div>
    </div>
  );
};
