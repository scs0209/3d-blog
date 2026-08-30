'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import ThemeToggleButton from '@/shared/ui/ThemeToggleButton';
import { SpaceBackground } from '@/widgets/post/ui/SpaceBackground';
import { authTheme } from './auth-theme';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const syne = { fontFamily: 'var(--font-syne), sans-serif' } as const;

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <div className={authTheme.shellRoot}>
      <div className={`relative min-h-screen w-full overflow-hidden ${authTheme.shell}`}>
        <SpaceBackground />

        <div className='relative z-10 flex min-h-screen flex-col'>
          <header className='flex items-center justify-between p-4 sm:px-6 lg:px-8 lg:pt-6'>
            <Link href='/' className={authTheme.backBtn} aria-label='홈으로 돌아가기'>
              <ArrowLeft size={14} aria-hidden />
              Home
            </Link>
            <ThemeToggleButton variant='blog' />
          </header>

          <div className='flex flex-1 items-center justify-center px-4 pb-10 sm:px-6 sm:pb-12'>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className='w-full max-w-md'
            >
              <div className='mb-6 text-center sm:mb-8'>
                <Link
                  href='/blog'
                  className='mb-4 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9a3c]/50 dark:focus-visible:ring-[#3de8ff]/50'
                  aria-label='블로그 홈'
                >
                  <Image src='/logo.png' alt='' width={28} height={28} />
                  <span
                    className={`text-base font-semibold tracking-wide sm:text-lg ${authTheme.titleGradient}`}
                    style={syne}
                  >
                    3D Tech Blog
                  </span>
                </Link>
                <h1 className={`text-xl font-bold sm:text-2xl ${authTheme.textPrimary}`} style={syne}>
                  {title}
                </h1>
                <p className={`mt-2 text-sm ${authTheme.textMuted}`}>{subtitle}</p>
              </div>

              <div className={`${authTheme.card} p-5 sm:p-8`}>
                <span className={authTheme.cardGlow} aria-hidden />
                {children}
              </div>
            </motion.div>
          </div>
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[28vh] ${authTheme.bottomVeil}`}
          aria-hidden
        />
      </div>
    </div>
  );
};
