import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { PortfolioOverlay } from './PortfolioOverlay';

type LoadingProgressBarProps = {
  isReversing?: boolean;
  onCloseComplete?: () => void;
};

export const LoadingProgressBar = ({ isReversing = false, onCloseComplete }: LoadingProgressBarProps) => {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [portfolioExiting, setPortfolioExiting] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const progressBarRef = useRef(null);
  const motionProgress = useMotionValue(0);
  const progressWidth = useTransform(motionProgress, (value) => `${value}%`);

  // motionValue 변화를 감지하여 display용 state 업데이트
  useMotionValueEvent(motionProgress, 'change', (latest) => {
    setDisplayProgress(Math.round(latest));
  });

  // isReversing이 변경될 때 초기 상태 설정
  useEffect(() => {
    if (isReversing) {
      // closing 시작: 100%부터 시작
      motionProgress.set(100);
      setDisplayProgress(100);
    } else {
      // opening 시작: 0%부터 시작
      motionProgress.set(0);
      setDisplayProgress(0);
    }
  }, [isReversing, motionProgress]);

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
        // closing 애니메이션 완료 후 콜백 실행 (카메라 리셋 등)
        onCloseComplete?.();
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center mb-6'>
                <h1 className='text-2xl font-semibold text-white'>{isReversing ? 'Closing...' : 'Loading...'}</h1>
              </motion.div>

              <div className='space-y-4'>
                <div className='w-full h-3 bg-white/20 rounded-full overflow-hidden'>
                  <motion.div ref={progressBarRef} className='h-full bg-white' style={{ width: progressWidth }} />
                </div>
              </div>

              <motion.div
                className='text-center mt-6'
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                <span className='text-lg font-medium text-white'>{displayProgress}%</span>
              </motion.div>

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
