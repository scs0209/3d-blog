import type React from 'react';
import { AdminShell } from '@/widgets/admin/ui/AdminShell';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';

const ProtectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={adminTheme.textPrimary}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
};

export default ProtectLayout;
