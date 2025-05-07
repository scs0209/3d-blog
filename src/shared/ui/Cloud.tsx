import { Billboard, Text, TrackballControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { generate } from 'random-words';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as three from 'three';

// Word 컴포넌트의 props 타입 정의
interface WordProps {
  children: React.ReactNode; // children의 타입을 ReactNode로 정의
  position: three.Vector3; // position prop의 타입 정의
}

function Word({ children, position, ...props }: WordProps) {
  const color = new three.Color();
  const fontProps = {
    font: '/Inter-Bold.woff',
    fontSize: 2.5,
    letterSpacing: -0.05,
    lineHeight: 1,
    'material-toneMapped': false,
  };
  const ref = useRef<three.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const over = (e: React.PointerEvent) => {
    e.stopPropagation();
    setHovered(true);
  };
  const out = () => setHovered(false);

  // Change the mouse cursor on hover
  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // Tie component to the render-loop
  useFrame(() => {
    if (ref.current) {
      const material = ref.current.material as three.MeshStandardMaterial; // material 타입 캐스팅
      material.color.lerp(color.set(hovered ? '#fa2720' : 'white'), 0.1);
    }
  });

  return (
    <Billboard position={position} {...props}>
      <Text
        ref={ref}
        onPointerOver={over}
        onPointerOut={out}
        onClick={() => console.log('clicked')}
        color={hovered ? '#fa2720' : 'white'} // hover 상태에 따라 색상 변경
        {...fontProps}
      >
        {children}
      </Text>
    </Billboard>
  );
}

export function Cloud({ count = 8, radius = 20 }) {
  const { camera } = useThree(); // useThree 훅을 사용하여 카메라 가져오기

  // Create a count x count random words with spherical distribution
  const words = useMemo(() => {
    const temp: [three.Vector3, string][] = [];
    const spherical = new three.Spherical();
    const phiSpan = Math.PI / (count + 1); // 각 단어의 세로 간격
    const thetaSpan = (Math.PI * 2) / count; // 각 단어의 가로 간격

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const position = new three.Vector3().setFromSpherical(spherical.set(radius, phiSpan * (i + 1), thetaSpan * j));
        temp.push([position, generate({ exactly: 1, join: ' ' })]); // 단일 단어 생성
      }
    }
    return temp;
  }, [count, radius]);

  return (
    <>
      {words.map(([pos, word], index) => (
        <Word key={index} position={pos}>
          {word}
        </Word>
      ))}
      {/* <TrackballControls camera={camera} /> */}
      {/* 카메라를 TrackballControls에 전달 */}
    </>
  );
}
