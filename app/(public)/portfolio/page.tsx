'use client';

import {
  ContactMe,
  ExperienceDesk,
  ExperiencePerson,
  GridBackground,
  HoloText,
  Server,
  TypingMan,
  WorkTable,
} from '@/widgets/portfolio/ui';
import { HoloTable } from '@/widgets/portfolio/ui/HoloTable';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

export default function PortfolioPage() {
  return (
    <div className='h-screen w-screen bg-gray-900'>
      <Canvas camera={{ position: [2, 5, 2], fov: 90, near: 0.1, far: 10000 }}>
        {/* 사이버펑크 그리드 배경 */}
        <GridBackground />

        {/* 메인 3D 모델 */}
        <HoloTable scale={0.5} />
        <WorkTable scale={0.03} rotation={[0, Math.PI / 2, 0]} position={[4, 0, 0]} />
        <TypingMan scale={0.4} rotation={[0, -Math.PI / 2, 0]} position={[4.4, 0, 0]} />
        <ContactMe scale={0.4} rotation={[0, Math.PI / 2, 0]} position={[-4, 0, 0]} />
        {[0, 1, 2].map((index) => (
          <Server key={index} scale={0.005} rotation={[0, Math.PI / 2, 0]} position={[0, 0, -4 - index * 1]} />
        ))}

        {/* 홀로그램 이름표들 */}
        <HoloText text='ABOUT ME' position={[3.5, -1.8, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} color='#8b5cf6' />
        <HoloText text='CONTACT' position={[-2, -1.8, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} color='#8b5cf6' />
        <HoloText text='WORKS' position={[-1.3, -1.8, -4.5]} rotation={[-Math.PI / 2, 0, 0]} color='#8b5cf6' />
        <ExperiencePerson scale={0.4} rotation={[0, Math.PI, 0]} position={[0, 0, 3]} />
        <ExperienceDesk scale={0.1} rotation={[0, 0, 0]} position={[3.5, 0, 5.3]} />
        {/* 메인 조명 */}
        <ambientLight intensity={0.2} color='#002244' />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color='#ffffff' />

        <EffectComposer>
          <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={5} />
        </EffectComposer>

        {/* 분위기 조명 */}
        <pointLight position={[0, 5, 0]} intensity={0.3} color='#00ffff' />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
