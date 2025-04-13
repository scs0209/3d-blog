import type React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/shadcn-ui/components/ui/sidebar';
import AuthSidebar from '@/shared/ui/AuthSidebar';

const ProtectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AuthSidebar />
      <main className='p-4 protect'>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default ProtectLayout;
