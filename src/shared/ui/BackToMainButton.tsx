'use client';

import { useRouter } from 'next/navigation';

export default function BackToMainButton() {
  const router = useRouter();

  const handleBackTo3D = () => {
    router.push('/blog');
  };

  return (
    <button
      type='button'
      onClick={handleBackTo3D}
      className='fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition-colors'
    >
      🚀 3D 메인으로
    </button>
  );
}
