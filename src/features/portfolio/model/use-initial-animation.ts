import { useState, useEffect } from 'react';

type InitialAnimationStep = 'intro' | 'holotable-animation' | 'shrink-and-move' | 'show-others' | 'complete';

export const useInitialAnimation = () => {
  const [currentStep, setCurrentStep] = useState<InitialAnimationStep>('intro');
  const [holoTableScale, setHoloTableScale] = useState(2.5); // 화면을 꽉 채우는 크기
  const [holoTablePosition, setHoloTablePosition] = useState<[number, number, number]>([0, 0, 0]);
  const [showOtherModels, setShowOtherModels] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // 초기 애니메이션 시퀀스 실행
  useEffect(() => {
    if (currentStep === 'intro') {
      // 잠시 대기 후 HoloTable 애니메이션 시작
      const timer = setTimeout(() => {
        setCurrentStep('holotable-animation');
      }, 500);
      return () => clearTimeout(timer);
    }

    if (currentStep === 'holotable-animation') {
      // HoloTable 내장 애니메이션이 실행되는 시간 (약 3초 가정)
      const timer = setTimeout(() => {
        setCurrentStep('shrink-and-move');
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (currentStep === 'shrink-and-move') {
      // 크기 축소 및 위치 이동 애니메이션
      const duration = 1500; // 1.5초
      const startTime = Date.now();
      const startScale = 2.5;
      const endScale = 0.3;
      const startPosition: [number, number, number] = [0, 0, 0];
      const endPosition: [number, number, number] = [0, 0.4, 0];

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeInOutCubic 이징 함수 적용
        const easedProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - (-2 * progress + 2) ** 3 / 2;

        // Scale 애니메이션
        const currentScale = startScale + (endScale - startScale) * easedProgress;
        setHoloTableScale(currentScale);

        // Position 애니메이션
        const currentPosition: [number, number, number] = [
          startPosition[0] + (endPosition[0] - startPosition[0]) * easedProgress,
          startPosition[1] + (endPosition[1] - startPosition[1]) * easedProgress,
          startPosition[2] + (endPosition[2] - startPosition[2]) * easedProgress,
        ];
        setHoloTablePosition(currentPosition);

        setAnimationProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentStep('show-others');
        }
      };

      requestAnimationFrame(animate);
    }

    if (currentStep === 'show-others') {
      // 다른 모델들 등장
      setShowOtherModels(true);
      const timer = setTimeout(() => {
        setCurrentStep('complete');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const resetAnimation = () => {
    setCurrentStep('intro');
    setHoloTableScale(2.5);
    setHoloTablePosition([0, 0, 0]);
    setShowOtherModels(false);
    setAnimationProgress(0);
  };

  const skipAnimation = () => {
    setCurrentStep('complete');
    setHoloTableScale(0.3);
    setHoloTablePosition([0, 0.4, 0]);
    setShowOtherModels(true);
    setAnimationProgress(1);
  };

  return {
    // State
    currentStep,
    holoTableScale,
    holoTablePosition,
    showOtherModels,
    animationProgress,
    isAnimationComplete: currentStep === 'complete',
    // Actions
    resetAnimation,
    skipAnimation,
  };
};
