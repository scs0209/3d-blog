import { useGLTF } from '@react-three/drei';
import type * as three from 'three';

export function WatchRobot(props: any) {
  const { nodes, materials } = useGLTF('/robot_sitting.glb');
  return (
    <group {...props} dispose={null}>
      <group position={[0, -54.713, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <group rotation={[-Math.PI, 0, 0]}>
          <group position={[0, 0, 42.433]} scale={[97.129, 86.402, 76.792]}>
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes['BAYMAX_Material_#30_0'] as three.Mesh)?.geometry}
              material={materials?.Material_30}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.BAYMAX_WHITE_0 as three.Mesh)?.geometry}
              material={materials?.WHITE}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/robot_sitting.glb');
