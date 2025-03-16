import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail, Sphere } from '@react-three/drei';

export function Atom(props) {
  const points = useMemo(
    () =>
      new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(
        100,
      ),
    [],
  );
  return (
    <group {...props} scale={50}>
      {/* X축을 중심으로 90도 회전하여 수직 방향으로 설정 */}
      <Electron
        position={[0, 0, 0.5]}
        speed={6}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <Electron
        position={[0, 0, 0.5]}
        rotation={[Math.PI / 2, 0, Math.PI / 3]}
        speed={6.5}
      />
      <Electron
        position={[0, 0, 0.5]}
        rotation={[Math.PI / 2, 0, -Math.PI / 3]}
        speed={7}
      />
      <Sphere args={[0.35, 64, 64]} position={[0, 0, 10]}>
        <meshBasicMaterial color={[6, 0.5, 2]} toneMapped={false} />
      </Sphere>
    </group>
  );
}

function Electron({
  radius = 2.75,
  speed = 6,
  rotation = [0, 0, 0],
  atomPosition = [0, 0, 10],
  ...props
}) {
  const ref = useRef();
  const trailRef = useRef();

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
    const finalPosition = new THREE.Vector3(
      position.x + atomPosition[0],
      position.y + atomPosition[1],
      position.z + atomPosition[2],
    );

    // 전자의 위치 설정
    ref.current.position.copy(finalPosition);
  });

  return (
    <Trail
      width={5}
      length={10}
      color={new THREE.Color(2, 1, 10)}
      attenuation={(t) => t * t}
    >
      <mesh ref={ref} {...props}>
        <sphereGeometry args={[0.25]} />
        <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
      </mesh>
    </Trail>
  );
}
