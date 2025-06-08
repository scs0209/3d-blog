'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type='button'
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-xl border border-[#858585] bg-[#232323] shadow-[0_0_16px_#fff,0_0_4px_#fff] hover:bg-[#333] transition-all duration-300
        dark:shadow-[0_0_16px_#FFD600,0_0_4px_#FFD600]
      `}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label='테마 변경'
    >
      {theme === 'light' ? <Sun size={22} className='text-white' /> : <Moon size={22} className='text-[#FFD600]' />}
    </button>
  );
}
