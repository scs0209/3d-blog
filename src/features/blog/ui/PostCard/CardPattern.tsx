import { motion, useMotionTemplate, type MotionValue } from 'framer-motion';
import { useMemo } from 'react';

const warmGradients = [
  'bg-gradient-to-r from-orange-500 via-amber-400 to-rose-500',
  'bg-gradient-to-r from-rose-500 via-orange-400 to-yellow-400',
  'bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-300',
  'bg-gradient-to-r from-amber-500 via-rose-400 to-orange-600',
];

const coolGradients = [
  'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600',
  'bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-600',
  'bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-700',
  'bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-600',
];

export const CardPattern = ({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) => {
  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  const warmGradient = useMemo(() => warmGradients[Math.floor(Math.random() * warmGradients.length)], []);
  const coolGradient = useMemo(() => coolGradients[Math.floor(Math.random() * coolGradients.length)], []);

  return (
    <div className='pointer-events-none'>
      <div className='absolute inset-0 z-10 rounded-2xl [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50' />
      <motion.div
        className={`absolute inset-0 rounded-2xl opacity-0 transition duration-500 group-hover/card:opacity-100 dark:hidden ${warmGradient}`}
        style={style}
      />
      <motion.div
        className={`absolute inset-0 hidden rounded-2xl opacity-0 transition duration-500 group-hover/card:opacity-100 dark:block ${coolGradient}`}
        style={style}
      />
    </div>
  );
};
