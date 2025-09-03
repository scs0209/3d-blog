import type React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/shadcn-ui/components/ui/sidebar';
import AuthSidebar from '@/shared/ui/AuthSidebar';
import { ScrollArea } from '@/shadcn-ui/components/ui/scroll-area';

// TODO: 레이아웃 수정 AuthSidebar가 안에 있어야 glassmorphism 효과를 줄 수 있는데 그러면 안에 컨텐츠랑 겹쳐버림
const ProtectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AuthSidebar />
      <SidebarInset
        className='bg-black/40
    backdrop-blur-2xl
    border-r border-white/20
    shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-[800px] p-4'
      >
          <ScrollArea className='h-[800px] w-full'>
        <main>
          <SidebarTrigger />
          {children}
        </main>
          </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProtectLayout;
