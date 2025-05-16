import { motion, useMotionTemplate, type MotionValue } from 'framer-motion';
import { useMemo } from 'react';

export const CardPattern = ({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) => {
  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  // 여러 색상 조합 중 하나를 랜덤으로 선택
  const gradientClasses = [
    'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-700',
    'bg-gradient-to-r from-blue-700 via-purple-500 to-cyan-400',
    'bg-gradient-to-r from-blue-900 via-blue-500 to-cyan-300',
    'bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-800',
    'bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-500',
    'bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-400',
    'bg-gradient-to-r from-fuchsia-400 via-orange-300 to-yellow-300',
    'bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400',
    'bg-gradient-to-r from-yellow-300 via-pink-400 to-fuchsia-500',
    'bg-gradient-to-r from-red-400 via-orange-300 to-yellow-300',
    'bg-gradient-to-r from-lime-300 via-emerald-400 to-cyan-400',
    'bg-gradient-to-r from-pink-400 via-blue-400 to-cyan-300',
    'bg-gradient-to-r from-orange-400 via-yellow-300 to-lime-300',
    'bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-emerald-400',
  ];
  const gradientClass = useMemo(() => {
    return gradientClasses[Math.floor(Math.random() * gradientClasses.length)];
  }, []);

  // 별 30개 랜덤 생성 (key는 uuid)
  const stars = Array.from({ length: 30 }).map(() => {
    const size = Math.random() * 1.2 + 0.6; // 0.6~1.8rem
    const top = `${Math.random() * 100}%`;
    const left = `${Math.random() * 100}%`;
    const opacity = 0.3 + Math.random() * 0.7;
    const rotate = Math.random() * 360;
    const key = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    return (
      <span
        key={key}
        style={{
          position: 'absolute',
          top,
          left,
          fontSize: `${size}rem`,
          opacity,
          color: '#fff',
          filter: 'drop-shadow(0 0 4px #7dd3fc88)',
          transform: `rotate(${rotate}deg)`,
        }}
      >
        ★
      </span>
    );
  });

  return (
    <div className='pointer-events-none'>
      <div className='absolute inset-0 z-10 rounded-2xl  [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50' />
      <motion.div
        className={`absolute inset-0 rounded-2xl ${gradientClass} opacity-0  group-hover/card:opacity-100 backdrop-blur-xl transition duration-500`}
        style={style}
      />
      <motion.div
        className='absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay  group-hover/card:opacity-100'
        style={style}
      >
        <div className='absolute inset-0 w-full h-full'>{stars}</div>
      </motion.div>
    </div>
  );
};
