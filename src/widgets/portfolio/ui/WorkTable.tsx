import { useGLTF } from '@react-three/drei';
import type * as three from 'three';

export function WorkTable(props: any) {
  const { nodes, materials } = useGLTF('/weathered_workstation.glb');
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh castShadow receiveShadow geometry={(nodes.Object_2 as three.Mesh)?.geometry} material={materials.desk} />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_3 as three.Mesh)?.geometry}
          material={materials.wire_224198087}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/weathered_workstation.glb');
