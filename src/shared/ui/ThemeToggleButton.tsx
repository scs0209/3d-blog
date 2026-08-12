'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/shadcn-ui/lib/utils';

type ThemeToggleVariant = 'navbar' | 'blog' | 'admin';

type ThemeToggleButtonProps = {
  className?: string;
  variant?: ThemeToggleVariant;
};

const variantClass: Record<ThemeToggleVariant, string> = {
  // 홈 Navbar Log In 버튼과 동일 톤
  navbar:
    'h-9 w-9 rounded-xl border border-[#858585] text-gray-300 hover:border-white hover:text-white hover:shadow-[0_0_10px_#ffffff]',
  // 블로그 헤더 네비 버튼과 동일 톤
  blog: 'h-9 w-9 rounded-lg border border-[#ff9a3c]/30 bg-[#2a1545]/60 text-[#ffc8a0] transition hover:border-[#ff9a3c]/55 hover:bg-[#3d1f5c]/70 hover:shadow-[0_0_12px_rgba(255,154,60,0.2)] dark:border-[#3de8ff]/25 dark:bg-black/35 dark:text-[#3de8ff] dark:hover:border-[#3de8ff]/50 dark:hover:bg-black/50 dark:hover:shadow-[0_0_12px_rgba(61,232,255,0.15)]',
  // 어드민 헤더용 최소 스타일
  admin:
    'h-9 w-9 rounded-lg border border-white/25 text-white/80 hover:border-white/50 hover:text-white hover:bg-white/10',
};

export default function ThemeToggleButton({ className, variant = 'navbar' }: ThemeToggleButtonProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={cn('inline-flex shrink-0', variantClass[variant], 'opacity-0', className)} aria-hidden />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type='button'
      className={cn(
        'inline-flex items-center justify-center transition-all duration-300',
        variantClass[variant],
        className,
      )}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label='테마 변경'
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
