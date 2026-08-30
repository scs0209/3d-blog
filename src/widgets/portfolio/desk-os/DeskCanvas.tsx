'use client';

import { useFBX, useGLTF, useProgress, useTexture } from '@react-three/drei';
import { DESK_TYPIST_CLIPS } from './desk-typist-clips';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import * as three from 'three';
import { useViewportProfile } from '@/shared/hooks/use-viewport-profile';
import { DeskCamera } from './DeskCamera';
import { DeskScene } from './DeskScene';
import type { DeskCameraMode } from './types';

type DeskCanvasProps = {
  mode: DeskCameraMode;
  started: boolean;
  freeCam: boolean;
  exiting: boolean;
  exitProgress: number;
  onProgress: (progress: number) => void;
  onModeChange: (mode: DeskCameraMode) => void;
  onNavigate: (href: string) => void;
};

const ProgressBridge = ({ onProgress }: { onProgress: (progress: number) => void }) => {
  const { progress } = useProgress();

  useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);

  return null;
};

export const DeskCanvas = ({
  mode,
  started,
  freeCam,
  exiting,
  exitProgress,
  onProgress,
  onModeChange,
  onNavigate,
}: DeskCanvasProps) => {
  const { isMobile } = useViewportProfile();
  const handleEnterMonitor = () => {
    onModeChange('monitor');
  };

  return (
    <Canvas
      shadows={false}
      dpr={isMobile ? [1, 1.25] : [1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        outputColorSpace: three.SRGBColorSpace,
        toneMapping: three.NoToneMapping,
      }}
      camera={{ fov: 35, near: 10, far: 900000, position: [-35000, 35000, 35000] }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'auto' }}
    >
      <ProgressBridge onProgress={onProgress} />
      <DeskCamera mode={mode} started={started} freeCam={freeCam} exiting={exiting} />
      <Suspense fallback={null}>
        <DeskScene
          mode={mode}
          started={started}
          exiting={exiting}
          exitProgress={exitProgress}
          onEnterMonitor={handleEnterMonitor}
          onNavigate={onNavigate}
        />
      </Suspense>
    </Canvas>
  );
};

useGLTF.preload('/Typing.glb');
useFBX.preload(DESK_TYPIST_CLIPS.sitToStand);
useFBX.preload(DESK_TYPIST_CLIPS.walk);
useGLTF.preload('/desk-os/world/environment.glb');
useGLTF.preload('/desk-os/decor/decor.glb');
useGLTF.preload('/desk-os/furniture/desk.glb');
useGLTF.preload('/desk-os/computer/desk-pc.glb');
useTexture.preload('/desk-os/world/baked_environment.jpg');
useTexture.preload('/desk-os/decor/baked_decor_modified.jpg');
useTexture.preload('/desk-os/computer/desk-pc.png');
