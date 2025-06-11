'use client';

import { MagicRoom, GridBackground } from '@/widgets/portfolio/ui';
import { Canvas } from '@react-three/fiber';

export default function PortfolioPage() {
  return (
    <div className='h-screen w-screen bg-slate-900'>
      <Canvas camera={{ position: [2, 5, 0], fov: 90, near: 0.1, far: 10000 }}>
        {/* 사이버펑크 그리드 배경 */}
        <GridBackground />

        {/* 메인 3D 모델 */}
        <MagicRoom scale={0.01} />

        {/* 메인 조명 */}
        <ambientLight intensity={0.2} color='#002244' />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color='#ffffff' />

        {/* 분위기 조명 */}
        <pointLight position={[0, 5, 0]} intensity={0.3} color='#00ffff' />
      </Canvas>
    </div>
  );
}
