'use client';
import { Environment, Lightformer, MeshTransmissionMaterial, Text3D } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three-stdlib';

export function AnimatedText() {
  const texture = useLoader(
    RGBELoader,
    'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr',
  );

  return (
    <group scale={0.02} position={[-0.5, 0, 1]} rotation={[0, Math.PI / 4, 0]}>
      <color attach='background' args={['#f2f2f5']} />
      <Text3D
        font='/gt.json'
        castShadow
        bevelEnabled
        scale={5}
        letterSpacing={-0.03}
        height={0.25}
        bevelSize={0.01}
        bevelSegments={10}
        curveSegments={128}
        bevelThickness={0.01}
      >
        3D Blog
        <MeshTransmissionMaterial
          backside={true}
          backsideThickness={0.15}
          samples={16}
          resolution={1024}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0.0}
          thickness={0.3}
          chromaticAberration={0.15}
          anisotropy={0.25}
          roughness={0}
          distortion={0.5}
          distortionScale={0.1}
          temporalDistortion={0}
          ior={1.25}
          color='white'
          background={texture}
        />
      </Text3D>

      <Environment resolution={32}>
        <group rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
          <Lightformer intensity={0.5} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={0.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
        </group>
      </Environment>
    </group>
  );
}
