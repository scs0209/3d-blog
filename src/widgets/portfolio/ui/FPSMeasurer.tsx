import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

type FPSMeasurerProps = {
  onFpsUpdate: (fps: number) => void;
};

export const FPSMeasurer = ({ onFpsUpdate }: FPSMeasurerProps) => {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useFrame(() => {
    frameCountRef.current++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;

    // 매 0.5초마다 FPS 업데이트
    if (deltaTime >= 500) {
      const currentFps = Math.round((frameCountRef.current * 1000) / deltaTime);
      onFpsUpdate(currentFps);
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }
  });

  // 이 컴포넌트는 렌더링되지 않음 (측정만 함)
  return null;
};
