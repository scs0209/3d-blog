import { useGLTF } from '@react-three/drei';
import type * as three from 'three';

export function ResumeConsole(props: any) {
  const { nodes, materials } = useGLTF('/console_thing.glb');
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.defaultMaterial as three.Mesh)?.geometry}
            material={materials.lambert4}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.defaultMaterial_1 as three.Mesh)?.geometry}
            material={materials.lambert4}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.defaultMaterial_2 as three.Mesh)?.geometry}
            material={materials.lambert4}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.defaultMaterial_3 as three.Mesh)?.geometry}
            material={materials.lambert4}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.defaultMaterial_4 as three.Mesh)?.geometry}
            material={materials.lambert4}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/console_thing.glb');
