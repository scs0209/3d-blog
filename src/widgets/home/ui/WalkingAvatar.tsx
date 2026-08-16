'use client';

import { useRef, useEffect, useLayoutEffect, type ComponentProps } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useFBX } from '@react-three/drei';
import type { Group } from 'three';
import * as three from 'three';
import type { GLTF } from 'three-stdlib';
import { setCosmosWalking } from '@/widgets/home/lib/cosmos-audio';

type GLTFResult = GLTF & {
  nodes: Record<string, three.SkinnedMesh>;
  materials: Record<string, three.Material>;
  skeletons: Record<string, three.Skeleton>;
};

const MOVE_SPEED = 2.5;
const WALK_CLIP_NAME = 'Armature|mixamo.com|Layer0';

/** Euler(π/2, yaw, 0)는 짐벌락으로 S/A/D에서 옆으로 눕음 → 쿼터니언으로 직립+요 합성 */
const _uprightQ = new three.Quaternion();
const _yawQ = new three.Quaternion();
const _axisX = new three.Vector3(1, 0, 0);
const _axisY = new three.Vector3(0, 1, 0);

const applyWalkOrientation = (avatar: Group, dx: number, dz: number) => {
  _uprightQ.setFromAxisAngle(_axisX, Math.PI / 2);
  _yawQ.setFromAxisAngle(_axisY, Math.atan2(dx, dz));
  avatar.quaternion.multiplyQuaternions(_yawQ, _uprightQ);
};

/** 한글 IME에서도 동작하도록 e.code 사용 */
const pressedCodes = new Set<string>();
const CODE_W = 'KeyW';
const CODE_A = 'KeyA';
const CODE_S = 'KeyS';
const CODE_D = 'KeyD';
const MOVE_CODES = new Set([CODE_W, CODE_A, CODE_S, CODE_D]);

let keyListenerRefCount = 0;
let detachKeyListeners: (() => void) | null = null;

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
};

const attachKeyListeners = () => {
  if (typeof window === 'undefined') {
    return;
  }
  keyListenerRefCount += 1;
  if (detachKeyListeners) {
    return;
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!MOVE_CODES.has(e.code) || isEditableTarget(e.target)) {
      return;
    }
    e.preventDefault();
    pressedCodes.add(e.code);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (!MOVE_CODES.has(e.code)) {
      return;
    }
    pressedCodes.delete(e.code);
  };

  const handleBlur = () => {
    pressedCodes.clear();
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('blur', handleBlur);

  detachKeyListeners = () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('blur', handleBlur);
    pressedCodes.clear();
    detachKeyListeners = null;
  };
};

const releaseKeyListeners = () => {
  keyListenerRefCount = Math.max(0, keyListenerRefCount - 1);
  if (keyListenerRefCount === 0) {
    detachKeyListeners?.();
  }
};

type AvatarActions = {
  walk: three.AnimationAction | null;
  typing: three.AnimationAction | null;
  snp: three.AnimationAction | null;
};

type WalkingAvatarProps = ComponentProps<'group'> & {
  triggerSnp?: number;
  position?: [number, number, number];
  /** cinematic: typing 없이 서 있고, 지평선(-Z) 방향으로 보행 */
  variant?: 'default' | 'cinematic';
  /** 부모 스케일/위치를 반영한 월드 좌표 (근접 포털 등) */
  onWorldPosition?: (pos: three.Vector3) => void;
  /** true면 WASD 이동을 멈춤 (포탈 진입 연출) */
  locked?: boolean;
};

useGLTF.preload('/WalkingAstro.glb');
useFBX.preload('/snp.fbx');
useFBX.preload('/Typing.fbx');

export function WalkingAvatar({
  triggerSnp,
  position = [0, 0.6, 0.5],
  variant = 'default',
  onWorldPosition,
  locked = false,
  ...restProps
}: WalkingAvatarProps) {
  const isCinematic = variant === 'cinematic';
  const group = useRef<Group>(null);
  const mixer = useRef<three.AnimationMixer | null>(null);
  const actionsRef = useRef<AvatarActions>({ walk: null, typing: null, snp: null });
  const isWalkingRef = useRef(false);
  // React props로 position을 넘기지 않음 — 매 렌더 덮어쓰기 방지
  const spawnRef = useRef<[number, number, number]>([position[0], position[1], position[2]]);
  const offsetRef = useRef(new three.Vector3(0, 0, 0));
  const facingRef = useRef(isCinematic ? Math.PI : 0);
  const worldPosRef = useRef(new three.Vector3());
  const onWorldPositionRef = useRef(onWorldPosition);
  onWorldPositionRef.current = onWorldPosition;

  const { nodes, materials, animations: gltfAnimations } = useGLTF(
    '/WalkingAstro.glb',
    true,
  ) as unknown as GLTFResult;
  const snpModel = useFBX('/snp.fbx');
  const typingModel = useFBX('/Typing.fbx');

  useLayoutEffect(() => {
    attachKeyListeners();
    if (!group.current) {
      return () => {
        releaseKeyListeners();
      };
    }
    const [x, y, z] = spawnRef.current;
    group.current.position.set(x, y, z);
    if (isCinematic) {
      applyWalkOrientation(group.current, 0, -1);
    }
    return () => {
      releaseKeyListeners();
    };
  }, [isCinematic]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);

    const avatar = group.current;
    if (!avatar) {
      return;
    }

    let dx = 0;
    let dz = 0;
    if (!locked) {
      if (pressedCodes.has(CODE_W)) {
        dz += isCinematic ? -1 : 1;
      }
      if (pressedCodes.has(CODE_S)) {
        dz += isCinematic ? 1 : -1;
      }
      if (pressedCodes.has(CODE_A)) {
        dx += isCinematic ? -1 : 1;
      }
      if (pressedCodes.has(CODE_D)) {
        dx += isCinematic ? 1 : -1;
      }
    }

    const isMoving = dx !== 0 || dz !== 0;
    const speed = isCinematic ? MOVE_SPEED * 2.1 : MOVE_SPEED;

    if (isMoving) {
      const length = Math.hypot(dx, dz);
      dx /= length;
      dz /= length;

      offsetRef.current.x += dx * speed * delta;
      offsetRef.current.z += dz * speed * delta;
      applyWalkOrientation(avatar, dx, dz);
      facingRef.current = Math.atan2(dx, dz);

      if (!isWalkingRef.current) {
        isWalkingRef.current = true;
        if (isCinematic) {
          setCosmosWalking(true);
        }
        const { walk, typing, snp } = actionsRef.current;
        typing?.fadeOut(0.15);
        snp?.stop();
        if (walk) {
          // reset()하면 bind 포즈로 돌아가며 π/2와 겹쳐 눕음 → unpause만
          walk.enabled = true;
          walk.paused = false;
          walk.setEffectiveWeight(1);
          if (!walk.isRunning()) {
            walk.play();
          }
        }
      }
    } else if (isWalkingRef.current) {
      isWalkingRef.current = false;
      if (isCinematic) {
        setCosmosWalking(false);
      }
      const { walk, typing } = actionsRef.current;

      if (isCinematic) {
        if (walk) {
          walk.paused = true;
          walk.time = 0.2;
        }
        applyWalkOrientation(avatar, Math.sin(facingRef.current), Math.cos(facingRef.current));
      } else {
        walk?.fadeOut(0.2);
        avatar.quaternion.identity();
        if (typing) {
          typing.reset().fadeIn(0.15).play();
        }
      }
    }

    const [sx, sy, sz] = spawnRef.current;
    avatar.position.set(sx + offsetRef.current.x, sy, sz + offsetRef.current.z);

    const reportWorldPosition = onWorldPositionRef.current;
    if (reportWorldPosition) {
      avatar.getWorldPosition(worldPosRef.current);
      reportWorldPosition(worldPosRef.current);
    }
  });

  useEffect(() => {
    if (!group.current) {
      return;
    }

    const currentMixer = new three.AnimationMixer(group.current);
    mixer.current = currentMixer;

    const walkClip = gltfAnimations?.find((clip) => clip?.name === WALK_CLIP_NAME);
    if (walkClip) {
      const walkAction = currentMixer.clipAction(walkClip);
      walkAction.setEffectiveTimeScale(1);
      walkAction.setEffectiveWeight(1);
      walkAction.setLoop(three.LoopRepeat, Number.POSITIVE_INFINITY);
      actionsRef.current.walk = walkAction;
    }

    const typingClip = typingModel.animations?.[0];
    if (typingClip && !isCinematic) {
      const typingAction = currentMixer.clipAction(typingClip);
      typingAction.setEffectiveTimeScale(1);
      typingAction.setEffectiveWeight(1);
      typingAction.setLoop(three.LoopRepeat, Number.POSITIVE_INFINITY);
      typingAction.play();
      actionsRef.current.typing = typingAction;
    }

    if (isCinematic && walkClip) {
      // 서 있는 실루엣: walk 클립 첫 프레임에 고정
      const walkAction = actionsRef.current.walk;
      if (walkAction) {
        walkAction.play();
        walkAction.paused = true;
        walkAction.time = 0.15;
      }
    }

    const snpClip = snpModel.animations?.[0];
    let onFinished: ((e: { action: three.AnimationAction }) => void) | undefined;

    if (snpClip && !isCinematic) {
      const snpAction = currentMixer.clipAction(snpClip);
      snpAction.setEffectiveTimeScale(1);
      snpAction.setEffectiveWeight(1);
      snpAction.setLoop(three.LoopOnce, 1);
      snpAction.clampWhenFinished = true;
      actionsRef.current.snp = snpAction;

      onFinished = (e) => {
        if (e.action !== snpAction || isWalkingRef.current) {
          return;
        }
        actionsRef.current.typing?.reset().fadeIn(0.2).play();
      };
      currentMixer.addEventListener('finished', onFinished);
    }

    return () => {
      if (onFinished) {
        currentMixer.removeEventListener('finished', onFinished);
      }
      currentMixer.stopAllAction();
      if (mixer.current === currentMixer) {
        mixer.current = null;
      }
      actionsRef.current = { walk: null, typing: null, snp: null };
      if (isCinematic) {
        setCosmosWalking(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [gltfAnimations, typingModel.animations, snpModel.animations, isCinematic]);

  useEffect(() => {
    if (!triggerSnp || isWalkingRef.current) {
      return;
    }

    const { snp, typing, walk } = actionsRef.current;
    if (!snp) {
      return;
    }

    typing?.fadeOut(0.1);
    walk?.stop();
    snp.reset().fadeIn(0.1).play();
  }, [triggerSnp]);

  return (
    <group ref={group} {...restProps} dispose={null}>
      <group name='RootNode'>
        <group name='67359760e8bd414fac2378ecfb5ba5c5fbx' rotation={[0, 0, 0]}>
          <group name='RootNode1'>
            <group name='left' position={[-100.1, 0, 0]}>
              <group name='Object_4' />
            </group>
            <group name='group1'>
              <group name='broche_nino'>
                <skinnedMesh
                  name='broche_nino_cremayera_t_0'
                  geometry={nodes.broche_nino_cremayera_t_0?.geometry}
                  material={materials.cremayera_t}
                  skeleton={nodes.broche_nino_cremayera_t_0?.skeleton}
                />
              </group>
              <group name='Casco_nino'>
                <skinnedMesh
                  name='Casco_nino_casco_nino_m_0'
                  geometry={nodes.Casco_nino_casco_nino_m_0?.geometry}
                  material={materials.casco_nino_m}
                  skeleton={nodes.Casco_nino_casco_nino_m_0?.skeleton}
                />
              </group>
              <group name='botas_nino'>
                <group name='pie_n_der'>
                  <skinnedMesh
                    name='pie_n_der_botas_nino_m_0'
                    geometry={nodes.pie_n_der_botas_nino_m_0?.geometry}
                    material={materials.botas_nino_m}
                    skeleton={nodes.pie_n_der_botas_nino_m_0?.skeleton}
                  />
                </group>
                <group name='pie_n_izq'>
                  <skinnedMesh
                    name='pie_n_izq_botas_nino_m_0'
                    geometry={nodes.pie_n_izq_botas_nino_m_0?.geometry}
                    material={materials.botas_nino_m}
                    skeleton={nodes.pie_n_izq_botas_nino_m_0?.skeleton}
                  />
                </group>
              </group>
            </group>
            <group name='pasted__Lente_nino'>
              <skinnedMesh
                name='pasted__Lente_nino_pasted__vidrio_astr_nina_0'
                geometry={nodes.pasted__Lente_nino_pasted__vidrio_astr_nina_0?.geometry}
                material={materials.pasted__vidrio_astr_nina}
                skeleton={nodes.pasted__Lente_nino_pasted__vidrio_astr_nina_0?.skeleton}
              />
            </group>
            <group name='pasted__Traje_nino'>
              <group name='polySurface3'>
                <skinnedMesh
                  name='polySurface3_pasted__trajechico_0'
                  geometry={nodes.polySurface3_pasted__trajechico_0?.geometry}
                  material={materials.pasted__trajechico}
                  skeleton={nodes.polySurface3_pasted__trajechico_0?.skeleton}
                />
                <skinnedMesh
                  name='polySurface3_pasted__logonino_0'
                  geometry={nodes.polySurface3_pasted__logonino_0?.geometry}
                  material={materials.pasted__logonino}
                  skeleton={nodes.polySurface3_pasted__logonino_0?.skeleton}
                />
              </group>
              <group name='polySurface4'>
                <skinnedMesh
                  name='polySurface4_pasted__trajechico_0'
                  geometry={nodes.polySurface4_pasted__trajechico_0?.geometry}
                  material={materials.pasted__trajechico}
                  skeleton={nodes.polySurface4_pasted__trajechico_0?.skeleton}
                />
              </group>
            </group>
          </group>
        </group>
        {nodes.mixamorigHips ? (
          <primitive object={nodes.mixamorigHips as unknown as three.Object3D} />
        ) : null}
      </group>
    </group>
  );
}
