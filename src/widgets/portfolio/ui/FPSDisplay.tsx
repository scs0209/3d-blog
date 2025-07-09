type FPSDisplayProps = {
  fps: number;
};

export const FPSDisplay = ({ fps }: FPSDisplayProps) => {
  // FPS에 따른 색상 결정
  const getFpsColor = (fps: number) => {
    if (fps >= 60) {
      return 'text-emerald-400';
    }
    if (fps >= 30) {
      return 'text-amber-400';
    }
    return 'text-red-400';
  };

  const getProgressColor = (fps: number) => {
    if (fps >= 60) {
      return 'from-emerald-500 to-green-400';
    }
    if (fps >= 30) {
      return 'from-amber-500 to-yellow-400';
    }
    return 'from-red-500 to-red-400';
  };

  return (
    <div className='fixed top-5 right-5 z-[9999] pointer-events-none'>
      <div className='bg-gray-900/95 backdrop-blur-lg border border-pink-500/30 rounded-lg px-4 py-3 shadow-xl shadow-pink-500/10 min-w-[100px]'>
        {/* FPS 텍스트 */}
        <div className='flex items-center justify-between mb-2'>
          <span className='text-pink-300 text-xs font-mono font-medium tracking-wide'>FPS</span>
          <span className={`${getFpsColor(fps)} text-lg font-mono font-bold`}>{fps}</span>
        </div>

        {/* 프로그래스바 */}
        <div className='w-full h-1 bg-gray-700/60 rounded-full overflow-hidden'>
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor(fps)} transition-all duration-300 ease-out shadow-sm`}
            style={{
              width: `${Math.min((fps / 60) * 100, 100)}%`,
              boxShadow:
                fps >= 60
                  ? '0 0 4px rgba(34, 197, 94, 0.4)'
                  : fps >= 30
                    ? '0 0 4px rgba(245, 158, 11, 0.4)'
                    : '0 0 4px rgba(239, 68, 68, 0.4)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
