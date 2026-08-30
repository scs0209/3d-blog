'use client';

import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as three from 'three';
import { CYBER_SCREEN, SCREEN_WORLD } from './cyber-computer';
import type { DeskCameraMode } from './types';

type DeskCameraProps = {
  mode: DeskCameraMode;
  started: boolean;
  freeCam: boolean;
  exiting: boolean;
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

const DEFAULT_FOV = 35;

const fitCameraDistance = (
  camera: three.Camera,
  viewportWidth: number,
  viewportHeight: number,
  objectWidth: number,
  objectHeight: number,
  margin = 1.06,
) => {
  const cam = camera as three.PerspectiveCamera;
  const vFov = (cam.fov * Math.PI) / 180;
  const aspect = viewportWidth / Math.max(viewportHeight, 1);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
  const distForWidth = (objectWidth * margin) / (2 * Math.tan(hFov / 2));
  const distForHeight = (objectHeight * margin) / (2 * Math.tan(vFov / 2));
  return Math.max(distForWidth, distForHeight);
};

const setCameraFov = (camera: three.Camera, fov: number) => {
  const cam = camera as three.PerspectiveCamera;
  if (cam.fov === fov) {
    return;
  }
  cam.fov = fov;
  cam.updateProjectionMatrix();
};

export const DeskCamera = ({ mode, started, freeCam, exiting }: DeskCameraProps) => {
  const { camera, size, clock } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const desiredPos = useRef(KEYS.loading.pos.clone());
  const desiredLook = useRef(KEYS.loading.look.clone());
  const look = useRef(KEYS.loading.look.clone());
  const booted = useRef(false);
  const prevMode = useRef(mode);
  const prevStarted = useRef(started);
  const exitHoldPos = useRef(new three.Vector3());
  const exitHoldLook = useRef(new three.Vector3());
  const exitFrozen = useRef(false);

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

    if (exiting) {
      if (!exitFrozen.current) {
        exitHoldPos.current.copy(camera.position);
        exitHoldLook.current.copy(look.current);
        exitFrozen.current = true;
      }
      camera.position.copy(exitHoldPos.current);
      look.current.copy(exitHoldLook.current);
      camera.lookAt(look.current);
      return;
    }

    exitFrozen.current = false;

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
    const mobile = size.width < 768;
    const portrait = size.height > size.width;
    const aspect = size.height / Math.max(size.width, 1);
    const screenY = CYBER_SCREEN.position[1];
    const screenZ = CYBER_SCREEN.position[2];

    if (!started) {
      setCameraFov(camera, DEFAULT_FOV);
      desiredPos.current.copy(KEYS.loading.pos);
      desiredLook.current.copy(KEYS.loading.look);
    } else if (mode === 'idle') {
      setCameraFov(camera, DEFAULT_FOV);
      desiredPos.current.set(
        Math.sin((elapsed + 19000) * 0.00008) * KEYS.idle.pos.x,
        Math.sin((elapsed + 1000) * 0.000004) * 4000 + KEYS.idle.pos.y - 3000,
        KEYS.idle.pos.z,
      );
      desiredLook.current.copy(KEYS.idle.look);
    } else if (mode === 'desk') {
      if (mobile) {
        desiredPos.current.set(0, portrait ? 2200 : 2000, portrait ? 9200 : 7800);
        desiredLook.current.set(0, screenY, screenZ);
      } else {
        const mx = mouse.current.x - size.width / 2;
        const my = -(mouse.current.y - size.height);
        desiredLook.current.x += (mx - desiredLook.current.x) * 0.05;
        desiredLook.current.y += (my - desiredLook.current.y) * 0.05;
        desiredLook.current.z = KEYS.desk.look.z;
        desiredPos.current.x += (mx - desiredPos.current.x) * 0.025;
        desiredPos.current.y += (-(mouse.current.y - size.height * 2) - desiredPos.current.y) * 0.025;
        desiredPos.current.z = KEYS.desk.pos.z + aspect * 3000 - 1800;
      }
    } else {
      const distance = fitCameraDistance(
        camera,
        size.width,
        size.height,
        SCREEN_WORLD.w,
        SCREEN_WORLD.h,
        mobile ? 1.1 : 1.05,
      );
      desiredPos.current.set(0, screenY, screenZ + distance);
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
