'use client';

import { useLayoutEffect, useRef } from 'react';
import type { Object3D, SpotLight } from 'three';

import { DESK_LIGHT_TARGET } from './cyber-computer';

const WARM = '#f0e2c8';
const TARGET = DESK_LIGHT_TARGET;
const ORIGIN: [number, number, number] = [40, 2800, 700];

export const DeskLamp = () => {
  const lightRef = useRef<SpotLight>(null);
  const targetRef = useRef<Object3D>(null);

  useLayoutEffect(() => {
    if (!lightRef.current || !targetRef.current) {
      return;
    }
    lightRef.current.target = targetRef.current;
    lightRef.current.target.updateMatrixWorld();
  }, []);

  return (
    <group>
      <ambientLight intensity={0.55} color='#5a6a80' />
      <hemisphereLight color='#8aa0b8' groundColor='#121018' intensity={0.85} />
      <object3D ref={targetRef} position={TARGET} />
      <spotLight
        ref={lightRef}
        position={ORIGIN}
        angle={0.72}
        penumbra={0.9}
        intensity={4.2}
        distance={0}
        decay={0}
        color={WARM}
      />
    </group>
  );
};
