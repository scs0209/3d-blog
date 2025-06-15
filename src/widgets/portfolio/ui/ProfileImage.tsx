export function ProfileImage({ src }: { src: string }) {
  return (
    <div className='w-40 h-40 rounded-full border-4 border-cyan-400 shadow-xl neon-glow flex items-center justify-center bg-black/80 overflow-hidden'>
      {src ? (
        <img src={src} alt='profile' className='w-full h-full object-cover' />
      ) : (
        <div className='w-32 h-32 rounded-full bg-cyan-900/40 flex items-center justify-center'>
          <span className='text-cyan-200 text-4xl font-bold'>?</span>
        </div>
      )}
    </div>
  );
}
