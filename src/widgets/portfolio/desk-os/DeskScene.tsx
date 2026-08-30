'use client';

import { useViewportProfile } from '@/shared/hooks/use-viewport-profile';
import { BakedGltf } from './BakedGltf';
import { CyberpunkComputer } from './CyberpunkComputer';
import { DECOR_NUDGE, DESK_FIT, ROOM_HIDE } from './cyber-computer';
import { DeskExitPortal } from './DeskExitPortal';
import { DeskLamp } from './DeskLamp';
import { DeskTypist } from './DeskTypist';
import { FittedGltf } from './FittedGltf';
import { MetalOfficeChair } from './MetalOfficeChair';
import { MonitorScreen } from './MonitorScreen';
import type { DeskCameraMode } from './types';
import { VoidAtmosphere } from './VoidAtmosphere';

type DeskSceneProps = {
  mode: DeskCameraMode;
  started: boolean;
  exiting: boolean;
  exitProgress: number;
  onEnterMonitor: () => void;
  onNavigate: (href: string) => void;
};

export const DeskScene = ({ mode, started, exiting, exitProgress, onEnterMonitor, onNavigate }: DeskSceneProps) => {
  const { isMobile } = useViewportProfile();
  const hideForMobileMonitor = isMobile && mode === 'monitor';

  return (
    <>
      <VoidAtmosphere />
      <BakedGltf
        model='/desk-os/world/environment.glb'
        texture='/desk-os/world/baked_environment.jpg'
        hide={ROOM_HIDE}
      />
      <BakedGltf
        model='/desk-os/decor/decor.glb'
        texture='/desk-os/decor/baked_decor_modified.jpg'
        nudge={DECOR_NUDGE}
      />
      <FittedGltf {...DESK_FIT} />
      <DeskExitPortal active={exiting} progress={exitProgress} />
      {!hideForMobileMonitor ? (
        <MetalOfficeChair exitProgress={exiting ? exitProgress : null} />
      ) : null}
      {(!hideForMobileMonitor || exiting) && (
        <DeskTypist exitProgress={exiting ? exitProgress : null} />
      )}
      <CyberpunkComputer />
      <DeskLamp />
      <MonitorScreen mode={mode} started={started} onEnterMonitor={onEnterMonitor} onNavigate={onNavigate} />
    </>
  );
};
