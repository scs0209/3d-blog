import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate, useTransform, useMotionValueEvent } from 'framer-motion';
import { PortfolioOverlay } from './PortfolioOverlay';

type LoadingProgressBarProps = {
  isReversing?: boolean;
};

export const LoadingProgressBar = ({ isReversing = false }: LoadingProgressBarProps) => {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [portfolioExiting, setPortfolioExiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(isReversing ? 100 : 0);
  const progressBarRef = useRef(null);
  const motionProgress = useMotionValue(isReversing ? 100 : 0);
  const progressWidth = useTransform(motionProgress, (value) => `${value}%`);

  // motionValue 변화를 감지하여 display용 state 업데이트
  useMotionValueEvent(motionProgress, 'change', (latest) => {
    setDisplayProgress(Math.round(latest));
  });

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

    // LoadingProgressBar 역순 애니메이션을 useMotionValue와 animate로 처리
    const controls = animate(motionProgress, 0, {
      duration: 3, // 100% -> 0%까지 3초 (30ms * 100 / 1000)
      ease: 'linear',
      onComplete: () => {
        setIsComplete(true);
      },
    });

    return () => controls.stop();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isReversing) {
      // 정순 애니메이션을 useMotionValue와 animate로 처리
      const controls = animate(motionProgress, 100, {
        duration: 3, // 0% -> 100%까지 3초 (30ms * 100 / 1000)
        ease: 'linear',
        onComplete: () => {
          // setTimeout 대신 animate를 사용하여 딜레이 처리
          animate(0, 1, {
            duration: 0.3,
            onComplete: () => {
              setShowPortfolio(true);
            },
          });
        },
      });

      return () => controls.stop();
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
          className='fixed inset-0 z-overlay bg-transparent overflow-hidden'
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
                  <motion.div ref={progressBarRef} className='h-full bg-white' style={{ width: progressWidth }} />
                </div>
              </div>

              {/* 퍼센티지 표시 */}
              <motion.div
                className='text-center mt-6'
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                <span className='text-lg font-medium text-white'>{displayProgress}%</span>
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
