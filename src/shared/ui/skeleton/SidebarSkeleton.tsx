import { blogTheme } from '@/widgets/post/ui/blog-theme';

export const SidebarSkeleton = () => {
  return (
    <aside
      className={`relative z-10 hidden h-screen w-80 flex-shrink-0 flex-col gap-8 p-6 lg:flex ${blogTheme.sidebar}`}
      style={{ minWidth: 320 }}
      aria-busy='true'
      aria-label='사이드바 불러오는 중'
    >
      <div className={`relative rounded-xl px-3 py-2.5 ${blogTheme.card}`}>
        <span className={blogTheme.cardTopGlow} aria-hidden />
        <div className='flex flex-row items-end justify-center gap-5'>
          <div className='flex flex-col items-center'>
            <div className='mb-1.5 h-2.5 w-8 animate-pulse rounded bg-[#ff9a3c]/25 dark:bg-[#3de8ff]/25' />
            <div className='flex space-x-0.5'>
              {[0, 1, 2].map((i) => (
                <div
                  key={`visitor-today-${i}`}
                  className='h-7 w-5 animate-pulse rounded-md bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15'
                />
              ))}
            </div>
          </div>
          <div className='mb-3 h-8 w-px bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/15' aria-hidden />
          <div className='flex flex-col items-center'>
            <div className='mb-1.5 h-2.5 w-8 animate-pulse rounded bg-[#e878a0]/25 dark:bg-[#7ec8ff]/25' />
            <div className='flex space-x-0.5'>
              {[0, 1, 2].map((i) => (
                <div
                  key={`visitor-total-${i}`}
                  className='h-7 w-5 animate-pulse rounded-md bg-[#c878ff]/15 dark:bg-[#6366f1]/15'
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className='mb-3 h-4 w-24 animate-pulse rounded bg-[#ff9a3c]/25 dark:bg-[#3de8ff]/25' />
        <nav className='flex flex-col gap-2'>
          <div className='h-8 animate-pulse rounded-lg bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={`sidebar-category-${i}`}
              className='h-8 animate-pulse rounded-lg bg-[#ff9a3c]/12 dark:bg-[#3de8ff]/12'
            />
          ))}
        </nav>
      </div>

      <div>
        <div className='mb-2 h-4 w-16 animate-pulse rounded bg-[#ff9a3c]/25 dark:bg-[#3de8ff]/25' />
        <div className='flex flex-wrap gap-2'>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={`sidebar-tag-${i}`}
              className='h-6 w-16 animate-pulse rounded-full bg-[#e878a0]/15 dark:bg-[#7ec8ff]/15'
            />
          ))}
        </div>
      </div>
    </aside>
  );
};
