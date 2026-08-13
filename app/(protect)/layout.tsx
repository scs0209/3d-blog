import type React from 'react';
import { ScrollArea } from '@/shadcn-ui/components/ui/scroll-area';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/shadcn-ui/components/ui/sidebar';
import AuthSidebar from '@/shared/ui/AuthSidebar';
import ThemeToggleButton from '@/shared/ui/ThemeToggleButton';
import { AdminHeaderTitle } from '@/widgets/admin/ui/AdminHeader';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';

export const dynamic = 'force-dynamic';

const ProtectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={adminTheme.shell}>
      <div className={adminTheme.orbA} aria-hidden />
      <div className={adminTheme.orbB} aria-hidden />
      <div className={adminTheme.orbC} aria-hidden />

      <SidebarProvider
        className='relative z-10'
        style={{ '--sidebar-width': '16.5rem' } as React.CSSProperties}
      >
        <AuthSidebar />
        <SidebarInset className='relative m-2 max-h-[calc(100vh-1rem)] min-h-[calc(100vh-1rem)] overflow-hidden rounded-lg bg-transparent'>
          <div className={adminTheme.insetGlass} aria-hidden />

          <div className='relative z-10 flex h-full min-h-0 flex-col'>
            <div className='flex flex-shrink-0 items-center gap-4 p-6 pb-4'>
              <SidebarTrigger className={adminTheme.headerTrigger} aria-label='사이드바 열기/닫기' />
              <div className='h-6 w-px bg-[#ff9a3c]/30 dark:bg-[#3de8ff]/25' aria-hidden />
              <AdminHeaderTitle />
              <div className='ml-auto'>
                <ThemeToggleButton variant='admin' />
              </div>
            </div>

            <div className='min-h-0 flex-1 px-6 pb-6'>
              <ScrollArea className='h-full'>
                <div className={adminTheme.textPrimary}>{children}</div>
              </ScrollArea>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default ProtectLayout;
