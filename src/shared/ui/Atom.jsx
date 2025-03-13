import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail, Sphere } from '@react-three/drei';

function Electron({
  radius = 2.75,
  speed = 6,
  rotation = [0, 0, 0],
  atomPosition = [0, 0, 5],
  ...props
}) {
  const ref = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;

    // 🌟 원 궤도 좌표 계산
    const position = new THREE.Vector3(
      Math.sin(t) * radius,
      (Math.cos(t) * radius * Math.atan(t)) / Math.PI / 1.25,
      0,
    );

    // rotation 적용
    const euler = new THREE.Euler(rotation[0], rotation[1], rotation[2]);
    position.applyEuler(euler);

    // Atom의 위치 반영
    ref.current.position.set(
      position.x + atomPosition[0],
      position.y + atomPosition[1],
      position.z + atomPosition[2],
    );

    // `groupRef`도 같은 회전을 적용해 Trail이 일치하도록 설정
    groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
  });

  return (
    <group ref={groupRef} {...props}>
      {' '}
      {/* 💡 Trail도 회전 값 적용 */}
      <Trail
        local
        width={5}
        length={10}
        color={new THREE.Color(2, 1, 10)}
        attenuation={(t) => t * t}
      >
        <mesh ref={ref}>
          <sphereGeometry args={[0.25]} />
          <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
        </mesh>
      </Trail>
    </group>
  );
}

export function Atom({ position = [0, 0, 0], ...props }) {
  const points = useMemo(
    () =>
      new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(
        100,
      ),
    [],
  );
  console.log('Atom props:', position);
  return (
    <group {...props} scale={100}>
      <Electron position={[0, -5, 5]} speed={6} atomPosition={[0, 5, 0]} />
      <Electron
        position={[0, -5, 5]}
        rotation={[0, 0, Math.PI / 3]}
        speed={6.5}
        atomPosition={[0, 5, 0]}
      />
      <Electron
        position={[0, -5, 5]}
        rotation={[0, 0, -Math.PI / 3]}
        speed={7}
        atomPosition={[0, 5, 0]}
      />
      <Sphere args={[0.35, 64, 64]} position={[0, 0, 5]}>
        <meshBasicMaterial color={[6, 0.5, 2]} toneMapped={false} />
      </Sphere>
    </group>
  );
}
