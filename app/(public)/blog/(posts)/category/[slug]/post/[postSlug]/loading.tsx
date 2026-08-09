export default function PostDetailLoading() {
  return (
    <div
      className='max-w-4xl mx-4 lg:mx-auto mt-4 mb-12'
      aria-busy='true'
      aria-label='포스트 불러오는 중'
    >
      <section className='relative md:bg-gradient-to-br md:from-[#181c2a]/90 md:via-[#232946]/90 md:to-[#232946]/80 md:border md:border-blue-400/30 md:rounded-2xl md:shadow-[0_0_24px_4px_#7dd3fc22] px-4 sm:px-6 md:px-8 py-8 overflow-hidden'>
        <div className='space-y-4'>
          <div className='h-9 w-3/4 max-w-xl rounded-lg bg-blue-400/20 animate-pulse' />
          <div className='flex items-center gap-3'>
            <div className='h-3 w-20 rounded bg-blue-400/15 animate-pulse' />
            <div className='h-3 w-24 rounded bg-blue-400/15 animate-pulse' />
            <div className='h-3 w-16 rounded bg-blue-400/15 animate-pulse' />
          </div>
          <div className='flex flex-wrap gap-2 pt-2'>
            <div className='h-6 w-14 rounded-full bg-blue-500/20 animate-pulse' />
            <div className='h-6 w-16 rounded-full bg-blue-500/20 animate-pulse' />
            <div className='h-6 w-12 rounded-full bg-blue-500/20 animate-pulse' />
          </div>
          <div className='mt-6 space-y-3 rounded-xl border border-blue-400/20 bg-[#181c2a]/40 p-4'>
            <div className='h-4 w-24 rounded bg-cyan-400/20 animate-pulse' />
            <div className='h-3 w-full rounded bg-blue-400/15 animate-pulse' />
            <div className='h-3 w-5/6 rounded bg-blue-400/15 animate-pulse' />
          </div>
          <div className='mt-8 space-y-3'>
            {['w88-1', 'w76-1', 'w64-1', 'w52-1', 'w88-2', 'w76-2', 'w64-2', 'w52-2'].map((id) => {
              const width = Number(id.slice(1, 3));
              return (
                <div
                  key={id}
                  className='h-4 rounded bg-blue-400/15 animate-pulse'
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
