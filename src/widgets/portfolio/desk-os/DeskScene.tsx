'use client';

import { BakedGltf } from './BakedGltf';
import { CyberpunkComputer } from './CyberpunkComputer';
import { DECOR_NUDGE, DESK_FIT, ROOM_HIDE } from './cyber-computer';
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
  onEnterMonitor: () => void;
};

/** Walls stay. Desk / chair / computer are downloaded models fitted to the original layout. */
export const DeskScene = ({ mode, started, onEnterMonitor }: DeskSceneProps) => {
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
      <MetalOfficeChair />
      <DeskTypist />
      <CyberpunkComputer />
      <DeskLamp />
      <MonitorScreen mode={mode} started={started} onEnterMonitor={onEnterMonitor} />
    </>
  );
};
