import { motion, useMotionTemplate, type MotionValue } from 'framer-motion';

export const CardPattern = ({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) => {
  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  // 별 80개 랜덤 생성 (key는 uuid)
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
        className='absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-blue-700 opacity-0  group-hover/card:opacity-100 backdrop-blur-xl transition duration-500'
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
