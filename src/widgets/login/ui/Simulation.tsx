import { Float, OrbitControls, useGLTF } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import {
  Physics,
  RigidBody,
  BallCollider,
  RapierRigidBody,
} from '@react-three/rapier';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function Floating(props: any) {
  const { nodes, materials } = useGLTF('/tesseract_cube.glb');
  return (
    <group {...props} dispose={null}>
      <Float>
        <mesh
          geometry={(nodes.hash as any)?.geometry}
          material={materials.PaletteMaterial001}
          position={[-4.095, 1.891, -2.58]}
          scale={0.216}
        />
      </Float>
      <Float>
        <mesh
          geometry={(nodes.star001 as any)?.geometry}
          material={materials.PaletteMaterial001}
          position={[2.932, -2.747, -2.807]}
          scale={0.278}
        />
      </Float>
      <Float>
        <mesh
          geometry={(nodes.play as any)?.geometry}
          material={materials.PaletteMaterial001}
          position={[3.722, 0.284, -1.553]}
          scale={0.245}
        />
      </Float>
      <Float>
        <mesh
          geometry={(nodes.points as any)?.geometry}
          material={materials.PaletteMaterial001}
          position={[3, 2.621, -1.858]}
          scale={0.239}
        />
      </Float>
      <Float>
        <mesh
          geometry={(nodes.Ellipse as any)?.geometry}
          material={materials.PaletteMaterial001}
          position={[-3.275, -1, -3.389]}
          scale={0.317}
        />
      </Float>
    </group>
  );
}

function RigidShape({ mesh }: { mesh: THREE.Mesh }) {
  const api = useRef<RapierRigidBody>(null);
  const vec = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    delta = Math.min(0.1, delta);
    if (api.current) {
      const position = api.current.translation();
      vec.current
        .set(-position.x, -position.y + 2, -position.z)
        .multiplyScalar(0.2);
      api.current.applyImpulse(vec.current, false);
    }
  });

  return (
    <RigidBody
      ref={api}
      scale={2}
      position={[
        THREE.MathUtils.randFloatSpread(10),
        THREE.MathUtils.randFloatSpread(10),
        THREE.MathUtils.randFloatSpread(10),
      ]}
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      colliders="ball"
    >
      <mesh geometry={mesh.geometry} material={mesh.material} />
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<RapierRigidBody>(null);
  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0,
      ),
    );
  });
  return (
    <RigidBody
      position={[0, 0, 0]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

export function Physical(props: any) {
  const { nodes, materials } = useGLTF('/cute_astronaut.glb');
  const groupRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      time.current += delta;
      // 부드러운 떠다니는 효과
      groupRef.current.position.y = Math.sin(time.current * 0.5) * 0.2;
      // 천천히 회전하는 효과
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Physics gravity={[0, 0, 0]}>
      <group {...props} dispose={null}>
        <group ref={groupRef} scale={0.01}>
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Mesh_0_Material_0_0 as any).geometry}
            material={materials.Material_0}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
        </group>
      </group>
      <OrbitControls />
    </Physics>
  );
}
