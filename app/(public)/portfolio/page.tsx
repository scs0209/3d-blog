'use client';

import { MagicRoom } from '@/widgets/portfolio/ui';
import { Canvas } from '@react-three/fiber';

export default function PortfolioPage() {
  return (
    <div className='h-screen w-screen'>
      <Canvas camera={{ position: [0, 5, 15], fov: 50, near: 0.1, far: 100 }}>
        <MagicRoom scale={0.03} />
      </Canvas>
    </div>
  );
}
