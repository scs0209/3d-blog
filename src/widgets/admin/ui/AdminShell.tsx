'use client';

import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import { cn } from '@/shadcn-ui/lib/utils';
import AuthSidebar from '@/shared/ui/AuthSidebar';
import ThemeToggleButton from '@/shared/ui/ThemeToggleButton';
import { AdminDock } from '@/widgets/admin/ui/AdminDock';
import { AdminHeaderTitle } from '@/widgets/admin/ui/AdminHeader';
import { AdminNavigationProgress } from '@/widgets/admin/ui/AdminNavigationProgress';
import { AdminOrnament } from '@/widgets/admin/ui/AdminOrnament';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';

type AdminShellProps = {
  children: ReactNode;
};

export const AdminShell = ({ children }: AdminShellProps) => {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  const handleCloseNav = () => setNavOpen(false);

  return (
    <div className={adminTheme.shell}>
      <div className={adminTheme.orbA} aria-hidden />
      <div className={adminTheme.orbB} aria-hidden />
      <div className={adminTheme.orbC} aria-hidden />

      <div className={adminTheme.stage}>
        <div className={adminTheme.stageRow}>
          <AdminOrnament />

          <div className={adminTheme.window}>
            <span className={adminTheme.windowSheen} aria-hidden />
            <AdminNavigationProgress />

            <div
              className={cn(
                'absolute inset-y-0 left-0 z-30 w-[15.5rem] bg-[#1c1828]/85 backdrop-blur-2xl transition-transform md:static md:z-0 md:translate-x-0 md:bg-transparent md:backdrop-blur-none',
                navOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
              )}
            >
              <div className='flex justify-end p-3 md:hidden'>
                <button
                  type='button'
                  className='flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/12'
                  onClick={handleCloseNav}
                  aria-label='메뉴 닫기'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
              <AuthSidebar onNavigate={handleCloseNav} />
            </div>

            {navOpen && (
              <button
                type='button'
                className='absolute inset-0 z-20 bg-black/40 md:hidden'
                aria-label='메뉴 닫기'
                onClick={handleCloseNav}
              />
            )}

            <div className='relative z-10 flex min-w-0 flex-1 flex-col'>
              <div className='flex shrink-0 items-center gap-3 px-6 py-5'>
                <button
                  type='button'
                  className={adminTheme.headerTrigger}
                  onClick={() => setNavOpen(true)}
                  aria-label='메뉴 열기'
                  aria-expanded={navOpen}
                >
                  <Menu className='h-5 w-5' />
                </button>
                <div className='hidden items-center gap-1 md:flex'>
                  <button
                    type='button'
                    className='flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white'
                    onClick={() => router.back()}
                    aria-label='뒤로'
                  >
                    <ChevronLeft className='h-5 w-5' />
                  </button>
                  <button
                    type='button'
                    className='flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white'
                    onClick={() => router.forward()}
                    aria-label='앞으로'
                  >
                    <ChevronRight className='h-5 w-5' />
                  </button>
                </div>
                <AdminHeaderTitle />
                <div className='ml-auto'>
                  <ThemeToggleButton variant='admin' />
                </div>
              </div>

              <div className='min-h-0 flex-1 overflow-y-auto px-6 pb-6'>{children}</div>
            </div>
          </div>
        </div>

        <AdminDock />
      </div>
    </div>
  );
};
