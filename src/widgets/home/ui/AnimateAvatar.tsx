import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import type { GLTF } from 'three-stdlib';
import type * as three from 'three';

type GLTFResult = GLTF & {
  nodes: Record<string, three.SkinnedMesh>;
  materials: Record<string, three.Material>;
  skeletons: Record<string, three.Skeleton>;
};

export function AnimateAvatar(props: any) {
  const group = useRef<Group>(null);
  const { nodes, materials, animations } = useGLTF('/floating_astronaut.glb') as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // idle 애니메이션 실행
    const idleAction = actions['Armature|mixamo.com|Layer0'];
    if (idleAction) {
      idleAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(0.5)
        .play()
        .setLoop(2201, Number.POSITIVE_INFINITY);
    } else {
      console.warn('Idle animation not found in:', Object.keys(actions));
    }

    return () => {
      if (idleAction) {
        idleAction.fadeOut(0.5);
      }
    };
  }, [actions, animations]);

  useFrame((state) => {
    if (group.current) {
      const time = state.clock.elapsedTime;
      // 넓은 범위의 사선 움직임
      const x = Math.sin(time * 0.3) * 5; // 좌우 5단위 범위
      const y = Math.sin(time * 0.5) * 3 + 3; // 상하 3단위 범위 + 기본 높이 5
      const z = Math.cos(time * 0.3) * 5; // 전후 5단위 범위

      // 위치 업데이트
      group.current.position.set(x, y, z);

      // 움직임에 따른 회전 계산 로직
      const moveX = Math.cos(time * 0.3) * 0.3; // 좌우 움직임에 따른 회전
      const moveY = Math.cos(time * 0.5) * 0.5; // 상하 움직임에 따른 회전
      const moveZ = Math.sin(time * 0.3) * 0.3; // 전후 움직임에 따른 회전

      // 회전 업데이트
      group.current.rotation.set(moveY, moveX, moveZ);
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <pointLight position={[0, 0, 0]} intensity={50} />
      <group name='Scene'>
        <group name='b1260bacd7ba4ae687b919760fd504cbfbx' rotation={[-Math.PI, 0, 0]} scale={0}>
          <group name='RootNode1'>
            <group name='Astro' />
          </group>
        </group>
        <group name='Armature' rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name='Astro_ASTRO_0'
            geometry={nodes.Astro_ASTRO_0?.geometry}
            material={materials.ASTRO}
            skeleton={nodes.Astro_ASTRO_0?.skeleton}
          />
          <skinnedMesh
            name='Astro_ASTRO_01'
            geometry={nodes.Astro_ASTRO_01?.geometry}
            material={materials.ASTRO}
            skeleton={nodes.Astro_ASTRO_01?.skeleton}
          />
          <skinnedMesh
            name='Astro_ASTRO_02'
            geometry={nodes.Astro_ASTRO_02?.geometry}
            material={materials.ASTRO}
            skeleton={nodes.Astro_ASTRO_02?.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/floating_astronaut.glb');
