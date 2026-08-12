import { blogTheme } from '@/widgets/post/ui/blog-theme';

export default function PostDetailLoading() {
  return (
    <div className='mx-4 mb-12 mt-4 max-w-4xl lg:mx-auto' aria-busy='true'>
      <section className={`relative overflow-hidden px-4 py-8 sm:px-6 md:rounded-2xl md:px-8 ${blogTheme.postSection}`}>
        <span className={blogTheme.cardTopGlow} aria-hidden />
        <div className='space-y-4'>
          <div className='h-9 w-3/4 max-w-xl animate-pulse rounded-lg bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/20' />
          <div className='flex items-center gap-3'>
            <div className='h-3 w-20 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
            <div className='h-3 w-24 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
            <div className='h-3 w-16 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
          </div>
          <div className='flex flex-wrap gap-2 pt-2'>
            <div className='h-6 w-14 animate-pulse rounded-full bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/20' />
            <div className='h-6 w-16 animate-pulse rounded-full bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/20' />
            <div className='h-6 w-12 animate-pulse rounded-full bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/20' />
          </div>
          <div className={`mt-6 space-y-3 p-4 ${blogTheme.summaryBox}`}>
            <div className='h-4 w-24 animate-pulse rounded bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/20' />
            <div className='h-3 w-full animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
            <div className='h-3 w-5/6 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15' />
          </div>
          <div className='mt-8 space-y-3'>
            {['w88-1', 'w76-1', 'w64-1', 'w52-1', 'w88-2', 'w76-2', 'w64-2', 'w52-2'].map((id) => {
              const width = Number(id.slice(1, 3));
              return (
                <div
                  key={id}
                  className='h-4 animate-pulse rounded bg-[#ff9a3c]/15 dark:bg-[#3de8ff]/15'
                  style={{ width: `${width}%` }}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
