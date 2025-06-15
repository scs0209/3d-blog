export function AboutBio({
  bio,
  sections,
}: { bio: string; sections: { key: string; label: string; content: string }[] }) {
  return (
    <div className='mt-4 p-4 rounded-xl bg-black/60 border border-cyan-800 shadow-lg neon-glow'>
      <p className='text-cyan-100 text-base mb-4 font-mono'>{bio}</p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {sections.map((section) => (
          <div key={section.key} className='p-3 rounded-lg bg-cyan-900/20 border border-cyan-700'>
            <div className='text-cyan-300 font-bold mb-1 neon-glow'>{section.label}</div>
            <div className='text-cyan-100 text-sm font-mono'>{section.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
