import { blogTheme } from '@/widgets/post/ui/blog-theme';

export const PostCardSkeleton = () => {
  return (
    <div className='relative block h-full w-full p-2' aria-hidden>
      <div className={`h-full rounded-3xl p-4 ${blogTheme.card}`}>
        <span className={blogTheme.cardTopGlow} />
        <div className='mb-3 h-4 animate-pulse rounded bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/20' />
        <div className='mb-2 h-3 w-3/4 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
        <div className='mb-3 h-3 w-1/3 animate-pulse rounded bg-[#e878a0]/20 dark:bg-[#7ec8ff]/20' />
        <div className='mb-3 h-3 w-1/2 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
        <div className='space-y-2'>
          <div className='h-3 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
          <div className='h-3 w-5/6 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
          <div className='h-3 w-4/6 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
        </div>
      </div>
    </div>
  );
};
