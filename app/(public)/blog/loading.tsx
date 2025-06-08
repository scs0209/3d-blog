export default function Loading() {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm z-50'>
      <div className='relative w-36 h-36 [perspective:800px] [transform-style:preserve-3d]'>
        {/* Core sphere */}
        <div
          className='absolute w-10 h-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full 
                   bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 
                   shadow-[0_0_25px_rgba(0,234,255,0.5)] 
                   [animation:pulse_2s_cubic-bezier(0.5,0,0.5,1)_infinite,spherePulse_2s_cubic-bezier(0.5,0,0.5,1)_infinite]
                   hover:bg-gradient-to-br hover:from-pink-400 hover:via-purple-500 hover:to-purple-600
                   hover:shadow-[0_0_35px_rgba(255,102,255,0.7)]'
        />

        {/* Ring 1 - 가장 큰 링 */}
        <div
          className='absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-cyan-400/70 rounded-full 
                   shadow-[0_0_15px_rgba(0,234,255,0.3)] [transform-style:preserve-3d]
                   [animation:rotateX_2.5s_cubic-bezier(0.65,0,0.35,1)_infinite]
                   hover:border-pink-400/70 hover:shadow-[0_0_20px_rgba(255,102,255,0.5)]'
        />

        {/* Ring 2 - 중간 링 */}
        <div
          className='absolute w-28 h-28 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-cyan-400/50 rounded-full 
                   shadow-[0_0_15px_rgba(0,234,255,0.3)] [transform-style:preserve-3d]
                   [animation:rotateY_2s_cubic-bezier(0.55,0,0.45,1)_infinite]
                   hover:border-pink-400/50 hover:shadow-[0_0_20px_rgba(255,102,255,0.5)]'
        />

        {/* Ring 3 - 작은 링 */}
        <div
          className='absolute w-20 h-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-cyan-400/30 rounded-full 
                   shadow-[0_0_15px_rgba(0,234,255,0.3)] [transform-style:preserve-3d]
                   [animation:rotateXY_3s_cubic-bezier(0.7,0,0.3,1)_infinite]
                   hover:border-pink-400/30 hover:shadow-[0_0_20px_rgba(255,102,255,0.5)]'
        />

        <style>
          {`
          @keyframes rotateX {
            0% { transform: translate(-50%, -50%) rotateX(0deg); }
            50% { transform: translate(-50%, -50%) rotateX(180deg); }
            100% { transform: translate(-50%, -50%) rotateX(360deg); }
          }
          
          @keyframes rotateY {
            0% { transform: translate(-50%, -50%) rotateY(0deg); }
            50% { transform: translate(-50%, -50%) rotateY(180deg); }
            100% { transform: translate(-50%, -50%) rotateY(360deg); }
          }
          
          @keyframes rotateXY {
            0% { transform: translate(-50%, -50%) rotateX(0deg) rotateY(0deg); }
            50% { transform: translate(-50%, -50%) rotateX(90deg) rotateY(180deg); }
            100% { transform: translate(-50%, -50%) rotateX(360deg) rotateY(360deg); }
          }
          
          @keyframes spherePulse {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              box-shadow: 0 0 25px rgba(0, 234, 255, 0.5);
            }
            50% {
              transform: translate(-50%, -50%) scale(1.1);
              box-shadow: 0 0 35px rgba(0, 234, 255, 0.7);
            }
          }
        `}
        </style>
      </div>
    </div>
  );
}
