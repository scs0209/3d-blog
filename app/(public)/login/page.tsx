'use client';

import { signIn } from 'next-auth/react';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { Fullscreen, Text } from '@react-three/uikit';
import { Button } from '@react-three/uikit-default';
import { Environment } from '@react-three/drei';
import { CardPage } from '@/widgets/login/ui/CardPage';
import { Floating } from '@/widgets/login/ui/Simulation';

function Rig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.pointer.x * 2, state.pointer.y * 2, 18],
      0.35,
      delta,
    );
    state.camera.lookAt(0, 0, -10);
  });
  return null;
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 32.5 }}
      style={{ height: '100dvh', touchAction: 'none' }}
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
      <Suspense fallback="Loading...">
        <CardPage />
      </Suspense>
      <Fullscreen
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="center"
        paddingBottom={32}
      >
        <Button
          onClick={() =>
            window.open(
              'https://github.com/pmndrs/uikit/tree/main/examples/card',
              '_blank',
            )
          }
        >
          <Text>Source Code</Text>
        </Button>
      </Fullscreen>
      <Environment preset="city" />
      <Rig />
    </Canvas>
    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <div className="w-full max-w-sm p-6 bg-white rounded shadow-md">
    //     <h2 className="mb-4 text-2xl font-bold text-center">로그인</h2>
    //     {error && (
    //       <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded">
    //         {error}
    //       </div>
    //     )}
    //     <form onSubmit={handleSubmit}>
    //       <div className="mb-4">
    //         <label
    //           htmlFor="email"
    //           className="block mb-1 text-sm font-medium text-gray-700"
    //         >
    //           이메일
    //         </label>
    //         <input
    //           type="email"
    //           id="email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           required
    //           className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         />
    //       </div>
    //       <div className="mb-4">
    //         <label
    //           htmlFor="password"
    //           className="block mb-1 text-sm font-medium text-gray-700"
    //         >
    //           비밀번호
    //         </label>
    //         <input
    //           type="password"
    //           id="password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           required
    //           className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         />
    //       </div>
    //       <button
    //         type="button"
    //         className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    //         onClick={handleSubmit}
    //       >
    //         로그인
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
};

export default LoginPage;
