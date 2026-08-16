'use client';

import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as three from 'three';
import { CYBER_SCREEN } from './cyber-computer';
import type { DeskCameraMode } from './types';

type DeskCameraProps = {
  mode: DeskCameraMode;
  started: boolean;
  freeCam: boolean;
};

const KEYS = {
  loading: { pos: new three.Vector3(-35000, 35000, 35000), look: new three.Vector3(0, -5000, 0) },
  idle: { pos: new three.Vector3(-20000, 12000, 20000), look: new three.Vector3(0, -1000, 0) },
  desk: { pos: new three.Vector3(0, 1800, 5500), look: new three.Vector3(0, CYBER_SCREEN.position[1], 0) },
  monitor: {
    pos: new three.Vector3(0, CYBER_SCREEN.position[1], CYBER_SCREEN.position[2] + 2000),
    look: new three.Vector3(...CYBER_SCREEN.position),
  },
  orbit: { pos: new three.Vector3(-15000, 10000, 15000), look: new three.Vector3(-100, 350, 0) },
};

export const DeskCamera = ({ mode, started, freeCam }: DeskCameraProps) => {
  const { camera, size, clock } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const desiredPos = useRef(KEYS.loading.pos.clone());
  const desiredLook = useRef(KEYS.loading.look.clone());
  const look = useRef(KEYS.loading.look.clone());
  const booted = useRef(false);
  const prevMode = useRef(mode);
  const prevStarted = useRef(started);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (freeCam) {
      return;
    }

    if (prevMode.current !== mode || prevStarted.current !== started) {
      if (!started) {
        desiredPos.current.copy(KEYS.loading.pos);
        desiredLook.current.copy(KEYS.loading.look);
      } else if (mode === 'idle') {
        desiredLook.current.copy(KEYS.idle.look);
      } else if (mode === 'desk') {
        desiredPos.current.copy(KEYS.desk.pos);
        desiredLook.current.copy(KEYS.desk.look);
      } else {
        desiredPos.current.copy(KEYS.monitor.pos);
        desiredLook.current.copy(KEYS.monitor.look);
      }
      prevMode.current = mode;
      prevStarted.current = started;
    }

    const elapsed = clock.elapsedTime * 1000;
    const aspect = size.height / Math.max(size.width, 1);

    if (!started) {
      desiredPos.current.copy(KEYS.loading.pos);
      desiredLook.current.copy(KEYS.loading.look);
    } else if (mode === 'idle') {
      desiredPos.current.set(
        Math.sin((elapsed + 19000) * 0.00008) * KEYS.idle.pos.x,
        Math.sin((elapsed + 1000) * 0.000004) * 4000 + KEYS.idle.pos.y - 3000,
        KEYS.idle.pos.z,
      );
      desiredLook.current.copy(KEYS.idle.look);
    } else if (mode === 'desk') {
      const mx = mouse.current.x - size.width / 2;
      const my = -(mouse.current.y - size.height);
      desiredLook.current.x += (mx - desiredLook.current.x) * 0.05;
      desiredLook.current.y += (my - desiredLook.current.y) * 0.05;
      desiredLook.current.z = KEYS.desk.look.z;
      desiredPos.current.x += (mx - desiredPos.current.x) * 0.025;
      desiredPos.current.y += (-(mouse.current.y - size.height * 2) - desiredPos.current.y) * 0.025;
      desiredPos.current.z = KEYS.desk.pos.z + aspect * 3000 - 1800;
    } else {
      const extra = size.width < 768 ? 0 : 600;
      desiredPos.current.set(0, CYBER_SCREEN.position[1], KEYS.monitor.pos.z + aspect * 1200 - extra);
      desiredLook.current.copy(KEYS.monitor.look);
    }

    if (!booted.current) {
      camera.position.copy(desiredPos.current);
      look.current.copy(desiredLook.current);
      camera.lookAt(look.current);
      booted.current = true;
      return;
    }

    const lambda = !started ? 0.9 : mode === 'monitor' ? 1.35 : 2.1;
    const t = 1 - Math.exp(-delta * lambda);
    camera.position.lerp(desiredPos.current, t);
    look.current.lerp(desiredLook.current, t);
    camera.lookAt(look.current);
  });

  if (!freeCam) {
    return null;
  }

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.05}
      minDistance={4000}
      maxDistance={29000}
      maxPolarAngle={Math.PI / 2}
      target={KEYS.orbit.look.toArray()}
    />
  );
};
