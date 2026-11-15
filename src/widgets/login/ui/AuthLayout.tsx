'use client';

import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { type FocusEvent, type ReactNode, useEffect, useState } from 'react';
import { useViewportProfile } from '@/shared/hooks/use-viewport-profile';
import { useVisitAccent } from '@/widgets/portfolio/mainboard/accent';
import { authTheme } from './auth-theme';

/** 3D 장면은 브라우저에서만 그린다 */
const AuthScene = dynamic(() => import('./AuthScene'), { ssr: false, loading: () => null });

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  /** 접근 카드에 찍히는 글씨 */
  pass?: string;
  children: ReactNode;
};

const SYNE = 'font-[family-name:var(--font-syne),sans-serif]';

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduced(query.matches);
    handleChange();
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);
  return reduced;
};

/**
 * 로그인·회원가입의 틀. 화면 전체가 포트폴리오와 같은 칩 안 도시이고,
 * 입력 면은 그 위에 얹힌다. 입력칸에 들어가면 접근 카드가 솟고,
 * 비밀번호를 치는 동안에는 슬롯을 지키는 꼬마가 등을 돌린다.
 */
export const AuthLayout = ({ title, subtitle, pass = 'ACCESS', children }: AuthLayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [shy, setShy] = useState(false);
  const viewport = useViewportProfile();
  const still = usePrefersReducedMotion();
  const accent = useVisitAccent();
  const compact = mounted && viewport.isMobile;

  useEffect(() => setMounted(true), []);

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      setActive(true);
      setShy(target.type === 'password');
    }
  };
  const handleBlur = () => {
    setActive(false);
    setShy(false);
  };

  return (
    <div className={authTheme.shellRoot}>
      <div className={`relative flex min-h-dvh w-full flex-col overflow-hidden ${authTheme.shell}`}>
        {/* 화면 전체가 장면이다 */}
        <div className='absolute inset-0'>
          {mounted ? (
            <AuthScene label={pass} accent={accent} compact={compact} still={still} shy={shy} active={active} />
          ) : null}
        </div>

        <header className='relative z-10 flex h-16 items-center justify-between px-5 md:px-12'>
          <Link
            href='/'
            className={`${SYNE} text-[15px] font-bold tracking-[0.04em] text-[#e9edf1]`}
            aria-label='포트폴리오로 이동'
          >
            AYAAN
          </Link>
          <Link href='/blog' className={authTheme.backBtn}>
            <ArrowLeft size={14} aria-hidden />
            블로그로
          </Link>
        </header>

        {/* 넓은 화면은 오른쪽에 떠 있는 면, 좁은 화면은 아래에서 올라온 시트 */}
        <div className='relative z-10 flex flex-1 items-end justify-center lg:items-center lg:justify-end lg:px-12 lg:pb-16'>
          <div
            className='w-full rounded-t-3xl bg-[#0b0e12]/90 px-6 pt-6 pb-8 lg:max-w-md lg:rounded-2xl lg:p-8'
            onFocusCapture={handleFocus}
            onBlurCapture={handleBlur}
          >
            <h1
              className={`${SYNE} break-keep text-[clamp(1.9rem,6vw,3rem)] font-bold leading-none tracking-[-0.02em] ${authTheme.textPrimary}`}
            >
              {title}
            </h1>
            <p className={`mt-2 mb-5 text-[15px] lg:mt-3 lg:mb-7 ${authTheme.textMuted}`}>{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
