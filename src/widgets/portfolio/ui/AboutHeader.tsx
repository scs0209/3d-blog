export function AboutHeader({ name, title }: { name: string; title: string }) {
  return (
    <div className='flex flex-col gap-2'>
      <span className='text-cyan-400 font-bold tracking-widest text-lg neon-glow'>{title}</span>
      <div className='flex gap-4 mt-4'>
        {['Quick Bio', 'Background', 'Current Focus', 'Hobbies'].map((tab) => (
          <span
            key={tab}
            className='px-3 py-1 rounded-full border border-cyan-400 text-cyan-200 text-sm font-mono neon-glow cursor-pointer hover:bg-cyan-900/30 transition'
          >
            {tab}
          </span>
        ))}
      </div>
    </div>
  );
}
