'use client';

import { useFBX, useGLTF, useTexture } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Suspense, useCallback, useEffect, useState } from 'react';
import * as three from 'three';
import { PORTFOLIO_PORTAL_SESSION_KEY } from '@/entities/portfolio/model/cinematic-transition';
import { useViewportProfile } from '@/shared/hooks/use-viewport-profile';
import { CanvasLoader } from '@/shared/ui/Loader';
import type { CosmosPortalId } from '@/widgets/home/model/cosmos-portals';
import { CinematicCosmosScene, type CosmosSceneTheme } from '@/widgets/home/ui/CinematicCosmosScene';
import { MobileWalkControls } from '@/widgets/home/ui/MobileWalkControls';
import { PortalDiscoveryOverlay } from '@/widgets/home/ui/PortalDiscoveryOverlay';
import { PortalEnterTransition } from '@/widgets/home/ui/PortalEnterTransition';

export const HomeCanvas = () => {
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const { isMobile, isPortrait } = useViewportProfile();
  const [activePortalId, setActivePortalId] = useState<CosmosPortalId | null>(null);
  const [enteringPortfolio, setEnteringPortfolio] = useState(false);
  const sceneTheme: CosmosSceneTheme = (resolvedTheme ?? theme) === 'dark' ? 'dark' : 'light';

  const cameraFov = isMobile ? (isPortrait ? 50 : 42) : 36;
  const cameraPosition: [number, number, number] = isMobile
    ? isPortrait
      ? [2.8, 3.5, 11.5]
      : [4.5, 2.4, 13.5]
    : [5.5, 2.1, 14];

  useEffect(() => {
    const timer = setTimeout(() => {
      useGLTF.preload('/WalkingAstro.glb');
      useFBX.preload('/snp.fbx');
      useFBX.preload('/Typing.fbx');
      useTexture.preload('/cosmos/textures/dark_rock_diff_2k.jpg');
      useTexture.preload('/cosmos/textures/dark_rock_nor_2k.jpg');
      useTexture.preload('/cosmos/textures/dark_rock_rough_2k.jpg');
      useTexture.preload('/cosmos/textures/earth_black_marble.jpg');
      useTexture.preload('/cosmos/textures/earth_day_hq.jpg');
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
          dpr={isMobile ? [1, 1.25] : [1, 1.75]}
          gl={{
            antialias: true,
            toneMapping: three.ACESFilmicToneMapping,
            toneMappingExposure: 0.88,
          }}
          camera={{ fov: cameraFov, near: 0.1, far: 500, position: cameraPosition }}
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

      <MobileWalkControls />
      <PortalDiscoveryOverlay
        activePortalId={activePortalId}
        enteringPortfolio={enteringPortfolio}
        onEnterPortfolio={handleEnterPortfolio}
      />
      <PortalEnterTransition active={enteringPortfolio} onComplete={handleEnterComplete} />
    </>
  );
};
