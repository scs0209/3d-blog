import type React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/shadcn-ui/components/ui/sidebar';
import AuthSidebar from '@/shared/ui/AuthSidebar';
import { ScrollArea } from '@/shadcn-ui/components/ui/scroll-area';

const ProtectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative'>
      {/* Global Decorative Elements */}
      <div className='absolute top-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl' />
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl' />
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl' />

      <SidebarProvider className='relative z-10'>
        <AuthSidebar />
        <SidebarInset className='relative bg-transparent rounded-lg m-2 min-h-[calc(100vh-1rem)] max-h-[calc(100vh-1rem)] overflow-hidden'>
          {/* Enhanced Glassmorphism Background */}
          <div className='absolute inset-0 bg-gradient-to-br from-white/15 via-white/8 to-white/3 backdrop-blur-xl border-l border-white/25 rounded-3xl h-full' />

          {/* Content Area */}
          <div className='relative z-10 h-full flex flex-col min-h-0'>
            {/* Header - Fixed */}
            <div className='flex items-center gap-4 p-6 pb-4 flex-shrink-0'>
              <SidebarTrigger className='text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-lg p-2' />
              <div className='h-6 w-px bg-white/30' />
              <h1 className='text-2xl font-semibold text-white/95 drop-shadow-lg'>관리자 대시보드</h1>
            </div>

            {/* Scrollable Content */}
            <div className='flex-1 min-h-0 px-6 pb-6'>
              <ScrollArea className='h-full'>
                <div className='text-white/90'>{children}</div>
              </ScrollArea>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default ProtectLayout;
