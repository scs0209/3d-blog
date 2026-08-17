'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const twilightStars = Array.from({ length: 24 }).map((_, i) => {
  const size = `${(i % 3) * 0.5 + 1.2}px`;
  const top = `${(i * 19) % 100}%`;
  const left = `${(i * 31) % 100}%`;
  const opacity = 0.25 + ((i * 11) % 50) / 100;
  return (
    <span
      key={`star-light-${i}`}
      className='absolute block rounded-full bg-[#ffc8a0] dark:hidden'
      style={{
        width: size,
        height: size,
        top,
        left,
        opacity,
      }}
    />
  );
});

const darkStars = Array.from({ length: 40 }).map((_, i) => {
  const size = `${(i % 4) * 0.35 + 0.8}px`;
  const top = `${(i * 17) % 100}%`;
  const left = `${(i * 29) % 100}%`;
  const opacity = 0.2 + ((i * 13) % 60) / 100;
  return (
    <span
      key={`star-dark-${i}`}
      className='absolute hidden rounded-full bg-[#7ec8ff] dark:block'
      style={{
        width: size,
        height: size,
        top,
        left,
        opacity,
      }}
    />
  );
});

type PlanetPalette = {
  sphere: string;
  bands?: string;
  atmosphere: string;
  ringStroke?: string;
  ringFill?: string;
};

type PlanetConfig = {
  id: string;
  size: number;
  top: string;
  left: string;
  floatDuration: number;
  hasRing?: boolean;
  light: PlanetPalette;
  dark: PlanetPalette;
};

const planets: PlanetConfig[] = [
  {
    id: 'ember-giant',
    size: 68,
    top: '11%',
    left: '86%',
    floatDuration: 9,
    hasRing: true,
    light: {
      sphere: 'radial-gradient(circle at 32% 28%, #ffd4a8 0%, #ff9a3c 28%, #c44d2a 62%, #3a1428 100%)',
      bands:
        'repeating-linear-gradient(175deg, transparent 0px, transparent 7px, rgba(255,220,180,0.07) 7px, rgba(255,220,180,0.07) 9px)',
      atmosphere: 'rgba(255, 154, 60, 0.28)',
      ringStroke: 'rgba(255, 200, 140, 0.35)',
      ringFill: 'rgba(255, 180, 100, 0.06)',
    },
    dark: {
      sphere: 'radial-gradient(circle at 32% 28%, #9ee8ff 0%, #3de8ff 24%, #1a6a9a 58%, #061428 100%)',
      bands:
        'repeating-linear-gradient(168deg, transparent 0px, transparent 6px, rgba(180,240,255,0.08) 6px, rgba(180,240,255,0.08) 8px)',
      atmosphere: 'rgba(61, 232, 255, 0.22)',
      ringStroke: 'rgba(126, 200, 255, 0.3)',
      ringFill: 'rgba(61, 232, 255, 0.05)',
    },
  },
  {
    id: 'dusk-moon',
    size: 30,
    top: '72%',
    left: '9%',
    floatDuration: 7,
    light: {
      sphere: 'radial-gradient(circle at 35% 30%, #f0d0c0 0%, #b88878 35%, #5a3848 72%, #1a0e18 100%)',
      atmosphere: 'rgba(200, 140, 120, 0.12)',
    },
    dark: {
      sphere: 'radial-gradient(circle at 35% 30%, #c8d8e8 0%, #788898 38%, #384858 74%, #0a0e14 100%)',
      atmosphere: 'rgba(126, 200, 255, 0.1)',
    },
  },
  {
    id: 'violet-core',
    size: 48,
    top: '30%',
    left: '14%',
    floatDuration: 11,
    hasRing: true,
    light: {
      sphere: 'radial-gradient(circle at 30% 26%, #f0c0e8 0%, #c878a8 30%, #6a2868 65%, #180818 100%)',
      atmosphere: 'rgba(200, 120, 180, 0.2)',
      ringStroke: 'rgba(232, 160, 200, 0.25)',
      ringFill: 'rgba(200, 120, 180, 0.04)',
    },
    dark: {
      sphere: 'radial-gradient(circle at 30% 26%, #c0d0ff 0%, #6366f1 32%, #312e81 68%, #0a0618 100%)',
      atmosphere: 'rgba(99, 102, 241, 0.22)',
      ringStroke: 'rgba(129, 140, 248, 0.28)',
      ringFill: 'rgba(99, 102, 241, 0.05)',
    },
  },
];

const PlanetRing = ({ size, stroke, fill }: { size: number; stroke: string; fill: string }) => {
  const w = size * 2.15;
  const h = size * 0.72;
  return (
    <svg
      className='pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2'
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden='true'
    >
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 2} ry={h / 2 - 2} fill={fill} />
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 2} ry={h / 2 - 2} fill='none' stroke={stroke} strokeWidth='1.5' />
    </svg>
  );
};

const Planet = ({ planet, isDark }: { planet: PlanetConfig; isDark: boolean }) => {
  const palette = isDark ? planet.dark : planet.light;

  return (
    <div
      className='blog-planet-float absolute'
      style={{
        top: planet.top,
        left: planet.left,
        width: planet.size,
        height: planet.size,
        ['--float-duration' as string]: `${planet.floatDuration}s`,
      }}
      aria-hidden
    >
      <div className='absolute inset-0' style={{ width: planet.size, height: planet.size }}>
        <div
          className='absolute inset-[-20%] rounded-full opacity-70 blur-xl'
          style={{ background: `radial-gradient(circle, ${palette.atmosphere} 0%, transparent 70%)` }}
        />
        {planet.hasRing && palette.ringStroke && (
          <PlanetRing size={planet.size} stroke={palette.ringStroke} fill={palette.ringFill ?? 'transparent'} />
        )}
        <div
          className='relative overflow-hidden rounded-full'
          style={{ width: planet.size, height: planet.size }}
        >
          <div className='absolute inset-0 rounded-full' style={{ background: palette.sphere }} />
          {palette.bands && (
            <div className='absolute inset-0 rounded-full opacity-80' style={{ background: palette.bands }} />
          )}
        </div>
      </div>
    </div>
  );
};

export const SpaceBackground = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  return (
    <div className='pointer-events-none absolute inset-0 z-0 overflow-hidden' aria-hidden>
      <div className='absolute inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-[#ff9a3c]/25 via-[#8a4a68]/[0.15] to-transparent dark:hidden' />
      <div className='absolute inset-0 hidden bg-gradient-to-b from-[#000010]/80 via-transparent to-[#000008]/60 dark:block' />

      {twilightStars}
      {darkStars}

      <div className='absolute -left-32 top-[10%] h-96 w-96 rounded-full bg-[#8a4a68]/20 blur-3xl dark:bg-[#3de8ff]/[0.06]' />
      <div className='absolute -right-24 top-[30%] h-72 w-72 rounded-full bg-[#ffc090]/[0.15] blur-3xl dark:bg-[#6366f1]/[0.08]' />

      {planets.map((planet) => (
        <Planet key={planet.id} planet={planet} isDark={isDark} />
      ))}
    </div>
  );
};
