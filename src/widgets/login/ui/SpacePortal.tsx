'use client';

import {
  Environment,
  MeshPortalMaterial,
  PerspectiveCamera,
  Stars,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Container, Content, Fullscreen } from '@react-three/uikit';
import React, { Suspense } from 'react';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { geometry } from 'maath';
import AstronautModel from './AstronautModel';

const cardGeometry = new geometry.RoundedPlaneGeometry(16, 16, 0.025);

const SpacePortal = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 32.5 }}
      style={{
        touchAction: 'none',
        width: '400px',
        height: '400px',
      }}
      gl={{ localClippingEnabled: true }}
    >
      <ambientLight intensity={Math.PI} />
      <spotLight
        decay={0}
        position={[0, 5, 10]}
        angle={0.25}
        penumbra={1}
        intensity={2}
        castShadow
      />
      <Suspense fallback="Loading">
        <Fullscreen
          flexDirection="column"
          distanceToCamera={10}
          backgroundColor="white"
        >
          <Container
            backgroundColor={0xffffff}
            // dark={{ backgroundColor: 0x0 }}
            borderRadius={20}
            cursor="pointer"
            flexDirection="column"
            zIndexOffset={10}
            width={400}
            height={400}
          >
            <Content
              transformTranslateZ={2}
              padding={14}
              keepAspectRatio={false}
              width={400}
              height={400}
            >
              <mesh geometry={cardGeometry} scale={[3, 3, 3]}>
                <MeshPortalMaterial transparent resolution={256} blur={0}>
                  <color attach="background" args={['#000033']} />
                  <ambientLight intensity={1.5} />
                  <Environment preset="city" />
                  <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                  />
                  <AstronautModel />
                  <PerspectiveCamera
                    makeDefault
                    position={[0, 0, 5]}
                    fov={75}
                  />
                </MeshPortalMaterial>
              </mesh>
              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.9}
                  intensity={1.5}
                />
              </EffectComposer>
            </Content>
          </Container>
        </Fullscreen>
      </Suspense>
    </Canvas>
  );
};

export default SpacePortal;
