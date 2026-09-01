import { motion, useMotionTemplate, type MotionValue } from 'framer-motion';
import { useMemo } from 'react';

/** Glass Orbit blog card hover sheen — zone palette only (no generic blue/indigo) */
const warmGradients = [
  'bg-gradient-to-r from-[#e86a20]/55 via-[#ff9a3c]/45 to-[#ffc8a0]/40',
  'bg-gradient-to-r from-[#ff9a3c]/50 via-[#ffb870]/40 to-[#ffd4b0]/35',
  'bg-gradient-to-r from-[#c94e12]/50 via-[#ff9a3c]/42 to-[#ffb870]/38',
  'bg-gradient-to-r from-[#ff9a3c]/48 via-[#ffc8a0]/38 to-[#ffd4b0]/32',
];

const coolGradients = [
  'bg-gradient-to-r from-[#2a9fd4]/50 via-[#3de8ff]/42 to-[#7ec8ff]/38',
  'bg-gradient-to-r from-[#3de8ff]/48 via-[#7ec8ff]/40 to-[#b8e4ff]/34',
  'bg-gradient-to-r from-[#1a7a9e]/52 via-[#3de8ff]/44 to-[#7ec8ff]/36',
  'bg-gradient-to-r from-[#3de8ff]/46 via-[#5ef0ff]/38 to-[#b8e4ff]/32',
];

const hashSeed = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

type CardPatternProps = {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  seed?: string | number;
};

export const CardPattern = ({ mouseX, mouseY, seed = 'card' }: CardPatternProps) => {
  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };
  const seedKey = String(seed);

  const warmGradient = useMemo(
    () => warmGradients[hashSeed(`${seedKey}-warm`) % warmGradients.length],
    [seedKey],
  );
  const coolGradient = useMemo(
    () => coolGradients[hashSeed(`${seedKey}-cool`) % coolGradients.length],
    [seedKey],
  );

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
