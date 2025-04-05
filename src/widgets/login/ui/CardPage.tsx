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
    <div className="w-full h-screen flex justify-center items-center bg-black">
      <div style={{ width: '400px' }}>
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
        <div className="w-full relative">
          <div className="relative shadow-xl bg-gray-900 border-2 border-solid px-4 py-8 h-full overflow-hidden rounded-md flex flex-col justify-end items-start animate-gradient-border">
            <h1 className="w-full text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400 tracking-[0.2em] drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              로그인
            </h1>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-slate-300"
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded bg-slate-900/50 text-slate-300 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent backdrop-blur-sm placeholder-slate-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-slate-300"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded bg-slate-900/50 text-slate-300 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent backdrop-blur-sm placeholder-slate-500"
                />
              </div>
              <button
                type="button"
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/80 via-blue-500/80 to-cyan-500/80 text-white border-0 transition-all duration-300 hover:from-purple-600/90 hover:via-blue-600/90 hover:to-cyan-600/90 hover:scale-[1.02] shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]"
                onClick={handleSubmit}
              >
                로그인
              </button>
            </form>

            <Meteors number={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
