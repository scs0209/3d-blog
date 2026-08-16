'use client';

import { useFBX, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Suspense, useCallback, useEffect, useState } from 'react';
import * as three from 'three';
import { PORTFOLIO_PORTAL_SESSION_KEY } from '@/entities/portfolio/model/cinematic-transition';
import { CanvasLoader } from '@/shared/ui';
import { PortalDiscoveryOverlay, PortalEnterTransition } from '@/widgets/home';
import type { CosmosPortalId } from '@/widgets/home/model/cosmos-portals';
import { CinematicCosmosScene, type CosmosSceneTheme } from '@/widgets/home/ui/CinematicCosmosScene';

export const HomeCanvas = () => {
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [activePortalId, setActivePortalId] = useState<CosmosPortalId | null>(null);
  const [enteringPortfolio, setEnteringPortfolio] = useState(false);
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

  const handleEnterPortfolio = useCallback(() => {
    setEnteringPortfolio(true);
  }, []);

  const handleEnterComplete = useCallback(() => {
    sessionStorage.setItem(PORTFOLIO_PORTAL_SESSION_KEY, '1');
    router.push('/portfolio');
  }, [router]);

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
            <CinematicCosmosScene
              theme={sceneTheme}
              onActivePortalChange={setActivePortalId}
              enteringPortfolio={enteringPortfolio}
              onWalkThroughPortfolio={handleEnterPortfolio}
            />
          </Suspense>
        </Canvas>
      </div>

      <PortalDiscoveryOverlay
        activePortalId={activePortalId}
        enteringPortfolio={enteringPortfolio}
        onEnterPortfolio={handleEnterPortfolio}
      />
      <PortalEnterTransition active={enteringPortfolio} onComplete={handleEnterComplete} />
    </>
  );
};
