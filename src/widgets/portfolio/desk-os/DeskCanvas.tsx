'use client';

import { useGLTF, useProgress, useTexture } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import * as three from 'three';
import { DeskCamera } from './DeskCamera';
import { DeskScene } from './DeskScene';
import type { DeskCameraMode } from './types';

type DeskCanvasProps = {
  mode: DeskCameraMode;
  started: boolean;
  freeCam: boolean;
  onProgress: (progress: number) => void;
  onModeChange: (mode: DeskCameraMode) => void;
};

const ProgressBridge = ({ onProgress }: { onProgress: (progress: number) => void }) => {
  const { progress } = useProgress();

  useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);

  return null;
};

export const DeskCanvas = ({ mode, started, freeCam, onProgress, onModeChange }: DeskCanvasProps) => {
  const handleEnterMonitor = () => {
    onModeChange('monitor');
  };

  return (
    <Canvas
      shadows={false}
      dpr={[1, 2]}
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
      <DeskCamera mode={mode} started={started} freeCam={freeCam} />
      <Suspense fallback={null}>
        <DeskScene mode={mode} started={started} onEnterMonitor={handleEnterMonitor} />
      </Suspense>
    </Canvas>
  );
};

useGLTF.preload('/Typing.glb');
useGLTF.preload('/desk-os/world/environment.glb');
useGLTF.preload('/desk-os/decor/decor.glb');
useGLTF.preload('/desk-os/furniture/desk.glb');
useGLTF.preload('/desk-os/computer/desk-pc.glb');
useTexture.preload('/desk-os/world/baked_environment.jpg');
useTexture.preload('/desk-os/decor/baked_decor_modified.jpg');
useTexture.preload('/desk-os/computer/desk-pc.png');
