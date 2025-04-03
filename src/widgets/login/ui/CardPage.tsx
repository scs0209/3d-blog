'use client';

import { useState, useEffect, Suspense } from 'react';
import { geometry } from 'maath';
import { Container, Content, Fullscreen } from '@react-three/uikit';
import {
  Environment,
  MeshPortalMaterial,
  PerspectiveCamera,
  Stars,
} from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Physical } from './Simulation';
import { Meteors } from '@/shared/ui/Meteors';

const cardGeometry = new geometry.RoundedPlaneGeometry(16, 16, 0.025);

const CardPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div style={{ width: '400px' }}>
        <Canvas
          camera={{ position: [0, 0, 18], fov: 32.5 }}
          style={{ touchAction: 'none', width: '400px', height: '400px' }}
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
            <Fullscreen flexDirection="column" distanceToCamera={10}>
              <Container
                backgroundColor={0xffffff}
                dark={{ backgroundColor: 0x0 }}
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
                    <MeshPortalMaterial transparent>
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
                      <Physical />
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
        <div className=" w-full relative max-w-xs">
          <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-md flex flex-col justify-end items-start">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-white"
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-white"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                className="border px-4 py-1 rounded-lg  border-gray-500 text-gray-300"
                onClick={handleSubmit}
              >
                로그인
              </button>
            </form>

            {/* Meaty part - Meteor effect */}
            <Meteors number={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
