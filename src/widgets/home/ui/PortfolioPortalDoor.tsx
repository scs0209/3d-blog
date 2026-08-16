'use client';

import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as three from 'three';
import { CINEMA_CREAM } from '@/entities/portfolio/model/cinematic-transition';
import type { CosmosPortal } from '@/widgets/home/model/cosmos-portals';

type PortfolioPortalDoorProps = {
  portal: CosmosPortal;
  open: boolean;
};

export const PortfolioPortalDoor = ({ portal, open }: PortfolioPortalDoorProps) => {
  const group = useRef<three.Group>(null);
  const voidRef = useRef<three.Mesh>(null);
  const openRef = useRef(false);
  const { scene, animations } = useGLTF('/sci-fi_door..glb');
  const { actions, mixer } = useAnimations(animations, group);

  const faceYaw = Math.atan2(-portal.position[0], 1.5 - portal.position[2]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj as three.Mesh).isMesh) {
        return;
      }
      const mesh = obj as three.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [scene]);

  useEffect(() => {
    const action = Object.values(actions).find(Boolean);
    if (!action || !mixer) {
      return;
    }

    action.setLoop(three.LoopOnce, 1);
    action.clampWhenFinished = true;

    if (open && !openRef.current) {
      openRef.current = true;
      action.reset();
      action.timeScale = 1;
      action.play();
      return;
    }

    if (!open && openRef.current) {
      openRef.current = false;
      action.timeScale = -1;
      action.paused = false;
      action.play();
    }
  }, [actions, mixer, open]);

  useFrame((_, delta) => {
    const voidMesh = voidRef.current;
    if (!voidMesh) {
      return;
    }
    const mat = voidMesh.material as three.MeshBasicMaterial;
    mat.opacity = three.MathUtils.damp(mat.opacity, open ? 0.85 : 0.08, 4, delta);
  });

  return (
    <group position={portal.position} rotation={[0, faceYaw, 0]}>
      <group ref={group} scale={1.35} position={[0, -0.12, 0]}>
        <primitive object={scene} />
      </group>

      <mesh ref={voidRef} position={[0, 1.55, -0.22]}>
        <planeGeometry args={[1.7, 2.7]} />
        <meshBasicMaterial color={CINEMA_CREAM} transparent opacity={0.08} toneMapped={false} side={three.DoubleSide} />
      </mesh>

      <pointLight color={CINEMA_CREAM} intensity={open ? 8 : 1.4} distance={10} decay={2} position={[0, 1.6, 0.4]} />
    </group>
  );
};

useGLTF.preload('/sci-fi_door..glb');
