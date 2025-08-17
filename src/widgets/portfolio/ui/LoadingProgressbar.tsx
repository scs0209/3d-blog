import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioOverlay } from './PortfolioOverlay';

type LoadingProgressBarProps = {
  isReversing?: boolean;
};

export const LoadingProgressBar = ({ isReversing = false }: LoadingProgressBarProps) => {
  const [progress, setProgress] = useState(isReversing ? 100 : 0);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [portfolioExiting, setPortfolioExiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const progressBarRef = useRef(null);

  // 역순 애니메이션 처리
  useEffect(() => {
    if (isReversing && showPortfolio) {
      // 먼저 PortfolioOverlay를 닫기 시작
      setPortfolioExiting(true);
    }
  }, [isReversing, showPortfolio]);

  // PortfolioOverlay 닫힘 완료 후 LoadingProgressBar 역순 애니메이션 시작
  const handlePortfolioExitComplete = () => {
    setShowPortfolio(false);
    setPortfolioExiting(false);

    // LoadingProgressBar 역순 애니메이션 시작
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setIsComplete(true);
          return 0;
        }
        return prev - 2;
      });
    }, 30);
  };

  useEffect(() => {
    if (!isReversing) {
      // 정순 애니메이션
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowPortfolio(true);
            }, 300);
            return 100;
          }
          return prev + 1;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isReversing]);

  // 완료되면 아무것도 렌더링하지 않음
  if (isComplete) {
    return null;
  }

  return (
    <AnimatePresence mode='wait'>
      {!showPortfolio ? (
        <motion.div
          key='loading-page'
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className='fixed inset-0 z-overlay bg-black/50 backdrop-blur-sm overflow-hidden'
        >
          <div className='flex flex-col items-center justify-center min-h-screen'>
            <div className='w-80 p-8'>
              {/* Loading 텍스트 */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center mb-6'>
                <h1 className='text-2xl font-semibold text-white'>{isReversing ? 'Closing...' : 'Loading...'}</h1>
              </motion.div>

              {/* 프로그래스바 컨테이너 */}
              <div className='space-y-4'>
                <div className='w-full h-3 bg-white/20 rounded-full overflow-hidden'>
                  <motion.div
                    ref={progressBarRef}
                    className='h-full bg-white'
                    initial={{ width: isReversing ? '100%' : 0 }}
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
                <span className='text-lg font-medium text-white'>{progress}%</span>
              </motion.div>

              {/* 로딩 도트 애니메이션 */}
              <div className='flex justify-center space-x-1 mt-4'>
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className='w-2 h-2 bg-white rounded-full'
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
        </motion.div>
      ) : (
        <PortfolioOverlay key='portfolio' isExiting={portfolioExiting} onExitComplete={handlePortfolioExitComplete} />
      )}
    </AnimatePresence>
  );
};
