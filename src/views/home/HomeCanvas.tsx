'use client';

import { useFBX, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import { Suspense, useEffect, useState } from 'react';
import * as three from 'three';
import { CanvasLoader } from '@/shared/ui';
import { CinematicCosmosScene, PortalDiscoveryOverlay, type CosmosSceneTheme } from '@/widgets/home';
import type { CosmosPortalId } from '@/widgets/home/model/cosmos-portals';

export const HomeCanvas = () => {
  const { theme, resolvedTheme } = useTheme();
  const [activePortalId, setActivePortalId] = useState<CosmosPortalId | null>(null);
  const sceneTheme: CosmosSceneTheme = (resolvedTheme ?? theme) === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    const timer = setTimeout(() => {
      useGLTF.preload('/WalkingAstro.glb');
      useFBX.preload('/snp.fbx');
      useFBX.preload('/Typing.fbx');
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className='absolute inset-0'>
        <Canvas
          shadows
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            toneMapping: three.ACESFilmicToneMapping,
            toneMappingExposure: 0.88,
          }}
          camera={{ fov: 36, near: 0.1, far: 500, position: [5.5, 2.1, 14] }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <CinematicCosmosScene theme={sceneTheme} onActivePortalChange={setActivePortalId} />
          </Suspense>
        </Canvas>
      </div>

      <PortalDiscoveryOverlay activePortalId={activePortalId} />
    </>
  );
};
