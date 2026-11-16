import { blogTheme } from '@/widgets/post/ui/blog-theme';

const BAR = 'animate-pulse bg-white/[0.07]';

export const SidebarSkeleton = () => {
  return (
    <aside
      className={`relative z-10 hidden h-screen w-80 flex-shrink-0 flex-col p-6 lg:flex ${blogTheme.sidebar}`}
      style={{ minWidth: 320 }}
      aria-busy='true'
      aria-label='사이드바 불러오는 중'
    >
      <div className='mb-8 grid grid-cols-2 gap-2'>
        {['today', 'total'].map((id) => (
          <div key={id} className='rounded-lg bg-white/[0.045] px-4 py-3'>
            <div className={`h-2.5 w-10 ${BAR}`} />
            <div className={`mt-2.5 h-5 w-14 ${BAR}`} />
          </div>
        ))}
      </div>
      <div className={`mb-4 h-2.5 w-20 ${BAR}`} />
      <div className='mb-8 space-y-2.5'>
        {['a', 'b', 'c', 'd', 'e'].map((id) => (
          <div key={id} className={`h-6 ${BAR}`} />
        ))}
      </div>
      <div className={`mb-4 h-2.5 w-12 ${BAR}`} />
      <div className='flex flex-wrap gap-2'>
        {['a', 'b', 'c', 'd', 'e', 'f'].map((id) => (
          <div key={id} className={`h-6 w-16 ${BAR}`} />
        ))}
      </div>
    </aside>
  );
};
