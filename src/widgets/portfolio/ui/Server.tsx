import { useGLTF } from '@react-three/drei';
import type * as three from 'three';

export function Server(props: any) {
  const { nodes, materials } = useGLTF('/server.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Server_Body_Placeable_0 as three.Mesh)?.geometry}
        material={materials.Placeable}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
    </group>
  );
}

useGLTF.preload('/server.glb');
