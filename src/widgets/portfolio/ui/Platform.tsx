import { useGLTF } from '@react-three/drei';
import type * as three from 'three';

export function Platform(props: any) {
  const { nodes, materials } = useGLTF('/holo-puck.glb');
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Cylinder_Material_0 as three.Mesh)?.geometry}
            material={materials.Material}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[297.159, 297.159, 39.59]}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/holo-puck.glb');
