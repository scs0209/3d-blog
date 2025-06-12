import { useGLTF } from '@react-three/drei';
import type * as three from 'three';

export function ExperienceDesk(props: any) {
  const { nodes, materials } = useGLTF('/sci-fi_computer_desk_console.glb');
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[-39.769, 2.09, -28.414]} rotation={[-1.682, -0.056, 0.342]} scale={[-0.245, 0.1, 0.139]}>
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.MaterialFBXASC032FBXASC0352142146907 as three.Mesh)?.geometry}
              material={materials.MaterialFBXASC032FBXASC0352142146907}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.MaterialFBXASC032FBXASC03511186 as three.Mesh)?.geometry}
              material={materials.MaterialFBXASC032FBXASC03511186}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.MaterialFBXASC032FBXASC0352142146802 as three.Mesh)?.geometry}
              material={materials.MaterialFBXASC032FBXASC0352142146802}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/sci-fi_computer_desk_console.glb');
