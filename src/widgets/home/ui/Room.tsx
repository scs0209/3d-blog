'use client';

import { useGLTF } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import type * as three from 'three';

export function RoomModel(props: any) {
  const { nodes, materials } = useGLTF('/challenge_isometric_room--kidnap.glb');

  return (
    <group {...props} dispose={null}>
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
      </EffectComposer>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.UFO_UFO_0 as three.Mesh)?.geometry}
        material={materials.material}
        position={[-0.095, 520.293, 0.209]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.room_Room_0 as three.Mesh)?.geometry}
        material={materials.Room}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={2.3}
      />
      {/* <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Girl_Girl_0 as three.Mesh)?.geometry}
        material={materials.Girl}
        position={[0, 170.059, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      /> */}
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Cylinder001_Light_0 as three.Mesh)?.geometry}
        material={materials.Light}
        position={[-0.751, 350.425, 1.651]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Object001_UFO_0 as three.Mesh)?.geometry}
        material={materials.material}
        position={[-0.095, 376.338, 0.209]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Object002_Room_0 as three.Mesh)?.geometry}
        material={materials.Room}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={2.3}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Object003_Room_0 as three.Mesh)?.geometry}
        material={materials.Room}
        position={[0, 0, 28.301]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={2.3}
      />
    </group>
  );
}

useGLTF.preload('/challenge_isometric_room--kidnap.glb');
