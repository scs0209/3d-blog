'use client';

interface LoadingOverlayProps {
  showWorksLoading: boolean;
  showPortfolioOverlay?: boolean;
  showExitLoading: boolean;
  loadingProgress: number;
  loadingBarFullExpand: boolean;
  exitLoadingProgress: number;
}

export function LoadingOverlay({
  showWorksLoading,
  showExitLoading,
  loadingProgress,
  loadingBarFullExpand,
  exitLoadingProgress,
}: LoadingOverlayProps) {
  return (
    <>
      {/* EXIT 로딩 오버레이 */}
      {showExitLoading && (
        <div className='fixed inset-0 z-[9999] pointer-events-none'>
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[20%] w-[400px] h-[300px] flex flex-col items-center justify-center gap-5 font-mono overflow-hidden text-white'>
            <div className='text-3xl text-white font-bold tracking-[4px] mb-2.5 neon-glow'>EXIT</div>

            <div className='w-80 h-3 bg-gray-800 rounded-md overflow-hidden border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-1000 ease-out'>
              <div
                className='h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded shadow-[0_0_25px_#00ffff] transition-[width] duration-100 ease-out'
                style={{ width: `${exitLoadingProgress}%` }}
              />
            </div>

            <div className='text-lg opacity-90 animate-pulse text-center'>Closing projects...</div>
          </div>
        </div>
      )}

      {/* WORKS 로딩 오버레이 */}
      {showWorksLoading && !showExitLoading && (
        <div className='fixed inset-0 z-40 pointer-events-none'>
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[20%] w-[400px] h-[300px] flex flex-col items-center justify-center gap-5 font-mono overflow-hidden text-white'>
            <div className='text-3xl text-white font-bold tracking-[4px] mb-2.5 neon-glow'>WORKS</div>

            <div
              className={`w-80 h-3 overflow-visible transition-all duration-[1500ms] ease-out origin-center ${
                loadingBarFullExpand
                  ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[20] z-[9998] bg-gradient-to-br from-cyan-400 to-blue-500'
                  : 'relative bg-gray-800 rounded-md border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)]'
              }`}
            >
              {!loadingBarFullExpand && (
                <div
                  className='h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded shadow-[0_0_25px_#00ffff] transition-[width] duration-100 ease-out'
                  style={{ width: `${loadingProgress}%` }}
                />
              )}
            </div>

            {!loadingBarFullExpand && loadingProgress < 100 && (
              <div className='text-lg opacity-90 animate-pulse text-center'>Loading projects...</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
