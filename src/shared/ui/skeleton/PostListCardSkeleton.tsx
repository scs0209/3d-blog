import { blogTheme } from '@/widgets/post/ui/blog-theme';

export const PostListCardSkeleton = () => {
  return (
    <div className={`relative rounded-2xl p-6 ${blogTheme.card}`} aria-hidden>
      <span className={blogTheme.cardTopGlow} />
      <div className='flex flex-col gap-6 lg:flex-row'>
        <div className='flex-1 space-y-4'>
          <div className='h-6 animate-pulse rounded bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/20' />
          <div className='h-5 w-4/5 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />

          <div className='flex items-center gap-4 text-sm'>
            <div className='h-4 w-16 animate-pulse rounded bg-[#e878a0]/20 dark:bg-[#7ec8ff]/20' />
            <div className='h-4 w-24 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
            <div className='h-4 w-20 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
          </div>

          <div className='space-y-2'>
            <div className='h-4 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
            <div className='h-4 w-5/6 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
            <div className='h-4 w-4/6 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
            <div className='h-4 w-3/4 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
          </div>

          <div className='flex gap-2'>
            <div className='h-6 w-16 animate-pulse rounded-full bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/20' />
            <div className='h-6 w-20 animate-pulse rounded-full bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/20' />
            <div className='h-6 w-14 animate-pulse rounded-full bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/20' />
          </div>
        </div>

        <div className='hidden h-32 w-48 animate-pulse rounded-xl bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15 lg:block' />
      </div>
    </div>
  );
};
