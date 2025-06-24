import { useGLTF, Html } from '@react-three/drei';
import * as three from 'three';
import { useState, useEffect } from 'react';

const screenGlowMaterial = new three.MeshStandardMaterial({
  color: '#8ff0ff',
  emissive: '#8ff0ff',
  emissiveIntensity: 0.5,
  toneMapped: false,
});

interface ComputerProps {
  showLoading?: boolean;
  [key: string]: any;
}

export function Computer({ showLoading = false, ...props }: ComputerProps) {
  const { nodes } = useGLTF('/computer.glb');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 로딩 진행률 애니메이션
  useEffect(() => {
    if (showLoading) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2; // 2%씩 증가
        });
      }, 60); // 60ms마다 업데이트 (3초 동안)

      return () => clearInterval(interval);
    }
  }, [showLoading]);

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Object_5 as three.Mesh)?.geometry}
        material={screenGlowMaterial}
        position={[-0.056, 0.066, 0.3]}
        scale={[0.531, 0.354, 0.001]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Object_7 as three.Mesh)?.geometry}
        material={screenGlowMaterial}
        position={[0.15, -0.078, 0.383]}
        scale={[0.513, 0.342, 0.001]}
      />

      {/* 메인 화면에 로딩 UI */}
      {showLoading && (
        <Html
          position={[-0.056, 0.066, 0.301]}
          transform
          occlude
          scale={0.1}
          style={{
            width: '320px',
            height: '240px',
            background: 'rgba(0, 0, 0, 0.95)',
            border: '2px solid #00ffff',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#00ffff',
            textShadow: '0 0 10px #00ffff',
            pointerEvents: 'none',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              letterSpacing: '4px',
              textShadow: '0 0 15px #00ffff',
              marginBottom: '10px',
            }}
          >
            WORKS
          </div>

          <div
            style={{
              width: '240px',
              height: '8px',
              background: '#222',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '2px solid #00ffff',
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
            }}
          >
            <div
              style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #00ffff, #0088ff)',
                borderRadius: '2px',
                boxShadow: '0 0 15px #00ffff',
                transition: 'width 0.1s ease-out',
              }}
            />
          </div>

          <div
            style={{
              fontSize: '18px',
              opacity: 0.9,
              animation: 'pulse 2s infinite',
              textAlign: 'center',
            }}
          >
            Loading projects...
          </div>
        </Html>
      )}

      {/* 보조 화면에도 간단한 로딩 표시 */}
      {showLoading && (
        <Html
          position={[0.15, -0.078, 0.384]}
          transform
          occlude
          scale={0.08}
          style={{
            width: '300px',
            height: '200px',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #00ffff',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#00ffff',
            textShadow: '0 0 8px #00ffff',
            pointerEvents: 'none',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              animation: 'pulse 1.5s infinite',
              fontWeight: 'bold',
              letterSpacing: '2px',
            }}
          >
            SYSTEM
            <br />
            LOADING...
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload('/computer.glb');
