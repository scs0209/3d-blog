'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { BlogSearch } from './BlogSearch';
import { MobileNavbar } from './MobileNavbar';

const linkClass = `px-2.5 py-1.5 text-[14px] text-[#b5bec7] transition-colors hover:text-white ${blogTheme.focus}`;

/** 블로그 머리줄: 포트폴리오와 같은 이름표, 그 옆에 이 화면이 무엇인지 */
export default function BlogHeader({ wide = false }: { wide?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <header
        className={`mx-auto flex h-16 w-full items-center justify-between ${wide ? '' : `mb-10 max-w-4xl ${blogTheme.chromeBar}`}`}
      >
        <div className='flex min-w-0 items-baseline gap-3'>
          <Link
            href='/'
            aria-label='포트폴리오로 이동'
            className={`font-[family-name:var(--font-syne),sans-serif] text-[15px] font-bold tracking-[0.04em] text-[#e9edf1] ${blogTheme.focus}`}
          >
            AYAAN
          </Link>
          <Link
            href='/blog'
            aria-label='블로그 처음으로 이동'
            className={`truncate text-[14px] text-[#b5bec7] transition-colors hover:text-white ${blogTheme.focus}`}
          >
            Blog
          </Link>
        </div>

        <nav className='flex items-center gap-1' aria-label='블로그 메뉴'>
          <Link href='/' className={`hidden sm:block ${linkClass}`}>
            Portfolio
          </Link>
          {isAuthenticated ? (
            <button type='button' onClick={handleLogout} className={`hidden sm:block ${linkClass}`}>
              Logout
            </button>
          ) : (
            <Link href='/login' className={`hidden sm:block ${linkClass}`}>
              Login
            </Link>
          )}
          <BlogSearch />
          <button
            type='button'
            className={`p-2 lg:hidden ${blogTheme.iconBtn}`}
            onClick={() => setMenuOpen(true)}
            aria-label='메뉴 열기'
          >
            <Menu size={18} />
          </button>
        </nav>
      </header>

      <MobileNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
}
