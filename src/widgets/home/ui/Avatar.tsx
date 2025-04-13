import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef, useState, useEffect } from 'react';
import * as three from 'three';

type ModelProps = {
  position?: [number, number, number];
  controlsEnabled?: boolean;
};

type GLTFResult = {
  nodes: {
    broche_nino_cremayera_t_0: three.Mesh;
    Casco_nino_casco_nino_m_0: three.Mesh;
    pie_n_der_botas_nino_m_0: three.Mesh;
    pie_n_izq_botas_nino_m_0: three.Mesh;
    pasted__Lente_nino_pasted__vidrio_astr_nina_0: three.Mesh;
    polySurface3_pasted__trajechico_0: three.Mesh;
    polySurface3_pasted__logonino_0: three.Mesh;
    polySurface4_pasted__trajechico_0: three.Mesh;
  };
  materials: Record<string, three.Material>;
  animations: three.AnimationClip[];
};

export function Avatar({ position = [1, 1, 0], controlsEnabled = true }: ModelProps) {
  const result = useGLTF('/astronaut.glb');
  const { nodes, materials, animations } = result as unknown as GLTFResult;

  // 애니메이션 및 참조 설정
  const group = useRef<three.Group>(null);
  const { actions, names } = useAnimations(animations, group);
  const [animation, setAnimation] = useState('Idle'); // 기본 애니메이션

  // 키보드 컨트롤 설정
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    running: false,
  });

  // 애니메이션 변경 함수
  useEffect(() => {
    // 이전 애니메이션 정지
    Object.values(actions).forEach((action) => {
      if (action) action.stop();
    });

    // 현재 애니메이션이 존재하면 재생
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
    }
  }, [animation, actions]);

  // 키보드 이벤트 리스너
  useEffect(() => {
    if (!controlsEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          setMovement((prev) => ({ ...prev, forward: true }));
          break;
        case 'KeyS':
          setMovement((prev) => ({ ...prev, backward: true }));
          break;
        case 'KeyA':
          setMovement((prev) => ({ ...prev, left: true }));
          break;
        case 'KeyD':
          setMovement((prev) => ({ ...prev, right: true }));
          break;
        case 'ShiftLeft':
          setMovement((prev) => ({ ...prev, running: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          setMovement((prev) => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
          setMovement((prev) => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
          setMovement((prev) => ({ ...prev, left: false }));
          break;
        case 'KeyD':
          setMovement((prev) => ({ ...prev, right: false }));
          break;
        case 'ShiftLeft':
          setMovement((prev) => ({ ...prev, running: false }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [controlsEnabled]);

  // 매 프레임마다 캐릭터 이동 및 애니메이션 업데이트
  useFrame((state, delta) => {
    if (!controlsEnabled) return;

    // 아바타 이동 속도
    const speed = movement.running ? 5 : 2.5;

    // 이동 벡터 계산
    const direction = new three.Vector3();
    if (movement.forward) direction.z -= 1;
    if (movement.backward) direction.z += 1;
    if (movement.left) direction.x -= 1;
    if (movement.right) direction.x += 1;

    // 벡터 정규화
    if (direction.length() > 0) {
      direction.normalize();

      // 이동 방향에 따라 아바타 회전
      if (group.current) {
        const angle = Math.atan2(direction.x, direction.z);
        group.current.rotation.y = angle;
      }

      // 아바타 위치 업데이트
      if (group.current) {
        group.current.position.x += direction.x * speed * delta;
        group.current.position.z += direction.z * speed * delta;
      }

      // 애니메이션 설정
      setAnimation(movement.running ? 'Run' : 'Walk');
    } else {
      // 움직임이 없으면 Idle 애니메이션
      setAnimation('Idle');
    }
  });
  return (
    <group ref={group} position={position} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.broche_nino_cremayera_t_0.geometry}
        material={materials.cremayera_t}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Casco_nino_casco_nino_m_0.geometry}
        material={materials.casco_nino_m}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pie_n_der_botas_nino_m_0.geometry}
        material={materials.botas_nino_m}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pie_n_izq_botas_nino_m_0.geometry}
        material={materials.botas_nino_m}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pasted__Lente_nino_pasted__vidrio_astr_nina_0.geometry}
        material={materials.pasted__vidrio_astr_nina}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface3_pasted__trajechico_0.geometry}
        material={materials.pasted__trajechico}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface3_pasted__logonino_0.geometry}
        material={materials.pasted__logonino}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface4_pasted__trajechico_0.geometry}
        material={materials.pasted__trajechico}
      />
    </group>
  );
}

useGLTF.preload('/astronaut.glb');
