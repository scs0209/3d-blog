import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail, Sphere, useHelper } from '@react-three/drei';

export function Atom(props) {
  const groupRef = useRef();

  // 바운딩 박스 헬퍼를 표시해서 위치를 확인할 수 있습니다
  useHelper(groupRef, THREE.BoxHelper, 'cyan');
  const points = useMemo(
    () =>
      new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(
        100,
      ),
    [],
  );
  useFrame(() => {
    if (groupRef.current) {
      console.log('Atom position:', groupRef.current.position);
    }
  });

  return (
    <group {...props} ref={groupRef}>
      <Electron position={[0, -50, 300]} speed={6} />
      <Electron
        position={[0, -50, 300]}
        rotation={[0, 0, Math.PI / 3]}
        speed={6.5}
      />
      <Electron
        position={[0, -50, 300]}
        rotation={[0, 0, -Math.PI / 3]}
        speed={7}
      />
      <Sphere args={[0.35, 64, 64]}>
        <meshBasicMaterial color={[6, 0.5, 2]} toneMapped={false} />
      </Sphere>
    </group>
  );
}

function Electron({ radius = 2.75, speed = 6, ...props }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.set(
      Math.sin(t) * radius,
      (Math.cos(t) * radius * Math.atan(t)) / Math.PI / 1.25,
      0,
    );
  });
  return (
    <group {...props}>
      <Trail
        local
        width={5}
        length={10}
        color={new THREE.Color(2, 1, 10)}
        attenuation={(t) => t * t}
        position={[0, -50, 300]}
      >
        <mesh ref={ref} position={[0, -50, 300]}>
          <sphereGeometry args={[0.25]} />
          <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
        </mesh>
      </Trail>
    </group>
  );
}
