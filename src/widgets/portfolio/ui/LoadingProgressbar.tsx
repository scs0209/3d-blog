import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const LoadingProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExpanded(true);
          }, 100);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleRestart = () => {
    setProgress(0);
    setIsExpanded(false);
  };

  return (
    <div className='relative min-h-screen bg-gray-100 overflow-hidden'>
      {/* 확장되는 검정 화면 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isExpanded ? 100 : 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className='absolute top-1/2 left-1/2 w-4 h-4 bg-black origin-center'
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* 완료 메시지 */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className='absolute inset-0 z-50 flex items-center justify-center'
        >
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-white mb-4'>완료!</h2>
            <button
              type='button'
              onClick={handleRestart}
              className='px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors'
            >
              다시 로딩하기
            </button>
          </div>
        </motion.div>
      )}

      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div className='w-80 p-8'>
          {/* Loading 텍스트 */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center mb-6'>
            <h1 className='text-2xl font-semibold text-gray-700'>Loading...</h1>
          </motion.div>

          {/* 프로그래스바 컨테이너 */}
          <div className='space-y-4'>
            <div className='w-full h-3 bg-gray-300 rounded-full overflow-hidden'>
              <motion.div
                ref={progressBarRef}
                className='h-full bg-black'
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
          </div>

          {/* 퍼센티지 표시 */}
          <motion.div
            className='text-center mt-6'
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          >
            <span className='text-lg font-medium text-gray-700'>{progress}%</span>
          </motion.div>

          {/* 로딩 도트 애니메이션 */}
          <div className='flex justify-center space-x-1 mt-4'>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className='w-2 h-2 bg-black rounded-full'
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
