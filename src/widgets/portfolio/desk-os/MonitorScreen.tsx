'use client';

import { Html } from '@react-three/drei';
import type { PointerEvent as ReactPointerEvent } from 'react';
import * as three from 'three';
import { CYBER_SCREEN, OS_PIXEL, SCREEN_SCALE } from './cyber-computer';
import { DesktopOs } from './os/DesktopOs';
import type { DeskCameraMode } from './types';
import { VOID } from './void-theme';

type MonitorScreenProps = {
  mode: DeskCameraMode;
  started: boolean;
  onEnterMonitor: () => void;
  onNavigate: (href: string) => void;
};

export const MonitorScreen = ({ mode, started, onEnterMonitor, onNavigate }: MonitorScreenProps) => {
  const canUseScreen = started && mode === 'monitor';

  const handleScreenPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!started || mode === 'monitor') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    onEnterMonitor();
  };

  return (
    <group
      position={CYBER_SCREEN.position}
      rotation={CYBER_SCREEN.rotation}
      scale={[SCREEN_SCALE.x, SCREEN_SCALE.y, 1]}
    >
      <mesh position={[0, 0, -4]}>
        <planeGeometry args={[OS_PIXEL.w, OS_PIXEL.h]} />
        <meshBasicMaterial
          color={VOID.cyan}
          transparent
          opacity={0.1}
          blending={three.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[OS_PIXEL.w, OS_PIXEL.h]} />
        <meshBasicMaterial color={VOID.osDesktop} toneMapped={false} />
        <Html
          transform
          distanceFactor={385}
          position={[0, 0, 8]}
          pointerEvents='auto'
          zIndexRange={[20, 0]}
          style={{ width: OS_PIXEL.w, height: OS_PIXEL.h }}
        >
          <div
            id='computer-screen'
            onPointerDownCapture={handleScreenPointerDown}
            style={{
              width: OS_PIXEL.w,
              height: OS_PIXEL.h,
              overflow: 'hidden',
              background: VOID.osDesktop,
              cursor: canUseScreen ? 'default' : 'pointer',
            }}
          >
            <DesktopOs interactive={canUseScreen} onNavigate={onNavigate} />
          </div>
        </Html>
      </mesh>
    </group>
  );
};
