import { useMemo, memo } from 'react';
import { useFPS } from './FPSContext';

const FPSDisplayComponent = () => {
  const { fps } = useFPS();

  // FPS에 따른 색상 결정 - useMemo로 메모이제이션
  const { fpsColor, progressColor, progressWidth, boxShadow } = useMemo(() => {
    let fpsColor: string;
    let progressColor: string;
    let boxShadow: string;

    if (fps >= 60) {
      fpsColor = 'text-emerald-400';
      progressColor = 'from-emerald-500 to-green-400';
      boxShadow = '0 0 4px rgba(34, 197, 94, 0.4)';
    } else if (fps >= 30) {
      fpsColor = 'text-amber-400';
      progressColor = 'from-amber-500 to-yellow-400';
      boxShadow = '0 0 4px rgba(245, 158, 11, 0.4)';
    } else {
      fpsColor = 'text-red-400';
      progressColor = 'from-red-500 to-red-400';
      boxShadow = '0 0 4px rgba(239, 68, 68, 0.4)';
    }

    const progressWidth = `${Math.min((fps / 60) * 100, 100)}%`;

    return { fpsColor, progressColor, progressWidth, boxShadow };
  }, [fps]);

  return (
    <div className='fixed top-5 right-5 z-[9999] pointer-events-none'>
      <div className='border border-[#E5D6C4]/20 rounded-lg px-4 py-3 shadow-lg shadow-[#E5D6C4]/5 min-w-[100px]'>
        {/* FPS 텍스트 */}
        <div className='flex items-center justify-between mb-2'>
          <span className='text-[#E5D6C4] text-xs font-mono font-medium tracking-wide'>FPS</span>
          <span className={`${fpsColor} text-lg font-mono font-bold`}>{fps}</span>
        </div>

        {/* 프로그래스바 */}
        <div className='w-full h-1 bg-gray-700/60 rounded-full overflow-hidden'>
          <div
            className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-300 ease-out shadow-sm`}
            style={{
              width: progressWidth,
              boxShadow,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// React.memo로 메모이제이션하여 불필요한 리렌더링 방지
export const FPSDisplay = memo(FPSDisplayComponent);
