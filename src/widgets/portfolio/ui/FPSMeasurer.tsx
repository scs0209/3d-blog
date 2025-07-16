import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFPS } from './FPSContext';

export const FPSMeasurer = () => {
  const { updateFps } = useFPS();
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const lastFpsRef = useRef(60);

  useFrame(() => {
    frameCountRef.current++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;

    // 매 1초마다 FPS 업데이트 (0.5초에서 1초로 변경)
    if (deltaTime >= 1000) {
      const currentFps = Math.round((frameCountRef.current * 1000) / deltaTime);

      // FPS가 5 이상 변경되었을 때만 업데이트 (불필요한 리렌더링 방지)
      if (Math.abs(currentFps - lastFpsRef.current) >= 5) {
        updateFps(currentFps);
        lastFpsRef.current = currentFps;
      }

      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }
  });

  // 이 컴포넌트는 렌더링되지 않음 (측정만 함)
  return null;
};
