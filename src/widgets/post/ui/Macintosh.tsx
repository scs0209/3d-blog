'use client';

import { Html, useGLTF } from '@react-three/drei';
import type * as three from 'three';
import { motion } from 'framer-motion';
import { BlogMainPage } from './BlogMainPage';

export const Macintosh = (props: any) => {
  const { nodes, materials } = useGLTF('/vintage_computer.glb');
  const { htmlScale = 1, htmlOpacity = 1 } = props;

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.215}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group scale={[1, 1.45, 1]}>
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_4 as three.Mesh)?.geometry}
              material={materials['Computer.Chassis']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_5 as three.Mesh)?.geometry}
              material={materials['Computer.Black']}
            />
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Object_7 as three.Mesh)?.geometry}
            material={materials.Monkey}
            position={[-0.735, -0.73, 1.462]}
            scale={[0.047, 0.047, 0.006]}
          />
          <group position={[0, 0.437, 1.255]} scale={[0.97, 0.97, 0.096]}>
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_9 as three.Mesh)?.geometry}
              material={materials['Computer.Monitor.Glass']}
              material-transparent={true}
              material-opacity={0.1}
            >
              <Html
                position={[0, 0, 0.1]}
                transform
                occlude
                distanceFactor={0.7}
                rotation={[0, 0, 0]}
                style={{ width: '100%', height: '100%' }}
              >
                <motion.div
                  className='macintosh-screen bg-gray-100 text-black'
                  style={{
                    width: '512px',
                    height: '342px',
                    transform: `scale(${1 * htmlScale})`,
                    opacity: htmlOpacity,
                    transformOrigin: 'center',
                    fontSize: '12px',
                    position: 'absolute',
                    top: '-171px',
                    left: '-256px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '3px',
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      backgroundColor: '#fff',
                      border: '2px solid #000',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                      borderRadius: '2px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#000',
                        color: '#fff',
                        padding: '2px 4px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>Macintosh Blog</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <span style={{ cursor: 'pointer' }}>□</span>
                        <span style={{ cursor: 'pointer' }}>×</span>
                      </div>
                    </div>
                    <div style={{ padding: '8px', flex: 1, overflow: 'auto' }}>
                      <BlogMainPage />
                    </div>
                  </div>
                </motion.div>
              </Html>
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

useGLTF.preload('/vintage_computer.glb');
