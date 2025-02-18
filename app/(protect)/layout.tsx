import React from 'react';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/shadcn-ui/components/ui/sidebar';
import AuthSidebar from '@/shared/ui/AuthSidebar';

const ProtectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <main className="protect">
        <AuthSidebar />
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default ProtectLayout;
