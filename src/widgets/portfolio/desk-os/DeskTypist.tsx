'use client';

import { useFBX, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { Group } from 'three';
import * as three from 'three';
import { DESK_TYPIST } from './cyber-computer';
import { DESK_EXIT, getExitTypistPosition, getExitTypistYaw } from './desk-exit';
import {
  DESK_TYPIST_CLIPS,
  pickMixamoFbxClip,
  pickTypingClip,
} from './desk-typist-clips';

type DeskTypistProps = {
  exitProgress?: number | null;
};

type ExitStage = 'idle' | 'stand' | 'walk';

type TypistActions = {
  typing: three.AnimationAction | null;
  stand: three.AnimationAction | null;
  walk: three.AnimationAction | null;
};

/** Typing.glb 앉기용. Mixamo 퇴장 클립은 0이어야 직립 */
const SEATED_ARMATURE_X = Math.PI / 2;
const STANDING_ARMATURE_X = 0;
const walkPosition = new three.Vector3();

export const DeskTypist = ({ exitProgress = null }: DeskTypistProps) => {
  const group = useRef<Group>(null);
  const armatureRef = useRef<Group>(null);
  const mixerRef = useRef<three.AnimationMixer | null>(null);
  const actionsRef = useRef<TypistActions>({ typing: null, stand: null, walk: null });
  const exitStageRef = useRef<ExitStage>('idle');
  const { nodes, materials, animations } = useGLTF(DESK_TYPIST_CLIPS.model);
  const sitToStandSource = useFBX(DESK_TYPIST_CLIPS.sitToStand);
  const walkSource = useFBX(DESK_TYPIST_CLIPS.walk);
  const isExiting = exitProgress !== null;

  const material = useMemo(() => {
    const next = (materials.Pele as three.MeshStandardMaterial).clone();
    next.color.set('#b7c2ce');
    next.metalness = 0.08;
    next.roughness = 0.68;
    next.emissive.set('#243044');
    next.emissiveIntensity = 0.28;
    next.toneMapped = false;
    next.envMapIntensity = 0;
    return next;
  }, [materials]);

  useEffect(() => {
    if (!group.current) {
      return;
    }

    const mixer = new three.AnimationMixer(group.current);
    mixerRef.current = mixer;

    const typingClip = pickTypingClip(animations);
    const standClip = pickMixamoFbxClip(sitToStandSource.animations);
    const walkClip = pickMixamoFbxClip(walkSource.animations);

    if (typingClip) {
      const typing = mixer.clipAction(typingClip);
      typing.setLoop(three.LoopRepeat, Number.POSITIVE_INFINITY);
      typing.play();
      actionsRef.current.typing = typing;
    }

    if (standClip) {
      const stand = mixer.clipAction(standClip);
      stand.setLoop(three.LoopOnce, 1);
      stand.clampWhenFinished = true;
      actionsRef.current.stand = stand;
    }

    if (walkClip) {
      const walk = mixer.clipAction(walkClip);
      walk.setLoop(three.LoopRepeat, Number.POSITIVE_INFINITY);
      actionsRef.current.walk = walk;
    }

    const handleFinished = (event: { action: three.AnimationAction }) => {
      const { stand, walk } = actionsRef.current;
      if (event.action !== stand || exitStageRef.current === 'walk') {
        return;
      }

      // 문 방향 회전은 root yaw가 담당. 걷기는 turnEnd에 맞춰 useFrame에서 시작
      if (walk) {
        walk.enabled = true;
        walk.paused = true;
        walk.setEffectiveWeight(1);
        if (!walk.isRunning()) {
          walk.play();
        }
      }
    };

    mixer.addEventListener('finished', handleFinished);

    return () => {
      mixer.removeEventListener('finished', handleFinished);
      mixer.stopAllAction();
      mixerRef.current = null;
      actionsRef.current = { typing: null, stand: null, walk: null };
      exitStageRef.current = 'idle';
    };
  }, [animations, sitToStandSource.animations, walkSource.animations]);

  useEffect(() => {
    if (!group.current) {
      return;
    }

    const { typing, stand, walk } = actionsRef.current;

    if (!isExiting) {
      // 퇴장 직후 앉은 좌표로 리셋하지 않음 (문 앞에서 뒤로 튀는 원인)
      if (exitStageRef.current === 'walk' || exitStageRef.current === 'stand') {
        walk?.stop();
        stand?.stop();
        group.current.visible = false;
        return;
      }
      exitStageRef.current = 'idle';
      walk?.stop();
      stand?.stop();
      typing?.reset().setEffectiveWeight(1).play();
      group.current.position.set(...DESK_TYPIST.position);
      group.current.rotation.set(...DESK_TYPIST.rotation);
      group.current.visible = true;
      if (armatureRef.current) {
        armatureRef.current.rotation.set(SEATED_ARMATURE_X, 0, 0);
      }
      return;
    }

    if (armatureRef.current) {
      armatureRef.current.rotation.set(STANDING_ARMATURE_X, 0, 0);
    }
    exitStageRef.current = 'stand';
    walk?.stop();
    typing?.fadeOut(0.12);
    stand?.reset().setEffectiveWeight(1).fadeIn(0.12).play();
  }, [isExiting]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);

    const armature = armatureRef.current;
    const root = group.current;
    if (!armature || !root) {
      return;
    }

    if (!isExiting || exitProgress === null) {
      if (exitStageRef.current === 'idle') {
        armature.rotation.x = SEATED_ARMATURE_X;
      }
      return;
    }

    armature.rotation.x = STANDING_ARMATURE_X;

    const { turnEnd } = DESK_EXIT.phases;
    const { walk } = actionsRef.current;

    if (exitProgress >= turnEnd && exitStageRef.current !== 'walk') {
      exitStageRef.current = 'walk';
      if (walk) {
        walk.enabled = true;
        walk.paused = false;
        walk.setEffectiveWeight(1);
        if (!walk.isRunning()) {
          walk.play();
        }
      }
    }

    getExitTypistPosition(exitProgress, walkPosition);
    root.position.copy(walkPosition);
    root.rotation.set(0, getExitTypistYaw(exitProgress), 0);
    root.visible = true;
  });

  const mesh = nodes.Cylinder_Pele_0 as three.SkinnedMesh;

  return (
    <group
      ref={group}
      position={DESK_TYPIST.position}
      rotation={DESK_TYPIST.rotation}
      scale={DESK_TYPIST.scale}
      dispose={null}
    >
      <group name='Scene'>
        <group ref={armatureRef} name='Armature' rotation={[SEATED_ARMATURE_X, 0, 0]} scale={0.01}>
          <skinnedMesh
            name='Cylinder_Pele_0'
            geometry={mesh.geometry}
            material={material}
            skeleton={mesh.skeleton}
            frustumCulled={false}
          />
          <primitive object={nodes.mixamorigHips as three.Object3D} />
        </group>
      </group>
    </group>
  );
};

useGLTF.preload(DESK_TYPIST_CLIPS.model);
useFBX.preload(DESK_TYPIST_CLIPS.sitToStand);
useFBX.preload(DESK_TYPIST_CLIPS.walk);
