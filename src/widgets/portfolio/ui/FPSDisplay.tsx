type FPSDisplayProps = {
  fps: number;
};

export const FPSDisplay = ({ fps }: FPSDisplayProps) => {
  return (
    <div className='fixed top-5 right-5 z-[9999] pointer-events-none'>
      <div className='bg-gray-900/80 backdrop-blur-sm text-cyan-300 px-3 py-2 rounded border border-cyan-400/50 font-mono text-sm shadow-lg'>
        <div className='flex items-center gap-2'>
          <span className='text-cyan-500 text-xs font-bold'>FPS</span>
          <span className='text-cyan-300 text-lg font-bold'>{fps}</span>
        </div>
      </div>
    </div>
  );
};
